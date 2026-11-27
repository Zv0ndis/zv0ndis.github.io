/**
 * Shared quick switcher for zvondis.dev and tools.zvondis.dev. Adds a "Search" button to the rail
 * nav; it, Ctrl+K / Cmd+K (which also closes) and "/" open a modal <dialog> near the top of the
 * page: a combobox field over a listbox of pages and tools, grouped by site. The index is the
 * same-origin /search.json (built by src/search.11ty.js), fetched on first open. Every query word
 * must appear in an item, in either language, ignoring case and diacritics; results show in the
 * page language. An empty query lists everything.
 *
 * The tools site carries a copy of this file and of the index: edit them in the zvondis.dev
 * repo and run `npm run search` there.
 */
(function () {
    "use strict";

    var COPY = {
        cs: {
            open: "Hledat",
            label: "Rychlé hledání na webu a v nástrojích",
            placeholder: "Kam chceš jít?",
            results: "Výsledky",
            pages: "Stránky",
            tools: "Nástroje",
            none: "Nic nenalezeno.",
            error: "Hledání se nepodařilo načíst.",
            tips: ["vybrat", "otevřít", "zavřít", "otevřít a zavřít"],
            count: function (n) {
                return n + (n === 1 ? " výsledek" : n > 1 && n < 5 ? " výsledky" : " výsledků");
            },
        },
        en: {
            open: "Search",
            label: "Quick search of the site and tools",
            placeholder: "Where to?",
            results: "Results",
            pages: "Pages",
            tools: "Tools",
            none: "Nothing found.",
            error: "The search could not be loaded.",
            tips: ["choose", "open", "close", "open and close"],
            count: function (n) {
                return n + (n === 1 ? " result" : " results");
            },
        },
    };
    var TOOLS_HOST = "tools.zvondis.dev";

    var nav = document.querySelector(".rail-nav");
    if (!nav || !window.fetch || !window.HTMLDialogElement) return;

    function lang() {
        return document.documentElement.lang === "en" ? "en" : "cs";
    }

    function fold(s) {
        return String(s || "")
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase();
    }

    // Matches in both languages, so "vyplata" finds Job Pay on an English page; title hits rank first.
    function match(items, query) {
        var words = fold(query).split(/\s+/).filter(Boolean);
        return items
            .map(function (item, i) {
                var titles = fold(item.cs.title + " " + item.en.title);
                var all = [titles, item.cs.text, item.en.text, item.cs.keywords, item.en.keywords]
                    .map(fold)
                    .join(" ");
                var ok = words.every(function (w) {
                    return all.indexOf(w) >= 0;
                });
                var score = words.filter(function (w) {
                    return titles.indexOf(w) >= 0;
                }).length;
                return ok ? { item: item, score: score, i: i } : null;
            })
            .filter(Boolean)
            .sort(function (a, b) {
                return b.score - a.score || a.i - b.i;
            })
            .map(function (hit) {
                return hit.item;
            });
    }

    function isTool(item) {
        return new URL(item.en.url).host === TOOLS_HOST;
    }

    function make(tag, attrs, text) {
        var el = document.createElement(tag);
        for (var k in attrs) el.setAttribute(k, attrs[k]);
        if (text) el.textContent = text;
        return el;
    }

    var mac = /Mac|iPhone|iPad/.test(navigator.platform || "");

    var button = make("button", {
        type: "button",
        class: "nav-link search-open",
        "aria-haspopup": "dialog",
        "aria-expanded": "false",
        "aria-controls": "search",
        "aria-keyshortcuts": "Control+K Meta+K /",
    });
    var li = document.createElement("li");
    li.append(button);
    nav.querySelector("ul").append(li);

    var dialog = make("dialog", { class: "switcher", id: "search" });
    var input = make("input", {
        type: "text",
        class: "switcher-input",
        role: "combobox",
        "aria-expanded": "true",
        "aria-controls": "search-list",
        "aria-autocomplete": "list",
        "aria-describedby": "search-tips",
        autocomplete: "off",
        spellcheck: "false",
        enterkeyhint: "go",
    });
    var list = make("div", { class: "switcher-list", id: "search-list", role: "listbox" });
    var status = make("p", { class: "switcher-status", role: "status" });
    var tips = make("p", { class: "switcher-tips", id: "search-tips" });
    dialog.append(input, list, status, tips);
    document.body.append(dialog);

    var items = null;
    var loading = null;
    var active = -1;
    var returnTo = null;

    function options() {
        return list.querySelectorAll("[role=option]");
    }

    function relabel() {
        var t = COPY[lang()];
        button.textContent = t.open;
        dialog.setAttribute("aria-label", t.label);
        input.setAttribute("aria-label", t.label);
        input.placeholder = t.placeholder;
        list.setAttribute("aria-label", t.results);
        tips.replaceChildren();
        [
            [["↑", "↓"], t.tips[0]],
            [["Enter"], t.tips[1]],
            [["Esc"], t.tips[2]],
            [[mac ? "⌘" : "Ctrl", "K"], t.tips[3]],
        ].forEach(function (tip) {
            var span = make("span", { class: "switcher-tip" });
            tip[0].forEach(function (key) {
                span.append(make("kbd", {}, key));
            });
            span.append(" " + tip[1]);
            tips.append(span);
        });
    }

    function setActive(i, scroll) {
        var opts = options();
        if (opts[active]) opts[active].setAttribute("aria-selected", "false");
        active = i;
        if (!opts[i]) {
            input.removeAttribute("aria-activedescendant");
            return;
        }
        opts[i].setAttribute("aria-selected", "true");
        input.setAttribute("aria-activedescendant", opts[i].id);
        if (scroll) opts[i].scrollIntoView({ block: "nearest" });
    }

    function group(heading, hits, l, start) {
        var id = "search-group-" + start;
        var box = make("div", { role: "group", "aria-labelledby": id });
        box.append(
            make("div", { class: "switcher-heading", id: id, role: "presentation" }, heading),
        );
        hits.forEach(function (item, i) {
            var a = make("a", {
                class: "switcher-option",
                href: item[l].url,
                role: "option",
                id: "search-opt-" + (start + i),
                "aria-selected": "false",
                tabindex: "-1",
            });
            a.append(
                make("span", { class: "switcher-name" }, item[l].title),
                make("span", { class: "switcher-text" }, item[l].text),
                make("span", { class: "switcher-site" }, isTool(item) ? "tools" : "zvondis.dev"),
            );
            box.append(a);
        });
        list.append(box);
    }

    function render() {
        if (!items) return;
        var l = lang();
        var t = COPY[l];
        var query = input.value.trim();
        var hits = query ? match(items, query) : items;
        var pages = hits.filter(function (item) {
            return !isTool(item);
        });
        var tools = hits.filter(isTool);
        list.replaceChildren();
        active = -1;
        if (pages.length) group(t.pages, pages, l, 0);
        if (tools.length) group(t.tools, tools, l, pages.length);
        if (!hits.length) list.append(make("p", { class: "switcher-empty" }, t.none));
        setActive(hits.length ? 0 : -1, true);
        status.textContent = hits.length ? t.count(hits.length) : t.none;
    }

    function load() {
        if (loading) return;
        // Private pages (zvondis.dev/hub, /invoice) point at their own index with private entries added.
        var index = document.querySelector('meta[name="search-index"]');
        loading = fetch((index && index.content) || "/search.json")
            .then(function (r) {
                if (!r.ok) throw new Error(r.status);
                return r.json();
            })
            .then(function (data) {
                items = data;
                render();
            })
            .catch(function () {
                loading = null; // try again on the next open
                list.replaceChildren(make("p", { class: "switcher-empty" }, COPY[lang()].error));
                status.textContent = COPY[lang()].error;
            });
    }

    function open() {
        if (dialog.open) return;
        returnTo = document.activeElement;
        input.value = "";
        dialog.showModal();
        button.setAttribute("aria-expanded", "true");
        input.focus();
        load();
        render();
    }

    // Esc, a click on the backdrop and Ctrl+K all end here.
    dialog.addEventListener("close", function () {
        if (dialog.open) return; // the event is queued; a fast Ctrl+K, "/" may have reopened it
        button.setAttribute("aria-expanded", "false");
        input.value = "";
        list.replaceChildren();
        status.textContent = "";
        active = -1;
        input.removeAttribute("aria-activedescendant");
        var back = returnTo && returnTo.isConnected ? returnTo : button;
        if (back === document.body) back = button;
        back.focus();
    });

    // The panel fills the dialog, so a click that lands on the dialog itself is on the backdrop.
    dialog.addEventListener("click", function (e) {
        if (e.target === dialog) dialog.close();
    });

    button.addEventListener("click", open);
    input.addEventListener("input", render);

    list.addEventListener("pointermove", function (e) {
        var opt = e.target.closest("[role=option]");
        if (!opt) return;
        var i = Array.prototype.indexOf.call(options(), opt);
        if (i !== active) setActive(i, false);
    });

    input.addEventListener("keydown", function (e) {
        var n = options().length;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!n) return;
            var step = e.key === "ArrowDown" ? 1 : -1;
            setActive((active + step + n) % n, true);
        } else if (e.key === "Enter" && n) {
            e.preventDefault();
            location.href = options()[Math.max(active, 0)].href;
        }
    });

    document.addEventListener("keydown", function (e) {
        var key = (e.key || "").toLowerCase();
        if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && key === "k") {
            e.preventDefault();
            if (dialog.open) dialog.close();
            else open();
            return;
        }
        var typing =
            e.target.closest && e.target.closest("input, textarea, select, [contenteditable]");
        if (key === "/" && !typing && !dialog.open && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            open();
        }
    });

    // The tools site switches language without a reload.
    new MutationObserver(function () {
        relabel();
        if (dialog.open) render();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    relabel();
})();
