/**
 * <site-nav data-page="cv" data-lang="cs"></site-nav>
 *
 * Shared top navigation for every page: language toggle + pages menu.
 * Renders into light DOM so the existing rules in style.css (.pages-nav etc.) apply.
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
            en: { href: "privacy.html", label: "Privacy" },
        },
    ];

    var STRINGS = {
        cs: { menu: "Další stránky", toEn: "EN", toEnLabel: "Switch to English" },
        en: { menu: "More pages", toCs: "CZ", toCsLabel: "Přepnout do češtiny" },
    };

    var ICON =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>' +
        '<rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
        });
    }

    var uid = 0;

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

    class SiteNav extends HTMLElement {
        connectedCallback() {
            var lang = this.getAttribute("data-lang") === "en" ? "en" : "cs";
            var current = this.getAttribute("data-page") || "";
            var other = lang === "en" ? "cs" : "en";
            var menuId = "pagesMenu-" + ++uid;
            var s = STRINGS[lang];

            var currentPage = PAGES.filter(function (p) {
                return p.id === current;
            })[0];
            var hasCounterpart = currentPage && currentPage[lang].href !== currentPage[other].href;

            var toggleHtml = "";
            if (hasCounterpart) {
                var label = lang === "en" ? s.toCs : s.toEn;
                var aria = lang === "en" ? s.toCsLabel : s.toEnLabel;
                toggleHtml =
                    '<a href="' +
                    esc(currentPage[other].href) +
                    '" class="lang-toggle" aria-label="' +
                    esc(aria) +
                    '">' +
                    esc(label) +
                    "</a>";
            }

            var items = PAGES.map(function (p) {
                var active = p.id === current;
                return (
                    '<a href="' +
                    esc(p[lang].href) +
                    '" class="pages-menu-item' +
                    (active ? " active" : "") +
                    '" role="menuitem"' +
                    (active ? ' aria-current="page"' : "") +
                    ' tabindex="-1">' +
                    esc(p[lang].label) +
                    "</a>"
                );
            }).join("");

            this.innerHTML =
                '<nav class="pages-nav">' +
                toggleHtml +
                '<button class="pages-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="' +
                menuId +
                '" aria-label="' +
                esc(s.menu) +
                '">' +
                ICON +
                "</button>" +
                '<div id="' +
                menuId +
                '" class="pages-menu" role="menu" hidden>' +
                items +
                "</div>" +
                "</nav>";

            var langLink = this.querySelector(".lang-toggle");
            if (langLink) {
                langLink.addEventListener("click", function () {
                    writePreferredLang(other);
                });
            }
            offerPreferredLang(lang);

            this._toggle = this.querySelector(".pages-toggle");
            this._menu = this.querySelector(".pages-menu");
            this._menuItems = Array.prototype.slice.call(this.querySelectorAll(".pages-menu-item"));

            this._onDocClick = this._onDocClick.bind(this);
            this._onKeydown = this._onKeydown.bind(this);

            this._toggle.addEventListener("click", (e) => {
                e.stopPropagation();
                this._menu.hidden ? this.open() : this.close();
            });
            document.addEventListener("click", this._onDocClick);
            document.addEventListener("keydown", this._onKeydown);
        }

        disconnectedCallback() {
            document.removeEventListener("click", this._onDocClick);
            document.removeEventListener("keydown", this._onKeydown);
        }

        open() {
            this._menu.hidden = false;
            this._toggle.setAttribute("aria-expanded", "true");
            if (this._menuItems[0]) this._menuItems[0].focus();
        }

        close(refocus) {
            this._menu.hidden = true;
            this._toggle.setAttribute("aria-expanded", "false");
            if (refocus) this._toggle.focus();
        }

        _onDocClick(e) {
            if (!this._menu.hidden && !this.contains(e.target)) this.close();
        }

        _onKeydown(e) {
            if (this._menu.hidden) return;
            if (e.key === "Escape") {
                this.close(true);
                return;
            }
            var idx = this._menuItems.indexOf(document.activeElement);
            if (e.key === "ArrowDown") {
                e.preventDefault();
                this._menuItems[(idx + 1) % this._menuItems.length].focus();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                this._menuItems[
                    (idx - 1 + this._menuItems.length) % this._menuItems.length
                ].focus();
            } else if (e.key === "Home") {
                e.preventDefault();
                this._menuItems[0].focus();
            } else if (e.key === "End") {
                e.preventDefault();
                this._menuItems[this._menuItems.length - 1].focus();
            } else if (e.key === "Tab") {
                this.close();
            }
        }
    }

    customElements.define("site-nav", SiteNav);
})();
