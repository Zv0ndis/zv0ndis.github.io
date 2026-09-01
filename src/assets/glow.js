/**
 * Drives the ambient glow (.glow, styled in style.css).
 *
 * It drifts on a slow path by itself, and hands control to the pointer while
 * the pointer is moving, returning to the drift a few seconds after it stops.
 *
 * Only the target position is set here — the easing is a CSS transition on
 * `translate`, which the browser runs on the compositor. The two modes want
 * very different easing, so tracking swaps in a much shorter duration via
 * `.is-tracking`: long easing on the drift keeps its 120ms steps continuous,
 * but the same easing on the pointer just reads as lag.
 */
(function () {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var glow = document.querySelector(".glow");
    if (!glow) return;

    var TICK_MS = 120; // shorter than the drift transition, so steps never settle
    var HANDOVER_MS = 2000; // pointer keeps control this long after its last move
    var STEP = 0.0084; // radians per tick — a full loop takes about 90 seconds

    var phase = Math.random() * Math.PI * 2;
    var pointerUntil = 0;
    var tracking = false;

    function moveTo(x, y) {
        glow.style.translate = Math.round(x) + "px " + Math.round(y) + "px";
    }

    // Two frequencies that do not divide evenly, so the path never repeats
    // exactly and does not read as a loop.
    function drift() {
        if (document.hidden || performance.now() < pointerUntil) return;
        if (tracking) {
            glow.classList.remove("is-tracking");
            tracking = false;
        }
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
                if (!tracking) {
                    glow.classList.add("is-tracking");
                    tracking = true;
                }
                pointerUntil = performance.now() + HANDOVER_MS;
                moveTo(event.clientX, event.clientY);
            },
            { passive: true },
        );
    }
})();
