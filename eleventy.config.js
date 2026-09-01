import prettier from "prettier";

export default function (eleventyConfig) {
    // src/assets/*  -> _site/assets/*   (CSS, JS, images)
    // src/static/*  -> _site/*          (files that must sit at the site root)
    eleventyConfig.ignores.add("src/static/**");
    eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
    eleventyConfig.addPassthroughCopy({ "src/static": "." });
    eleventyConfig.addPassthroughCopy("src/.well-known");

    // Rebuild when CSS/JS changes.
    eleventyConfig.addWatchTarget("src/assets/");

    // Look up a page definition from site.pages by its key.
    eleventyConfig.addFilter("findPage", (pages, key) => (pages || []).find((p) => p.key === key));

    // "C, C#, Python" -> ["C", "C#", "Python"], so comma-separated copy can be
    // rendered as individual tags without splitting it up in the data files.
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
