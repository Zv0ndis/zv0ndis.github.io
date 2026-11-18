// Animates the 0/1 page art (<pre data-bits>, rendered at build time by the bitArt filter):
// bits flip slowly like the home page heart, and a soft band of light sweeps across the shape.
(() => {
    const pre = document.querySelector("[data-bits]");
    if (!pre) return;

    // Read the build-time markup back into cells: spans carry the shade, spaces are empty.
    const rows = [[]];
    for (const node of pre.childNodes) {
        const shade = node.nodeType === 1 ? Number(node.className.slice(1)) : -1;
        for (const ch of node.textContent) {
            if (ch === "\n") rows.push([]);
            else rows.at(-1).push(ch === " " ? -1 : shade);
        }
    }
    const width = Math.max(...rows.map((r) => r.length));

    const hash = (x) => {
        // same small integer mixer as heart.js
        x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
        x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
        return (x ^ (x >>> 16)) >>> 0;
    };

    function frame(t) {
        const tick = Math.floor(t / 700);
        const span = width * 0.5 + rows.length; // diagonal extent; chars are about twice as tall as wide
        const pos = ((t / 45) % (span + 24)) - 12;
        let html = "",
            i = 0;
        for (let r = 0; r < rows.length; r++) {
            let cur = -1;
            for (let c = 0; c < rows[r].length; c++, i++) {
                let sh = rows[r][c];
                if (sh >= 0 && Math.abs(c * 0.5 + r - pos) < 2.5) sh = Math.min(3, sh + 1);
                if (sh !== cur) {
                    if (cur >= 0) html += "</span>";
                    if (sh >= 0) html += `<span class="s${sh}">`;
                    cur = sh;
                }
                html += sh < 0 ? " " : hash(i * 31 + tick) & 1;
            }
            if (cur >= 0) html += "</span>";
            if (r < rows.length - 1) html += "\n";
        }
        pre.innerHTML = html; // only spaces, 0, 1 and our own spans
    }

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0,
        visible = true;
    const loop = (t) => {
        frame(t);
        raf = requestAnimationFrame(loop);
    };
    const sync = () => {
        cancelAnimationFrame(raf);
        if (!still.matches && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        sync();
    }).observe(pre);
    document.addEventListener("visibilitychange", sync);
    still.addEventListener("change", sync);
    sync();

    // Wide layout: fill the art's column, like the home page heart, but no taller than the CSS
    // max-height (set in the one-screen layout; "none" otherwise).
    const header = pre.parentElement;
    const wide = matchMedia("(width >= 1200px)");
    const fit = () => {
        pre.style.fontSize = "";
        if (!wide.matches) return;
        const style = getComputedStyle(pre);
        const base = parseFloat(style.fontSize);
        const box = pre.getBoundingClientRect(); // max-content wide, so this is the art's own width
        const column = parseFloat(getComputedStyle(header).gridTemplateColumns.split(" ").pop()); // the art's column, wherever it sits in it
        const byWidth = column / (box.width / base);
        const byHeight = parseFloat(style.maxHeight) / (pre.scrollHeight / base); // NaN without a cap
        pre.style.fontSize = `${Math.min(byWidth, byHeight || byWidth)}px`;
    };
    new ResizeObserver(fit).observe(header);
    wide.addEventListener("change", fit);
    addEventListener("resize", fit); // the cap follows the window height, which the header may not
})();
