/**
 * Makes the ambient glow (.glow, styled in style.css) trail the pointer.
 *
 * JS only sets the target position; the easing is a CSS transition on
 * `translate`, which the browser runs on the compositor. Skipped for coarse
 * pointers (touch) and reduced-motion, where the glow keeps its CSS resting
 * position.
 */
(function () {
    "use strict";

    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    var glow = document.querySelector(".glow");
    if (!glow) return;

    window.addEventListener(
        "pointermove",
        function (event) {
            if (event.pointerType === "touch") return;
            glow.style.translate = event.clientX + "px " + event.clientY + "px";
        },
        { passive: true },
    );
})();
