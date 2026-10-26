/**
 * <site-nav data-page="cv" data-lang="cs"></site-nav>
 *
 * Shared control panel for every page: one arcade button per page + the
 * language coin slot. Renders into light DOM so style.css (.control-panel) applies.
 *
 * When adding a page, add it here and to sitemap.xml.
 */
(function () {
    "use strict";

    var PAGES = [
        {
            id: "home",
            cs: { href: "index.html", label: "Domů" },
            en: { href: "index-en.html", label: "Home" },
        },
        { id: "cv", cs: { href: "cv.html", label: "CV" }, en: { href: "cv-en.html", label: "CV" } },
        {
            id: "semester",
            cs: { href: "semester.html", label: "Semestr" },
            en: { href: "semester-en.html", label: "Semester" },
        },
        {
            id: "job-pay",
            cs: { href: "job-pay.html", label: "Výplata" },
            en: { href: "job-pay-en.html", label: "Job Pay" },
        },
        {
            id: "uses",
            cs: { href: "uses.html", label: "Vybavení" },
            en: { href: "uses-en.html", label: "Uses" },
        },
        {
            id: "privacy",
            cs: { href: "privacy.html", label: "Soukromí" },
            en: { href: "privacy-en.html", label: "Privacy" },
        },
    ];

    var STRINGS = {
        cs: { nav: "Stránky", toEn: "EN", toEnLabel: "Switch to English" },
        en: { nav: "Pages", toCs: "CZ", toCsLabel: "Přepnout do češtiny" },
    };

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
        });
    }

    // Remembering the language is deliberately passive: we store what the
    // visitor picked and offer it back on the landing page, but never redirect.
    // An automatic redirect breaks shared links and hides one language from
    // crawlers, which is worse than one extra click.
    var LANG_KEY = "preferred-lang";

    function readPreferredLang() {
        try {
            return window.localStorage.getItem(LANG_KEY);
        } catch (err) {
            return null; // private mode / storage blocked
        }
    }

    function writePreferredLang(value) {
        try {
            window.localStorage.setItem(LANG_KEY, value);
        } catch (err) {
            /* not important enough to bother the visitor about */
        }
    }

    // A page can opt in to a "continue in <other language>" nudge by including
    // an element with [data-lang-hint]; it stays hidden unless the visitor has
    // actually chosen the other language before.
    function offerPreferredLang(currentLang) {
        var hint = document.querySelector("[data-lang-hint]");
        if (!hint) return;
        var preferred = readPreferredLang();
        if (preferred && preferred !== currentLang) hint.hidden = false;
    }

    // The control panel: every page is one arcade button, the current one lit.
    class SiteNav extends HTMLElement {
        connectedCallback() {
            var lang = this.getAttribute("data-lang") === "en" ? "en" : "cs";
            var current = this.getAttribute("data-page") || "";
            var other = lang === "en" ? "cs" : "en";
            var s = STRINGS[lang];

            var currentPage = PAGES.filter(function (p) {
                return p.id === current;
            })[0];
            var hasCounterpart = currentPage && currentPage[lang].href !== currentPage[other].href;

            var buttons = PAGES.map(function (p) {
                return (
                    '<li><a href="' +
                    esc(p[lang].href) +
                    '" class="cp-btn"' +
                    (p.id === current ? ' aria-current="page"' : "") +
                    '><span class="cp-cap" aria-hidden="true"></span>' +
                    esc(p[lang].label) +
                    "</a></li>"
                );
            }).join("");

            var coinHtml = "";
            if (hasCounterpart) {
                coinHtml =
                    '<a href="' +
                    esc(currentPage[other].href) +
                    '" class="coin-slot" aria-label="' +
                    esc(lang === "en" ? s.toCsLabel : s.toEnLabel) +
                    '">' +
                    esc(lang === "en" ? s.toCs : s.toEn) +
                    "</a>";
            }

            this.innerHTML =
                '<nav class="control-panel" aria-label="' +
                esc(s.nav) +
                '"><ul class="cp-buttons">' +
                buttons +
                "</ul>" +
                coinHtml +
                "</nav>";

            var coin = this.querySelector(".coin-slot");
            if (coin) {
                coin.addEventListener("click", function () {
                    writePreferredLang(other);
                });
            }
            offerPreferredLang(lang);
        }
    }

    customElements.define("site-nav", SiteNav);
})();
