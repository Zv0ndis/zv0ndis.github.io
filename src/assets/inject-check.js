// Prompt-injection checker. scan() is pure so scripts/inject-check.mjs can run it in node;
// the page wiring at the bottom only runs in a browser. Nothing leaves the browser.
// shortcut: heuristics only (no model), phrases are matched per line, so a phrase split across lines is missed.

const SEVERITY = {
    tags: 3,
    varsel: 3,
    bidi: 3,
    override: 3,
    template: 3,
    secrecy: 3,
    exfil: 3,
    base64: 3,
    invisible: 2,
    control: 2,
    role: 2,
    leak: 2,
    comment: 1,
    hiddencss: 1,
};

const PHRASES = [
    [
        "override",
        /\b(ignore|disregard|forget|override|bypass)\b.{0,40}\b(previous|prior|above|earlier|preceding|all|any|system|your|the)\b.{0,30}\b(instructions?|prompts?|rules|directions|guidelines|context)/i,
    ],
    [
        "override",
        /\b(ignoruj|zapome[nň]|nedbej|přeskoč|nerespektuj)\S*.{0,40}(předchozí|výše|všechn|dosavadní|své|systémov)\S*.{0,30}(instrukc|pokyn|pravid|příkaz|zadání)/iu,
    ],
    [
        "role",
        /\b(you are now|from now on,? you|pretend (to be|you are)|new instructions|developer mode|jailbreak|do anything now)\b/i,
    ],
    [
        "role",
        /\b(nyní jsi|od teď jsi|odteď jsi|chovej se jako|předstírej, že|nové instrukce|nové pokyny)/iu,
    ],
    [
        "template",
        /<\|(im_start|im_end|system|user|assistant|endoftext)\|>|\[\/?INST\]|<<\/?SYS>>|<\/?(system|instructions?|admin)>|^\s*#{2,}\s*(system|instructions?)\b|^\s*(system|assistant)\s*:/i,
    ],
    [
        "secrecy",
        /\b(do not|don't|never)\s+(tell|mention|reveal|inform|show|alert)\b.{0,30}\b(user|human|anyone|reader)/i,
    ],
    ["secrecy", /\b(neříkej|nezmiňuj|neprozrazuj|neukazuj)\S*.{0,30}uživatel/iu],
    [
        "leak",
        /\b(reveal|print|repeat|output|show|leak)\b.{0,30}\b(system prompt|your (instructions|prompt|rules))/i,
    ],
    [
        "exfil",
        /!\[[^\]]*\]\(\s*https?:\/\/[^)\s]*\?[^)\s]*=|<img\b[^>]*\bsrc\s*=\s*["']?https?:\/\/[^"'\s>]*\?[^"'\s>]*=/i,
    ],
];

const HIDDEN_CSS =
    /display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0(?![.\d])|opacity\s*:\s*0(?![.\d])|color\s*:\s*(#fff(fff)?|white)\b/i;

const isTag = (cp) => cp >= 0xe0000 && cp <= 0xe007f;
const isVarSel = (cp) => (cp >= 0xfe00 && cp <= 0xfe0f) || (cp >= 0xe0100 && cp <= 0xe01ef);
const isBidi = (cp) => (cp >= 0x202a && cp <= 0x202e) || (cp >= 0x2066 && cp <= 0x2069);
const CF = /\p{Cf}/u;
const CC = /[\p{Cc}]/u;
const PICTO = /\p{Extended_Pictographic}/u;

const hex = (cp) => "U+" + cp.toString(16).toUpperCase().padStart(4, "0");

// Make invisible characters visible in a snippet.
export function reveal(s, max = 160) {
    let out = "";
    for (const ch of s) {
        const cp = ch.codePointAt(0);
        out += CF.test(ch) || isVarSel(cp) || (CC.test(ch) && ch !== "\t") ? `⟨${hex(cp)}⟩` : ch;
        if (out.length > max) return out.slice(0, max) + "…";
    }
    return out;
}

// Byte-smuggling via variation selectors: FE00-FE0F -> 0-15, E0100-E01EF -> 16-255.
function decodeVarSel(cps) {
    const bytes = cps.map((cp) => (cp <= 0xfe0f ? cp - 0xfe00 : cp - 0xe0100 + 16));
    try {
        return new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
    } catch {
        return "";
    }
}

function scanChars(line, n, out) {
    const chars = [...line];
    const counts = { invisible: new Set(), control: new Set(), bidi: new Set() };
    let tagRun = "";
    let vsRun = [];
    const flushTags = () => {
        if (tagRun) out.push({ kind: "tags", line: n, detail: tagRun });
        tagRun = "";
    };
    const flushVs = () => {
        if (vsRun.length >= 2)
            out.push({
                kind: "varsel",
                line: n,
                detail: decodeVarSel(vsRun) || `${vsRun.length}×`,
            });
        vsRun = [];
    };
    chars.forEach((ch, i) => {
        const cp = ch.codePointAt(0);
        if (isTag(cp)) {
            if (cp >= 0xe0020 && cp <= 0xe007e) tagRun += String.fromCharCode(cp - 0xe0000);
            return;
        }
        flushTags();
        if (isVarSel(cp)) return void vsRun.push(cp);
        flushVs();
        if (isBidi(cp)) counts.bidi.add(hex(cp));
        else if (CF.test(ch)) {
            if (cp === 0xfeff && n === 1 && i === 0) return; // BOM at file start is normal
            if (cp === 0x200d && PICTO.test(chars[i - 1] || "") && PICTO.test(chars[i + 1] || ""))
                return; // emoji ZWJ
            counts.invisible.add(hex(cp));
        } else if (CC.test(ch) && ch !== "\t") counts.control.add(hex(cp));
    });
    flushTags();
    flushVs();
    for (const [kind, set] of Object.entries(counts)) {
        if (set.size) out.push({ kind, line: n, detail: [...set].join(" ") });
    }
}

// Normalised copy for phrase matching: invisibles removed, look-alike forms folded.
const normalise = (s) =>
    [...s]
        .filter((ch) => !CF.test(ch) && !isVarSel(ch.codePointAt(0)))
        .join("")
        .normalize("NFKC");

function scanPhrases(text, n, out, kindOverride) {
    const norm = normalise(text);
    for (const [kind, re] of PHRASES) {
        const m = norm.match(re);
        if (m) out.push({ kind: kindOverride || kind, line: n, detail: m[0] });
    }
}

const lineAt = (text, index) => text.slice(0, index).split(/\r\n|\n|\r/).length;

function decodeBase64(s) {
    try {
        const bin = atob(s);
        const txt = new TextDecoder("utf-8", { fatal: true }).decode(
            Uint8Array.from(bin, (c) => c.charCodeAt(0)),
        );
        return /^[\p{L}\p{N}\p{P}\p{S}\s]*$/u.test(txt) ? txt : "";
    } catch {
        return "";
    }
}

export function scan(text) {
    const out = [];
    text.split(/\r\n|\n|\r/).forEach((line, i) => {
        const n = i + 1;
        scanChars(line, n, out);
        scanPhrases(line, n, out);
        const tagged = out.filter(
            (f) => f.line === n && (f.kind === "tags" || f.kind === "varsel"),
        );
        // Hidden payloads get the phrase checks too.
        for (const f of tagged) scanPhrases(f.detail, n, out);
        const css = line.match(HIDDEN_CSS);
        if (css) out.push({ kind: "hiddencss", line: n, detail: css[0] });
    });
    for (const m of text.matchAll(/<!--([\s\S]*?)-->/g)) {
        if (m[1].trim())
            out.push({ kind: "comment", line: lineAt(text, m.index), detail: m[1].trim() });
    }
    for (const m of text.matchAll(/[A-Za-z0-9+/]{40,}={0,2}/g)) {
        const decoded = decodeBase64(m[0]);
        if (!decoded) continue;
        const hits = [];
        scanPhrases(decoded, 0, hits);
        if (hits.length) out.push({ kind: "base64", line: lineAt(text, m.index), detail: decoded });
    }
    return out
        .map((f) => ({ ...f, severity: SEVERITY[f.kind] }))
        .sort((a, b) => b.severity - a.severity || a.line - b.line);
}

// ---- page ----------------------------------------------------------------
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_SHOWN = 200;

function render(root, msgs, name, findings, error) {
    const sec = document.createElement("section");
    sec.className = "ic-file";
    const h = document.createElement("h3");
    h.textContent = name;
    const verdict = document.createElement("p");
    verdict.className = "ic-verdict";
    const top = findings.length ? findings[0].severity : 0;
    verdict.textContent = error || msgs.verdict[top];
    verdict.dataset.level = error ? 0 : top;
    sec.append(h, verdict);
    if (findings.length) {
        const ul = document.createElement("ul");
        ul.className = "ic-list";
        for (const f of findings.slice(0, MAX_SHOWN)) {
            const li = document.createElement("li");
            const head = document.createElement("p");
            const sev = document.createElement("strong");
            sev.textContent = msgs.severity[f.severity];
            head.append(sev, ` · ${msgs.line} ${f.line} · ${msgs.kinds[f.kind]}`);
            const code = document.createElement("code");
            code.textContent = reveal(f.detail);
            li.append(head, code);
            ul.append(li);
        }
        sec.append(ul);
        if (findings.length > MAX_SHOWN) {
            const more = document.createElement("p");
            more.textContent = msgs.more.replace("{n}", findings.length - MAX_SHOWN);
            sec.append(more);
        }
    }
    root.append(sec);
}

if (typeof document !== "undefined") {
    const form = document.getElementById("icForm");
    const input = document.getElementById("icFiles");
    const pasted = document.getElementById("icText");
    const root = document.getElementById("icResults");
    const msgs = JSON.parse(root.dataset.msgs);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        root.replaceChildren();
        if (pasted.value) render(root, msgs, msgs.pasted, scan(pasted.value));
        for (const file of input.files) {
            if (file.size > MAX_BYTES) {
                render(root, msgs, file.name, [], msgs.tooBig);
                continue;
            }
            render(root, msgs, file.name, scan(await file.text()));
        }
        if (!root.children.length) {
            const p = document.createElement("p");
            p.className = "pay-disclaimer";
            p.textContent = msgs.nothing;
            root.append(p);
        }
    });
}
