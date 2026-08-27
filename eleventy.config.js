import prettier from "prettier";

export default function (eleventyConfig) {
    // Static assets copied verbatim to the site root (not processed as templates).
    eleventyConfig.ignores.add("src/root/**");
    eleventyConfig.addPassthroughCopy({ "src/assets": "." });
    eleventyConfig.addPassthroughCopy({ "src/root": "." });
    eleventyConfig.addPassthroughCopy("src/.well-known");

    // Rebuild when CSS/JS changes.
    eleventyConfig.addWatchTarget("src/assets/");

    // Look up a page definition from site.pages by its key.
    eleventyConfig.addFilter("findPage", (pages, key) => (pages || []).find((p) => p.key === key));

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
