// Builds the site and prints both CV pages to PDF with headless Brave/Chromium,
// into src/static (served at /cv.pdf and /en/cv.pdf), then rebuilds so _site has them.
// Run: npm run pdf   (BROWSER=/path/to/chromium to use another browser)
import { execFile, execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve } from "node:path";

const browser = process.env.BROWSER || "/usr/bin/brave";
const pages = [
    { url: "/cv", out: "src/static/cv.pdf" },
    { url: "/en/cv", out: "src/static/en/cv.pdf" },
];
const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
};

const build = () => execFileSync("npx", ["eleventy", "--quiet"], { stdio: "inherit" });
build();

// Minimal static server for _site with GitHub Pages' clean URLs (/cv -> cv.html).
const server = createServer((req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (path.endsWith("/")) path += "index.html";
    if (!extname(path)) path += ".html";
    try {
        const body = readFileSync(join("_site", path));
        res.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream" });
        res.end(body);
    } catch {
        res.writeHead(404).end();
    }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const origin = `http://127.0.0.1:${server.address().port}`;

try {
    for (const { url, out } of pages) {
        mkdirSync(dirname(out), { recursive: true });
        rmSync(out, { force: true });
        await new Promise((ok, fail) => {
            // async, so the server above keeps answering while the browser prints
            execFile(
                browser,
                [
                    "--headless=new",
                    "--disable-gpu",
                    "--no-pdf-header-footer",
                    "--virtual-time-budget=5000",
                    `--print-to-pdf=${resolve(out)}`,
                    origin + url,
                ],
                (err) => (err ? fail(err) : ok()),
            );
        });
        const head = readFileSync(out).subarray(0, 4).toString();
        if (head !== "%PDF" || statSync(out).size < 10_000) throw new Error(`${out} is not a PDF`);
        console.log(`${out} (${Math.round(statSync(out).size / 1024)} kB)`);
    }
} finally {
    server.close();
}

build();
