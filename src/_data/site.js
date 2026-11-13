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
            key: "job-pay",
            cs: { url: "/vyplata", file: "vyplata.html", label: "Výplata" },
            en: { url: "/en/job-pay", file: "en/job-pay.html", label: "Job Pay" },
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

    // Old .html addresses (before clean URLs), kept as redirects so shared links still work.
    legacy: [
        { from: "index-en.html", to: "/en/" },
        { from: "cv-en.html", to: "/en/cv" },
        { from: "semester.html", to: "/semestr" },
        { from: "semester-en.html", to: "/en/semester" },
        { from: "job-pay.html", to: "/vyplata" },
        { from: "job-pay-en.html", to: "/en/job-pay" },
        { from: "uses.html", to: "/vybaveni" },
        { from: "uses-en.html", to: "/en/uses" },
        { from: "privacy.html", to: "/soukromi" },
        { from: "privacy-en.html", to: "/en/privacy" },
    ],
};
