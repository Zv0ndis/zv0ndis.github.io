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

    // Every tool on tools.zvondis.dev, for the shared search (src/search.11ty.js).
    // `npm run search` copies the index to the tools repo and fails if a tool folder is missing here.
    tools: [
        {
            path: "job-pay",
            cs: {
                title: "Výplata",
                text: "Čistá výplata z brigády na DPP / DPČ.",
                keywords: "mzda plat",
            },
            en: {
                title: "Job Pay",
                text: "Net pay from a DPP / DPČ student job.",
                keywords: "salary wage",
            },
        },
        {
            path: "injection-check",
            cs: {
                title: "Kontrola injekce",
                text: "Najde v textových souborech skryté pokyny pro AI.",
            },
            en: { title: "Injection check", text: "Finds hidden AI instructions in text files." },
        },
        {
            path: "qr",
            cs: {
                title: "QR kód",
                text: "Udělá z textu nebo odkazu QR kód ke stažení jako PNG nebo SVG.",
            },
            en: {
                title: "QR Code",
                text: "Turns text or a link into a QR code to download as PNG or SVG.",
            },
        },
        {
            path: "decode",
            cs: { title: "Dekodér", text: "Formátuje JSON, převádí Base64 a čte JWT tokeny." },
            en: { title: "Decoder", text: "Formats JSON, converts Base64 and reads JWT tokens." },
        },
        {
            path: "subnet",
            cs: {
                title: "Kalkulačka podsítí",
                text: "Rozsah, maska a rozdělení sítě pro IPv4 i IPv6.",
                keywords: "ip cidr",
            },
            en: {
                title: "Subnet Calculator",
                text: "Range, mask and network splits for IPv4 and IPv6.",
                keywords: "ip cidr",
            },
        },
        {
            path: "invoice",
            cs: {
                title: "Faktura",
                text: "Vytvoří fakturu v prohlížeči a uloží ji jako PDF.",
                keywords: "faktura pdf šablona",
            },
            en: {
                title: "Invoice",
                text: "Makes an invoice in your browser and saves it as a PDF.",
                keywords: "invoice bill pdf template",
            },
        },
        {
            path: "battleships",
            noLang: true,
            cs: { title: "Lodě", text: "Hra o lodích a tipování (anglicky).", keywords: "hra" },
            en: { title: "Battleships", text: "A game of ships and guesses.", keywords: "game" },
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
