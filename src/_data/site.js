export default {
    url: "https://zv0ndis.github.io",

    // Google OAuth client ID for the Semester page's calendar sync. Public by
    // design (it identifies the app, it does not authorise anything on its own),
    // so it belongs in the repo. Empty = sync stays switched off and the admin
    // UI says so. Create it in Google Cloud Console — see docs/PROBLEM.md.
    googleClientId: "",
    author: "Tomáš Zvoníček",
    titleSuffix: "Tomáš Zvoníček",

    // Every page, in menu order. `key` matches the `page_key` front-matter value
    // and the <site-nav data-page> attribute. `cs`/`en` give the output path and
    // menu label per language; when both paths are equal the page has no
    // language counterpart (no language toggle is shown).
    pages: [
        {
            key: "home",
            cs: { url: "index.html", label: "Domů" },
            en: { url: "index-en.html", label: "Home" },
        },
        {
            key: "cv",
            cs: { url: "cv.html", label: "CV" },
            en: { url: "cv-en.html", label: "CV" },
        },
        {
            key: "semester",
            cs: { url: "semester.html", label: "Semestr" },
            en: { url: "semester-en.html", label: "Semester" },
        },
        {
            key: "job-pay",
            cs: { url: "job-pay.html", label: "Výplata" },
            en: { url: "job-pay-en.html", label: "Job Pay" },
        },
        {
            key: "privacy",
            cs: { url: "privacy.html", label: "Soukromí" },
            en: { url: "privacy.html", label: "Privacy" },
        },
    ],
};
