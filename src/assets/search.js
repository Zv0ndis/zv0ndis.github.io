/**
 * Shared search for zvondis.dev and tools.zvondis.dev. Adds a "Search" button to the rail nav;
 * it opens a combobox under the nav. The index is the same-origin /search.json (built by
 * src/search.11ty.js), fetched on first open. Every query word must appear in an item, in either
 * language, ignoring case and diacritics; results show in the page language.
 *
 * The tools site carries a copy of this file and of the index: edit them in the zvondis.dev
 * repo and run `npm run search` there.
 */
(function () {
    "use strict";

    var COPY = {
        cs: {
            open: "Hledat",
            label: "Hledat na webu a v nástrojích",
            results: "Výsledky",
            hint: "Šipky vybírají, Enter otevře, Esc zavře.",
            none: "Nic nenalezeno.",
            error: "Hledání se nepodařilo načíst.",
            count: function (n) {
                return n + (n === 1 ? " výsledek" : n < 5 ? " výsledky" : " výsledků");
            },
        },
        en: {
            open: "Search",
            label: "Search the site and tools",
            results: "Results",
            hint: "Arrows choose, Enter opens, Esc closes.",
            none: "Nothing found.",
            error: "The search could not be loaded.",
            count: function (n) {
                return n + (n === 1 ? " result" : " results");
            },
        },
    };

    var nav = document.querySelector(".rail-nav");
    if (!nav || !window.fetch) return;

    function lang() {
        return document.documentElement.lang === "en" ? "en" : "cs";
    }

    function fold(s) {
        return String(s || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
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

    function make(tag, attrs) {
        var el = document.createElement(tag);
        for (var k in attrs) el.setAttribute(k, attrs[k]);
        return el;
    }

    var button = make("button", {
        type: "button",
        class: "nav-link search-open",
        "aria-expanded": "false",
        "aria-controls": "search",
        "aria-keyshortcuts": "Control+K /",
    });
    var li = document.createElement("li");
    li.append(button);
    nav.querySelector("ul").append(li);

    var box = make("div", { class: "search", id: "search", hidden: "" });
    var label = make("label", { class: "field", for: "search-input" });
    var input = make("input", {
        type: "text",
        id: "search-input",
        role: "combobox",
        "aria-expanded": "false",
        "aria-controls": "search-list",
        "aria-autocomplete": "list",
        "aria-describedby": "search-hint",
        autocomplete: "off",
        spellcheck: "false",
        enterkeyhint: "go",
    });
    var list = make("ul", { class: "search-list", id: "search-list", role: "listbox" });
    var status = make("p", { class: "search-note", role: "status" });
    var hint = make("p", { class: "search-note", id: "search-hint" });
    box.append(label, input, status, list, hint);
    nav.after(box); // outside the nav, so the .rail-nav ul grid does not reach the results

    var items = null;
    var loading = null;
    var active = -1;

    function relabel() {
        var t = COPY[lang()];
        button.textContent = t.open;
        label.textContent = t.label;
        list.setAttribute("aria-label", t.results);
        hint.textContent = t.hint;
    }

    function setActive(i) {
        var options = list.children;
        if (active >= 0 && options[active]) options[active].setAttribute("aria-selected", "false");
        active = i;
        if (i < 0) {
            input.removeAttribute("aria-activedescendant");
            return;
        }
        options[i].setAttribute("aria-selected", "true");
        input.setAttribute("aria-activedescendant", options[i].id);
        options[i].scrollIntoView({ block: "nearest" });
    }

    function render() {
        if (!items) return;
        var l = lang();
        var hits = match(items, input.value);
        list.replaceChildren();
        active = -1;
        input.removeAttribute("aria-activedescendant");
        hits.forEach(function (item, i) {
            var option = make("li", {
                role: "option",
                id: "search-opt-" + i,
                "aria-selected": "false",
            });
            var a = make("a", { href: item[l].url, tabindex: "-1" });
            var title = document.createElement("b");
            var text = document.createElement("span");
            title.textContent = item[l].title;
            text.textContent = item[l].text;
            a.append(title, text);
            option.append(a);
            list.append(option);
        });
        input.setAttribute("aria-expanded", hits.length ? "true" : "false");
        status.textContent = hits.length ? COPY[l].count(hits.length) : COPY[l].none;
    }

    function load() {
        if (loading) return;
        loading = fetch("/search.json")
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
                status.textContent = COPY[lang()].error;
            });
    }

    function open() {
        box.hidden = false;
        button.setAttribute("aria-expanded", "true");
        input.focus();
        load();
        render();
    }

    function close() {
        box.hidden = true;
        button.setAttribute("aria-expanded", "false");
        input.value = "";
        input.setAttribute("aria-expanded", "false");
        button.focus();
    }

    button.addEventListener("click", function () {
        if (box.hidden) open();
        else close();
    });

    input.addEventListener("input", render);

    input.addEventListener("keydown", function (e) {
        var n = list.children.length;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!n) return;
            var step = e.key === "ArrowDown" ? 1 : -1;
            setActive(active < 0 ? (step > 0 ? 0 : n - 1) : (active + step + n) % n);
        } else if (e.key === "Enter" && n) {
            e.preventDefault();
            location.href = list.children[Math.max(active, 0)].firstChild.href;
        } else if (e.key === "Escape") {
            e.preventDefault();
            close();
        }
    });

    document.addEventListener("keydown", function (e) {
        var typing =
            e.target.closest && e.target.closest("input, textarea, select, [contenteditable]");
        if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key || "").toLowerCase() === "k") {
            e.preventDefault();
            open();
        } else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            open();
        }
    });

    // The tools site switches language without a reload.
    new MutationObserver(function () {
        relabel();
        if (!box.hidden) render();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    relabel();
})();
