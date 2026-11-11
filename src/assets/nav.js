/**
 * The nav itself is rendered by base.njk from site.pages. This script only
 * handles the passive language hint.
 *
 * When adding a page, add it to src/_data/site.js and sitemap.njk.
 */
(function () {
    "use strict";

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

    var langSwitch = document.querySelector("[data-set-lang]");
    if (langSwitch) {
        langSwitch.addEventListener("click", function () {
            writePreferredLang(langSwitch.getAttribute("data-set-lang"));
        });
    }
    offerPreferredLang(document.documentElement.lang);
})();
