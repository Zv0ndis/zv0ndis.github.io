export default {
    url: "https://zvondis.dev",

    author: "Tomáš Zvoníček",
    titleSuffix: "Tomáš Zvoníček",

    // Every page, in menu order. `key` matches the `page_key` front-matter value
    // and the <site-nav data-page> attribute. Per language: `url` is the clean public
    // path (GitHub Pages serves cv.html at /cv), `file` the output file, `label` the
    // menu text. When cs and en share a url the page has no language counterpart.
    pages: [
        {
            key: "home",
            cs: { url: "/", file: "index.html", label: "Domů" },
            en: { url: "/en/", file: "en/index.html", label: "Home" },
        },
        {
            key: "cv",
            cs: { url: "/cv", file: "cv.html", label: "CV" },
            en: { url: "/en/cv", file: "en/cv.html", label: "CV" },
        },
        {
            key: "semester",
            cs: { url: "/semestr", file: "semestr.html", label: "Semestr" },
            en: { url: "/en/semester", file: "en/semester.html", label: "Semester" },
        },
        {
            key: "uses",
            cs: { url: "/vybaveni", file: "vybaveni.html", label: "Vybavení" },
            en: { url: "/en/uses", file: "en/uses.html", label: "Uses" },
        },
        {
            key: "privacy",
            cs: { url: "/soukromi", file: "soukromi.html", label: "Soukromí" },
            en: { url: "/en/privacy", file: "en/privacy.html", label: "Privacy" },
        },
    ],

    // Sister sites on other subdomains, listed in the nav after the pages above.
    links: [
        {
            cs: { url: "https://tools.zvondis.dev/?lang=cs", label: "Nástroje" },
            en: { url: "https://tools.zvondis.dev/?lang=en", label: "Tools" },
        },
        {
            cs: { url: "https://tools.zvondis.dev/battleships/", label: "Lodě" },
            en: { url: "https://tools.zvondis.dev/battleships/", label: "Battleships" },
        },
    ],

    // Old .html addresses (before clean URLs), kept as redirects so shared links still work.
    legacy: [
        { from: "index-en.html", to: "/en/" },
        { from: "cv-en.html", to: "/en/cv" },
        { from: "semester.html", to: "/semestr" },
        { from: "semester-en.html", to: "/en/semester" },
        { from: "job-pay.html", to: "https://tools.zvondis.dev/job-pay/?lang=cs" },
        { from: "job-pay-en.html", to: "https://tools.zvondis.dev/job-pay/?lang=en" },
        { from: "uses.html", to: "/vybaveni" },
        { from: "uses-en.html", to: "/en/uses" },
        { from: "privacy.html", to: "/soukromi" },
        { from: "privacy-en.html", to: "/en/privacy" },
        { from: "vyplata.html", to: "https://tools.zvondis.dev/job-pay/?lang=cs" },
        { from: "en/job-pay.html", to: "https://tools.zvondis.dev/job-pay/?lang=en" },
        { from: "injekce.html", to: "https://tools.zvondis.dev/injection-check/" },
        { from: "en/injection-check.html", to: "https://tools.zvondis.dev/injection-check/" },
    ],
};
