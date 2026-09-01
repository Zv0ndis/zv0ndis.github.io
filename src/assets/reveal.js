/**
 * Fades cards in as they scroll into view.
 *
 * Only elements that start below the fold are hidden, and only once this script
 * is running — so there is no flash for content that is already visible, and if
 * the script never runs nothing is hidden at all.
 */
(function () {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    var cards = document.querySelectorAll("section");
    if (!cards.length) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-revealed");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.08 },
    );

    Array.prototype.forEach.call(cards, function (card) {
        // Already on screen (or nearly): leave it alone, it must not flash.
        if (card.getBoundingClientRect().top < window.innerHeight * 0.92) return;
        card.classList.add("reveal-pending");
        observer.observe(card);
    });
})();
