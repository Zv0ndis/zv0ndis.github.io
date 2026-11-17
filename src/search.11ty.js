// /search.json: every page and every tool in both languages, for assets/search.js.
// URLs are absolute so `npm run search` can copy the same file to tools.zvondis.dev.
const TOOLS = "https://tools.zvondis.dev/";

export const data = { permalink: "/search.json", eleventyExcludeFromCollections: true };

export function render({ site, collections }) {
    const pages = site.pages.map((p) => {
        const item = {};
        for (const lang of ["cs", "en"]) {
            const src = collections.all.find(
                (t) => t.data.page_key === p.key && t.data.lang === lang,
            );
            item[lang] = {
                title: p[lang].label,
                url: site.url + p[lang].url,
                text: src?.data.description || "",
            };
        }
        return item;
    });
    const tools = site.tools.map((t) => {
        const item = {};
        for (const lang of ["cs", "en"]) {
            const url = `${TOOLS}${t.path}/${t.noLang ? "" : `?lang=${lang}`}`;
            item[lang] = { ...t[lang], url };
        }
        return item;
    });
    return JSON.stringify([...pages, ...tools]);
}
