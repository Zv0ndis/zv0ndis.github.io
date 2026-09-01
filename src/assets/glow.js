/**
 * Drives the ambient glow (.glow, styled in style.css).
 *
 * It drifts on a slow path by itself, and hands control to the pointer while
 * the pointer is moving, returning to the drift a few seconds after it stops.
 *
 * Only the target position is set here — the easing is a CSS transition on
 * `translate`, which the browser runs on the compositor. The drift ticks well
 * inside that transition, so every step interrupts the previous one and the
 * motion stays continuous without any per-frame JavaScript.
 */
(function () {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var glow = document.querySelector(".glow");
    if (!glow) return;

    var TICK_MS = 120; // shorter than the CSS transition, so steps never settle
    var HANDOVER_MS = 2600; // pointer keeps control this long after its last move
    var STEP = 0.0084; // radians per tick — a full loop takes about 90 seconds

    var phase = Math.random() * Math.PI * 2;
    var pointerUntil = 0;

    function moveTo(x, y) {
        glow.style.translate = Math.round(x) + "px " + Math.round(y) + "px";
    }

    // Two frequencies that do not divide evenly, so the path never repeats
    // exactly and does not read as a loop.
    function drift() {
        if (document.hidden || performance.now() < pointerUntil) return;
        phase += STEP;
        moveTo(
            (0.5 + 0.3 * Math.cos(phase)) * window.innerWidth,
            (0.42 + 0.26 * Math.sin(phase * 0.77)) * window.innerHeight,
        );
    }

    setInterval(drift, TICK_MS);
    drift();

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        window.addEventListener(
            "pointermove",
            function (event) {
                if (event.pointerType === "touch") return;
                pointerUntil = performance.now() + HANDOVER_MS;
                moveTo(event.clientX, event.clientY);
            },
            { passive: true },
        );
    }
})();
