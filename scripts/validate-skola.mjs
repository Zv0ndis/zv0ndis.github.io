// Gate between the data repo and the public site: the build copies skola.json into _site only
// if it has exactly the shape assets/school.js expects. Anything else fails the build.
//
//   node scripts/validate-skola.mjs IN.json OUT.json
//   node scripts/validate-skola.mjs --selftest
import { readFileSync, writeFileSync } from "node:fs";

const MAX_EVENTS = 200;
const MAX_BYTES = 200_000;
const MAX_LEN = 160;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})$/;
const COURSE = /^[A-Z0-9]{2,5}$/;
const KEYS = ["kind", "course", "title", "start", "end", "allDay", "room"];

const text = (v) => typeof v === "string" && v.length > 0 && v.length <= MAX_LEN;

function check(ok, message) {
    if (!ok) throw new Error(message);
}

export function validate(raw) {
    check(raw.length <= MAX_BYTES, "file too large");
    const data = JSON.parse(raw);
    check(data && typeof data === "object" && !Array.isArray(data), "top level must be an object");
    check(Object.keys(data).join() === "events", "top level must have only 'events'");
    check(Array.isArray(data.events), "'events' must be an array");
    check(data.events.length <= MAX_EVENTS, "too many events");
    const events = data.events.map((e, i) => {
        const at = `events[${i}]`;
        check(e && typeof e === "object" && !Array.isArray(e), `${at}: not an object`);
        const extra = Object.keys(e).filter((k) => !KEYS.includes(k));
        check(extra.length === 0, `${at}: unexpected key ${extra[0]}`);
        check(e.kind === "exam" || e.kind === "deadline", `${at}: bad kind`);
        check(typeof e.course === "string" && COURSE.test(e.course), `${at}: bad course`);
        check(text(e.title), `${at}: bad title`);
        check(typeof e.allDay === "boolean", `${at}: bad allDay`);
        for (const k of ["start", "end"]) {
            const ok =
                typeof e[k] === "string" &&
                (e.allDay ? DATE : DATETIME).test(e[k]) &&
                !Number.isNaN(Date.parse(e[k]));
            check(ok, `${at}: bad ${k}`);
        }
        check(e.room === undefined || text(e.room), `${at}: bad room`);
        // Rebuilt key by key, so only the allowed fields can reach the site.
        return Object.fromEntries(KEYS.filter((k) => e[k] !== undefined).map((k) => [k, e[k]]));
    });
    return JSON.stringify({ events }) + "\n";
}

function selftest() {
    const ok = {
        kind: "exam",
        course: "ITU",
        title: "písemný test",
        start: "2026-12-08T13:00:00Z",
        end: "2026-12-08T14:00:00+01:00",
        allDay: false,
        room: "B/D105",
    };
    const day = { ...ok, start: "2026-12-08", end: "2026-12-09", allDay: true };
    const out = JSON.parse(validate(JSON.stringify({ events: [ok, day] })));
    if (JSON.stringify(out.events) !== JSON.stringify([ok, day])) throw new Error("round trip");
    const bad = [
        "[]",
        "{}",
        '{"events":[],"x":1}',
        '{"events":{}}',
        JSON.stringify({ events: Array(MAX_EVENTS + 1).fill(ok) }),
        ...[
            { kind: "note" },
            { course: "<b>" },
            { title: "x".repeat(MAX_LEN + 1) },
            { title: 5 },
            { start: "tomorrow" },
            { start: "2026-12-08" }, // date only, but not allDay
            { end: "2026-13-45T00:00:00Z" },
            { allDay: "false" },
            { room: ["B"] },
            { html: "<img>" },
        ].map((patch) => JSON.stringify({ events: [{ ...ok, ...patch }] })),
    ];
    for (const raw of bad) {
        let threw = false;
        try {
            validate(raw);
        } catch {
            threw = true;
        }
        if (!threw) throw new Error(`accepted: ${raw.slice(0, 120)}`);
    }
    console.log("selftest ok");
}

const [input, output] = process.argv.slice(2);
if (input === "--selftest") selftest();
else if (input && output) {
    const out = validate(readFileSync(input, "utf8"));
    writeFileSync(output, out);
    console.log(`skola.json ok: ${JSON.parse(out).events.length} events`);
} else {
    console.error("usage: validate-skola.mjs IN.json OUT.json | --selftest");
    process.exit(2);
}
