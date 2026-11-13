import prettier from "prettier";

export default function (eleventyConfig) {
    // src/assets/*  -> _site/assets/*   (CSS, JS, images)
    // src/static/*  -> _site/*          (files that must sit at the site root)
    eleventyConfig.ignores.add("src/static/**");
    eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
    eleventyConfig.addPassthroughCopy({ "src/static": "." });
    eleventyConfig.addPassthroughCopy("src/.well-known");

    // Copy passthrough assets into _site during `--serve` (Eleventy otherwise
    // serves them straight from src/, so _site/assets/ would go stale)...
    eleventyConfig.setServerPassthroughCopyBehavior("copy");
    // ...rebuild when a source asset changes...
    eleventyConfig.addWatchTarget("src/assets/");
    // ...and have the dev server reload the browser on the rebuilt asset
    // (CSS is hot-swapped, JS triggers a full reload).
    eleventyConfig.setServerOptions({
        watch: ["_site/assets/**"],
    });

    // Look up a page definition from site.pages by its key.
    eleventyConfig.addFilter("findPage", (pages, key) => (pages || []).find((p) => p.key === key));

    // "C, C#, Python" -> ["C", "C#", "Python"], so comma-separated copy can be
    // rendered as individual tags without splitting it up in the data files.
    // Art mask -> spans of 0/1 grouped by shade, the same markup assets/bits.js animates.
    // Legend matches src/_data/art.js: "+" darkest .. "*" brightest, anything else empty.
    eleventyConfig.addFilter("bitArt", (mask) => {
        const shades = { "+": 0, ".": 1, "#": 2, "*": 3 };
        let i = 0;
        return String(mask || "")
            .split("\n")
            .map((line) => {
                let out = "",
                    cur = -1;
                for (const ch of line) {
                    const sh = ch in shades ? shades[ch] : -1;
                    if (sh !== cur) {
                        if (cur >= 0) out += "</span>";
                        if (sh >= 0) out += `<span class="s${sh}">`;
                        cur = sh;
                    }
                    out += sh < 0 ? " " : (Math.imul(++i, 2654435761) >>> 31).toString();
                }
                return cur >= 0 ? out + "</span>" : out;
            })
            .join("\n");
    });

    eleventyConfig.addFilter("commaList", (value) =>
        String(value || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    );

    // Format generated HTML so the output is clean and diff-friendly.
    eleventyConfig.addTransform("prettier", async (content, path) => {
        if (!path || !path.endsWith(".html")) return content;
        const options = (await prettier.resolveConfig(path)) || {};
        return prettier.format(content, { ...options, parser: "html" });
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data",
        },
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
    };
}
