---
version: 1
slug: "src-en-index-njk"
primary_target: "src/en/index.njk"
related_targets: ["src/cs/index.njk","src/assets/style.css"]
---

# Surface brief: home (and the shared cabinet frame for every page)

Scope: site-wide redesign; home is the lead surface (Persuade). CV and Uses read as Read; Semester and Job Pay as Operate inside the same cabinet.
Audience: employers reading the CV; website clients who should phone; friends using the tools.
Action: tap the phone number (tel:) — "PRESS START"; second action: open CV.
Proof: real public repos as a high-score table.
Constraints: Eleventy, one stylesheet, self-hosted fonts, CZ/EN parity, npm run check must pass, reduced motion respected.

## Direction contract

THESIS: The site is an arcade cabinet in attract mode — marquee, CRT screen, control panel — refusing the dark dev-portfolio of a headline, two buttons and a row of project cards.

OWN-WORLD: Cabinet black ground (#07060d) with dark plum panels; magenta neon tube marquee lettering (the only glowing thing); cyan phosphor hairlines and labels on the CRT glass with scanlines and rounded bezel; yellow reserved solely for the active state and the primary action. Neon-tube display face for the marquee, pixel face for short labels/numbers, a squared techno sans for prose. Round arcade buttons as navigation.

STORY: Visitor sees ZVONDIS lit up, reads "I'll build you a website at a reasonable price", taps PRESS START to call; scrolls to the high-score table of real projects and the CV.

FIRST VIEWPORT: Full-width marquee band (~22vh) with ZVONDIS in neon tubes; control-panel strip of round buttons directly below; CRT screen centered with status line, large headline offer, yellow PRESS START tel button, CV link; on desktop a bezel column of data cells (TEL, MAIL, GITHUB, LOC) to the right of the screen.

FORM: Arcade cabinet attract mode, own grounded list position 3, seed key 021f40ed. Raises: fixed broadcast order of screens; yellow reserved for active only; bezel cells carry real data as controls; each page addressable with a hard CRT cut between pages.

SIGNATURE: CRT power-on on page entry (screen opens from a horizontal line) and CRT cut as the cross-document view transition; PRESS START blinks in hard steps.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
