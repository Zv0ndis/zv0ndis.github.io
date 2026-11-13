// Rotating, beating ASCII heart drawn with 0 and 1 into <pre data-heart>.
// Surface: (x² + 9/4·y² + z² − 1)³ − x²z³ − 9/80·y²z³ = 0 (z up, y depth), sampled once,
// then each frame rotated around z, projected with a z-buffer and shaded in four opacity steps.
(() => {
    const pre = document.querySelector("[data-heart]");
    if (!pre) return;

    const COLS = 46, ROWS = 23;
    const f = (x, y, z) => {
        const a = x * x + 2.25 * y * y + z * z - 1;
        return a * a * a - x * x * z * z * z - 0.1125 * y * y * z * z * z;
    };

    // Point cloud: for each direction from the centre, bisect the radius where f changes sign.
    const pts = [];
    for (let i = 0; i < 70; i++) {
        const theta = (Math.PI * (i + 0.5)) / 70; // from +z down to −z
        for (let j = 0; j < 140; j++) {
            const phi = (2 * Math.PI * j) / 140;
            const d = [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)];
            let lo = 0, hi = 1.6;
            if (f(d[0] * hi, d[1] * hi, d[2] * hi) <= 0) continue;
            for (let k = 0; k < 24; k++) {
                const m = (lo + hi) / 2;
                f(d[0] * m, d[1] * m, d[2] * m) < 0 ? (lo = m) : (hi = m);
            }
            const p = [d[0] * lo, d[1] * lo, d[2] * lo];
            const e = 1e-3; // normal = gradient of f
            const n = [0, 1, 2].map((ax) => {
                const q = p.slice(); q[ax] += e;
                const r = p.slice(); r[ax] -= e;
                return f(...q) - f(...r);
            });
            const len = Math.hypot(...n) || 1;
            pts.push(p, n.map((v) => v / len));
        }
    }

    const hash = (x) => { // small integer mixer, so neighbouring points get unrelated bits
        x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
        x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
        return (x ^ (x >>> 16)) >>> 0;
    };

    const light = [-0.45, -0.7, 0.55].map((v, _, a) => v / Math.hypot(...a));

    function frame(t) {
        const ang = t / 1600;
        const beat = 1 + 0.07 * Math.pow(Math.max(0, Math.sin(t / 260)), 6); // short double-ish pulse
        const c = Math.cos(ang), s = Math.sin(ang);
        const shade = new Int8Array(COLS * ROWS).fill(-1); // -1 empty, 0 (dark) .. 3 (lit)
        const bit = new Uint8Array(COLS * ROWS);
        const tick = Math.floor(t / 700);
        const zbuf = new Float32Array(COLS * ROWS).fill(-Infinity);
        for (let i = 0; i < pts.length; i += 2) {
            const [x, y, z] = pts[i], [nx, ny, nz] = pts[i + 1];
            const rx = x * c - y * s, ry = x * s + y * c; // rotate around the vertical axis
            const depth = ry; // toward the viewer = negative y, so smaller ry is nearer
            const sx = Math.round(COLS / 2 + rx * beat * 15.5);
            const sy = Math.round(ROWS / 2 - (z * beat + 0.1) * 8.6);
            if (sx < 0 || sx >= COLS || sy < 0 || sy >= ROWS) continue;
            const k = sy * COLS + sx;
            if (-depth <= zbuf[k]) continue;
            zbuf[k] = -depth;
            const lum = (nx * c - ny * s) * light[0] + (nx * s + ny * c) * light[1] + nz * light[2];
            shade[k] = lum > 0.45 ? 3 : lum > 0.1 ? 2 : lum > -0.25 ? 1 : 0;
            bit[k] = hash(i * 31 + tick) & 1; // bits ride on the surface and flip slowly
        }
        // One span per run of equal shade; the content is only spaces, 0, 1 and our own markup.
        let html = "";
        for (let r = 0; r < ROWS; r++) {
            let cur = -2;
            for (let col = 0; col < COLS; col++) {
                const k = r * COLS + col, sh = shade[k];
                if (sh !== cur) {
                    if (cur >= 0) html += "</span>";
                    if (sh >= 0) html += `<span class="s${sh}">`;
                    cur = sh;
                }
                html += sh < 0 ? " " : bit[k];
            }
            if (cur >= 0) html += "</span>";
            html += "\n";
        }
        pre.innerHTML = html;
    }

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, visible = true;
    const loop = (t) => { frame(t); raf = requestAnimationFrame(loop); };
    const sync = () => {
        cancelAnimationFrame(raf);
        if (still.matches) frame(900); // one calm frame, turned slightly so it reads as 3D
        else if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(pre);
    document.addEventListener("visibilitychange", sync);
    still.addEventListener("change", sync);
    sync();
})();
