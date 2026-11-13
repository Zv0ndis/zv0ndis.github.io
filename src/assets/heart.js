// Rotating, beating ASCII heart drawn with 0 and 1 into <pre data-heart>.
// Shape: the classic heart curve x = 16 sin³t, y = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t (deep notch,
// sharp tip), puffed into a pillow whose thickness follows the distance to the outline. Sampled once into
// a point cloud with normals; each frame turns it around the vertical axis, projects it with a z-buffer
// and shades it in four opacity steps.
(() => {
    const pre = document.querySelector("[data-heart]");
    if (!pre) return;

    const COLS = 50,
        ROWS = 28;
    const SX = 21.5, // screen cells per model unit: chars are ~0.62 as wide as tall
        SY = 13.2;

    // Outline polygon, normalised to roughly −1..1 on both axes.
    const poly = [];
    for (let i = 0; i < 360; i++) {
        const t = (2 * Math.PI * i) / 360;
        poly.push([
            (16 * Math.sin(t) ** 3) / 16,
            (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t) + 2.5) /
                16,
        ]);
    }
    const inside = (x, y) => {
        let c = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const [xi, yi] = poly[i],
                [xj, yj] = poly[j];
            if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
        }
        return c;
    };
    const edgeDist = (x, y) => {
        let m = Infinity;
        for (const [px, py] of poly) m = Math.min(m, (px - x) ** 2 + (py - y) ** 2);
        return Math.sqrt(m);
    };

    // Height map on a grid: pillow profile h = sqrt(1 − (1 − d/dmax)²), so the rim is rounded.
    const N = 120,
        LO = -1.1,
        STEP = 2.2 / N,
        T = 0.32; // half-thickness at the thickest point
    const d = new Float32Array(N * N).fill(-1);
    let dmax = 0;
    for (let gy = 0; gy < N; gy++)
        for (let gx = 0; gx < N; gx++) {
            const x = LO + (gx + 0.5) * STEP,
                y = LO + (gy + 0.5) * STEP;
            if (inside(x, y)) dmax = Math.max(dmax, (d[gy * N + gx] = edgeDist(x, y)));
        }
    const h = (gx, gy) => {
        const v = d[Math.min(N - 1, Math.max(0, gy)) * N + Math.min(N - 1, Math.max(0, gx))];
        return v < 0 ? 0 : T * Math.sqrt(1 - (1 - v / dmax) ** 2);
    };

    const pts = []; // [x, y, z, nx, ny, nz] per point
    const push = (x, y, z, nx, ny, nz) => {
        const l = Math.hypot(nx, ny, nz) || 1;
        pts.push(x, y, z, nx / l, ny / l, nz / l);
    };
    for (let gy = 0; gy < N; gy++)
        for (let gx = 0; gx < N; gx++) {
            if (d[gy * N + gx] < 0) continue;
            const x = LO + (gx + 0.5) * STEP,
                y = LO + (gy + 0.5) * STEP,
                z = h(gx, gy);
            const hx = (h(gx + 1, gy) - h(gx - 1, gy)) / (2 * STEP),
                hy = (h(gx, gy + 1) - h(gx, gy - 1)) / (2 * STEP);
            push(x, y, z, -hx, -hy, 1); // front sheet
            push(x, y, -z, -hx, -hy, -1); // back sheet
            if (d[gy * N + gx] < 2.5 * STEP) {
                // rim wall, so the heart stays solid when seen edge-on
                for (let k = -2; k <= 2; k++) push(x, y, (z * k) / 3, -hx, -hy, 0);
            }
        }

    const hash = (x) => {
        // small integer mixer, so neighbouring points get unrelated bits
        x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
        x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
        return (x ^ (x >>> 16)) >>> 0;
    };

    const light = [-0.45, 0.45, 0.77].map((v, _, a) => v / Math.hypot(...a)); // from upper left, in front

    function frame(t) {
        // A full turn that slows down facing front and back and hurries through the edge-on views.
        const th = t / 1500;
        const ang = th - 0.4 * Math.sin(2 * th);
        const beat = 1 + 0.07 * Math.pow(Math.max(0, Math.sin(t / 260)), 6); // short pulse
        const c = Math.cos(ang),
            s = Math.sin(ang);
        const shade = new Int8Array(COLS * ROWS).fill(-1); // -1 empty, 0 (dark) .. 3 (lit)
        const bit = new Uint8Array(COLS * ROWS);
        const tick = Math.floor(t / 700);
        const zbuf = new Float32Array(COLS * ROWS).fill(-Infinity);
        for (let i = 0; i < pts.length; i += 6) {
            const x = pts[i],
                y = pts[i + 1],
                z = pts[i + 2];
            const rx = x * c + z * s,
                rz = -x * s + z * c; // turn around the vertical axis; the viewer is at +z
            const sx = Math.round(COLS / 2 + rx * beat * SX);
            const sy = Math.round(ROWS / 2 - 0.5 - y * beat * SY);
            if (sx < 0 || sx >= COLS || sy < 0 || sy >= ROWS) continue;
            const k = sy * COLS + sx;
            if (rz <= zbuf[k]) continue;
            zbuf[k] = rz;
            const nx = pts[i + 3] * c + pts[i + 5] * s,
                nz = -pts[i + 3] * s + pts[i + 5] * c;
            const lum = nx * light[0] + pts[i + 4] * light[1] + nz * light[2];
            shade[k] = lum > 0.55 ? 3 : lum > 0.2 ? 2 : lum > -0.15 ? 1 : 0;
            bit[k] = hash((i / 6) * 31 + tick) & 1; // bits ride on the surface and flip slowly
        }
        // One span per run of equal shade; the content is only spaces, 0, 1 and our own markup.
        let html = "";
        for (let r = 0; r < ROWS; r++) {
            let cur = -2;
            for (let col = 0; col < COLS; col++) {
                const k = r * COLS + col,
                    sh = shade[k];
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
    let raf = 0,
        visible = true;
    const loop = (t) => {
        frame(t);
        raf = requestAnimationFrame(loop);
    };
    const sync = () => {
        cancelAnimationFrame(raf);
        if (still.matches)
            frame(600); // one calm frame, turned slightly so it reads as 3D
        else if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        sync();
    }).observe(pre);
    document.addEventListener("visibilitychange", sync);
    still.addEventListener("change", sync);
    sync();

    // Wide layout: the heart sits beside the intro, so size its font to be exactly as tall as the
    // intro text (or as wide as its column, whichever is smaller). Column widths don't depend on
    // the heart (fixed fr shares in CSS), so resizing it can't feed back into the text height.
    const header = pre.parentElement;
    const wide = matchMedia("(width >= 1200px)");
    const fit = () => {
        pre.style.fontSize = "";
        if (!wide.matches) return;
        const text = [...header.children].filter((el) => el !== pre && !el.hidden);
        const height =
            text.at(-1).getBoundingClientRect().bottom - text[0].getBoundingClientRect().top;
        const base = parseFloat(getComputedStyle(pre).fontSize);
        const box = pre.getBoundingClientRect(); // pre is max-content wide, so this is the art's size
        const column = header.getBoundingClientRect().right - box.left;
        pre.style.fontSize = `${Math.min(height / (box.height / base), column / (box.width / base))}px`;
    };
    new ResizeObserver(fit).observe(header);
    wide.addEventListener("change", fit);
})();
