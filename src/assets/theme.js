/**
 * Light / dark switch for zvondis.dev and tools.zvondis.dev. Loaded as a blocking script in <head>
 * before the stylesheet, so a stored choice is on <html data-theme> before the first paint. With
 * nothing stored there is no data-theme and the CSS follows the OS setting.
 *
 * The button ([data-theme-toggle], hidden without JavaScript) names the theme it switches to,
 * like the CZ / EN switch names the other language.
 *
 * Storage is per subdomain, so links to the other zvondis.dev sites carry the choice as ?theme=
 * (like ?lang=), and a page opened with ?theme= stores it.
 *
 * The tools site carries a copy of this file: edit it in the zvondis.dev repo and run
 * `npm run search` there.
 */
(function () {
    "use strict";

    var KEY = "theme";
    var root = document.documentElement;

    var asked = new URLSearchParams(location.search).get(KEY);
    try {
        if (asked === "light" || asked === "dark") localStorage.setItem(KEY, asked);
    } catch (err) {
        /* storage blocked: the choice holds for this page only */
    }
    try {
        var saved = localStorage.getItem(KEY);
        if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
    } catch (err) {
        /* storage blocked: follow the OS */
    }
    if (asked === "light" || asked === "dark") root.setAttribute("data-theme", asked);

    // Hand a stored choice on to the sister site the visitor is leaving for.
    function carry(e) {
        var a = e.target.closest && e.target.closest("a[href]");
        var theme = root.getAttribute("data-theme");
        if (!a || !theme || a.hostname === location.hostname) return;
        if (a.hostname !== "zvondis.dev" && !a.hostname.endsWith(".zvondis.dev")) return;
        var url = new URL(a.href);
        url.searchParams.set(KEY, theme);
        a.href = url.href;
    }
    document.addEventListener("click", carry, true);
    document.addEventListener("auxclick", carry, true);

    var COPY = {
        cs: {
            dark: ["Tmavý", "Tmavý, přepnout na tmavý vzhled"],
            light: ["Světlý", "Světlý, přepnout na světlý vzhled"],
        },
        en: {
            dark: ["Dark", "Dark, switch to the dark theme"],
            light: ["Light", "Light, switch to the light theme"],
        },
    };
    var system = window.matchMedia("(prefers-color-scheme: dark)");

    function current() {
        return root.getAttribute("data-theme") || (system.matches ? "dark" : "light");
    }

    document.addEventListener("DOMContentLoaded", function () {
        var button = document.querySelector("[data-theme-toggle]");
        if (!button) return;

        function relabel() {
            var next = current() === "dark" ? "light" : "dark";
            var t = COPY[root.lang === "en" ? "en" : "cs"][next];
            button.textContent = t[0];
            button.setAttribute("aria-label", t[1]);
        }

        button.addEventListener("click", function () {
            var next = current() === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try {
                localStorage.setItem(KEY, next);
            } catch (err) {
                /* works for this page only */
            }
            relabel();
        });
        system.addEventListener("change", relabel);
        // The tools site switches language without a reload.
        new MutationObserver(relabel).observe(root, {
            attributes: true,
            attributeFilter: ["lang"],
        });
        relabel();
        button.hidden = false;
    });
})();
