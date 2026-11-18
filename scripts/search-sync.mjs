// Builds the site and copies the search index, the search script and the theme switch to the tools
// repo, so tools.zvondis.dev serves them same-origin (its CSP allows connect-src 'self' only).
// The tool list lives once, in src/_data/site.js; this fails if a tools folder is missing there.
// Run: npm run search   (TOOLS_DIR=/path/to/tools if the repo is not next to this one)
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import prettier from "prettier";
import site from "../src/_data/site.js";

const tools = process.env.TOOLS_DIR || "../tools";
if (!existsSync(join(tools, "index.html"))) throw new Error(`no tools repo at ${tools}`);

const folders = readdirSync(tools, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(tools, d.name, "index.html")))
    .map((d) => d.name);
const missing = folders.filter((f) => !site.tools.some((t) => t.path === f));
if (missing.length)
    throw new Error(`add to site.tools in src/_data/site.js: ${missing.join(", ")}`);

execFileSync("npx", ["eleventy", "--quiet"], { stdio: "inherit" });

const json = await prettier.format(readFileSync("_site/search.json", "utf8"), { parser: "json" });
writeFileSync(join(tools, "search.json"), json);
for (const f of ["search.js", "theme.js"])
    copyFileSync(`src/assets/${f}`, join(tools, "assets", f));
console.log(
    `search: ${JSON.parse(json).length} entries -> ${tools}/search.json, assets/search.js, theme.js`,
);
