// Renders the 1200x630 share cards (og:image) for every page and language with
// headless Brave/Chromium into src/assets/og/<key>-<lang>.png. The cards use the
// site stylesheet, so fonts and tokens match the pages. Light scheme only.
// Run: npm run og   (BROWSER=/path/to/chromium to use another browser)
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import site from "../src/_data/site.js";
import art from "../src/_data/art.js";
import home from "../src/_data/copy/home.js";
import cv from "../src/_data/copy/cv.js";
import semester from "../src/_data/copy/semester.js";
import uses from "../src/_data/copy/uses.js";

const browser = process.env.BROWSER || "/usr/bin/brave";
const outDir = "src/assets/og";
const css = pathToFileURL(resolve("src/assets/style.css")).href;
const logo = readFileSync("src/assets/logo.svg", "utf8").replace(/<style>[\s\S]*<\/style>/, "");

// Headline (may hold the accent <em>) and the mute line under it, per page and language.
const cards = {
    home: (l) => [home[l].offer, ""],
    cv: (l) => [site.author, cv[l].subtitle],
    semester: (l) => [semester[l].h1, semester[l].subtitle],
    uses: (l) => [uses[l].h1, uses[l].subtitle],
    privacy: (l) =>
        l === "en"
            ? ["Privacy Policy", "What this site stores and what it does not."]
            : ["Zásady ochrany soukromí", "Co tento web ukládá a co ne."],
    contact: (l) =>
        l === "en"
            ? ["Contact", "Write to me, I'll reply by email"]
            : ["Kontakt", "Napište mi, odpovím e-mailem"],
};

// Same 0/1 drawing as the bitArt filter in eleventy.config.js, without the animation.
const shades = { "+": 0, ".": 1, "#": 2, "*": 3 };
const bits = (mask) => {
    let i = 0;
    return [...mask]
        .map((ch) =>
            ch in shades
                ? `<span class="s${shades[ch]}">${Math.imul(++i, 2654435761) >>> 31}</span>`
                : ch,
        )
        .join("");
};

const page = (lang, [headline, sub], mask, url) => `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<link rel="stylesheet" href="${css}">
<style>
:root { color-scheme: light; }
html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
.card { box-sizing: border-box; display: grid; grid-template: auto 1fr auto / 1fr auto; column-gap: 48px;
  width: 1200px; height: 630px; padding: 64px 72px 56px; background: var(--paper); color: var(--ink); font-family: var(--font); }
.top { grid-column: 1 / -1; display: flex; align-items: center; gap: 16px; font-size: 28px; font-weight: 700; letter-spacing: -0.01em; }
.top svg { width: 56px; height: 56px; }
.text { align-self: end; }
h1 { margin: 0; font-size: ${headline.length > 14 ? 80 : 104}px; font-weight: 800; line-height: 0.98; letter-spacing: -0.04em; }
.offer-ask, h1 em { display: block; }
h1 em { color: var(--accent); font-style: normal; font-weight: 300; letter-spacing: -0.035em; }
.sub { margin: 24px 0 0; color: var(--mute); font-size: 32px; line-height: 1.3; }
.card .art { align-self: end; margin: 0; font-size: 17px; }
.foot { grid-column: 1 / -1; margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--ink);
  display: flex; justify-content: space-between; font-size: 24px; font-weight: 700; }
.foot span { color: var(--mute); font-weight: 400; }
</style></head>
<body><div class="card">
<div class="top">${logo}Zvondis</div>
<div class="text"><h1>${headline}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>
${mask ? `<pre class="art">${bits(mask.replace(/^\n/, ""))}</pre>` : "<div></div>"}
<div class="foot">${site.author}<span>${url}</span></div>
</div></body></html>`;

mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "og-"));
try {
    for (const p of site.pages) {
        for (const lang of ["cs", "en"]) {
            const html = join(tmp, `${p.key}-${lang}.html`);
            const out = join(outDir, `${p.key}-${lang}.png`);
            writeFileSync(
                html,
                page(
                    lang,
                    cards[p.key](lang),
                    art[p.key],
                    site.url.replace("https://", "") + p[lang].url.replace(/^\/$/, ""),
                ),
            );
            rmSync(out, { force: true });
            execFileSync(
                browser,
                [
                    "--headless=new",
                    "--disable-gpu",
                    "--hide-scrollbars",
                    "--force-device-scale-factor=1",
                    "--allow-file-access-from-files",
                    "--blink-settings=preferredColorScheme=1",
                    "--virtual-time-budget=3000",
                    "--window-size=1200,630",
                    `--screenshot=${resolve(out)}`,
                    pathToFileURL(html).href,
                ],
                { stdio: "ignore" },
            );
            const png = readFileSync(out);
            // PNG signature, then the IHDR width and height
            if (
                png.readUInt32BE(0) !== 0x89504e47 ||
                png.readUInt32BE(16) !== 1200 ||
                png.readUInt32BE(20) !== 630
            )
                throw new Error(`${out} is not a 1200x630 PNG`);
            console.log(`${out} (${Math.round(statSync(out).size / 1024)} kB)`);
        }
    }
} finally {
    rmSync(tmp, { recursive: true, force: true });
}
