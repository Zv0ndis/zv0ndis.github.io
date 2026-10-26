---
name: Zvondis
description: Personal site of Tomáš Zvoníček, built as an arcade cabinet in attract mode.
colors:
  cabinet-ink: "#07060d"
  plum-panel: "#110e19"
  plum-panel-raised: "#1a1525"
  bezel-black: "#16121e"
  hairline: "#2b2440"
  hairline-strong: "#463a62"
  phosphor-white: "#e8e3f5"
  phosphor-white-strong: "#fbf9ff"
  dim-lavender: "#aaa0c4"
  faint-lavender: "#8d83a7"
  neon-magenta: "#ff2bd6"
  neon-magenta-soft: "rgb(255 43 214 / 12%)"
  phosphor-cyan: "#21f0ff"
  phosphor-cyan-soft: "rgb(33 240 255 / 10%)"
  start-yellow: "#ffe23a"
typography:
  marquee:
    fontFamily: "Monoton, Chakra Petch, sans-serif"
    fontSize: "clamp(34px, 6vw, 64px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  display:
    fontFamily: "Chakra Petch, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(32px, 5vw, 52px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Chakra Petch, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.12em"
  title:
    fontFamily: "Chakra Petch, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Chakra Petch, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Chakra Petch, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.08em"
  pixel:
    fontFamily: "Press Start 2P, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  screen: "28px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  page: "1180px"
components:
  button-start:
    backgroundColor: "{colors.start-yellow}"
    textColor: "{colors.cabinet-ink}"
    rounded: "{rounded.sm}"
    padding: "16px 24px 15px"
  button-toggle:
    backgroundColor: "{colors.neon-magenta-soft}"
    textColor: "{colors.phosphor-white-strong}"
    rounded: "{rounded.sm}"
    padding: "11px 16px"
  button-toggle-hover:
    backgroundColor: "{colors.neon-magenta}"
    textColor: "{colors.cabinet-ink}"
  nav-button:
    textColor: "{colors.dim-lavender}"
    padding: "6px 2px"
  nav-button-current:
    textColor: "{colors.start-yellow}"
  coin-slot:
    backgroundColor: "{colors.cabinet-ink}"
    textColor: "{colors.phosphor-white}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  tag:
    backgroundColor: "{colors.phosphor-cyan-soft}"
    textColor: "{colors.phosphor-white}"
    rounded: "{rounded.sm}"
    padding: "4px 9px"
  input:
    backgroundColor: "{colors.cabinet-ink}"
    textColor: "{colors.phosphor-white-strong}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  crt-screen:
    backgroundColor: "{colors.cabinet-ink}"
    rounded: "{rounded.screen}"
    padding: "clamp(28px, 5vw, 64px) clamp(20px, 5vw, 64px)"
  bezel-cell:
    backgroundColor: "{colors.cabinet-ink}"
    textColor: "{colors.phosphor-white-strong}"
    padding: "16px 18px"
---

# Design System: Zvondis

## Overview

**Creative North Star: "The Cabinet in Attract Mode"**

Every page is an arcade cabinet waiting for a player. A lit neon marquee sits on top, a control panel of round buttons sits below it, and the content plays on a CRT screen set into a rounded bezel, with scanlines on the glass. The home page is the attract loop: the offer on screen, PRESS START as the call to action, contact cells set into the cabinet beside the screen, a high-score table of real projects, and a "Continue?" close. Inner pages (CV, Uses, Semester, Job Pay) reuse the same marquee, panel and screen, so the whole site reads as one machine.

The ground is near-black with dark plum panels. Three signal colours each have one job and are never used to decorate. Density is moderate: content sits on the screen in a single readable column (prose capped at 70ch), with hairline-ruled rows for lists, tables and results.

Motion is how the hardware behaves: tubes stutter on, the tube warms up, the picture cuts between pages. All of it is switched off under `prefers-reduced-motion`.

**Key Characteristics:**

- One lit object per page: the magenta neon marquee.
- CRT screen container (rounded bezel, inner vignette, scanlines) for all page content.
- Navigation is a row of round arcade buttons. The current page is the one yellow-lit button.
- Pixel face only for short ASCII labels and numbers. Everything people read is in Chakra Petch.
- Hairline rules and 4px corners on the screen; the screen itself is the only big rounded shape.

## Colors

Cabinet black and plum, with three phosphor/neon signals that each have one job.

### Primary

- **Neon Magenta** (neon-magenta): the marquee gas glow, the 3px T-molding under the marquee and along the cabinet body, the square markers in front of section titles, list markers, the high-score rank numbers and header rule, emphasis inside the home headline, link hover, and the selection highlight. The soft tint (neon-magenta-soft) backs the admin toggle and the over-threshold notice.

### Secondary

- **Phosphor Cyan** (phosphor-cyan): CRT phosphor. Used for links, section-title text, bezel cell keys, entry roles, the segmented energy-bar fill, the job-pay total, and the hover border on the coin slot and contact chips. The soft tint (phosphor-cyan-soft, with a 35% cyan border) fills tags and the info notice.

### Tertiary

- **Start Yellow** (start-yellow): reserved for the active state and the primary action. It appears on the current nav button, the focus ring, input focus border and caret, the checked radio, and the PRESS START button. Nothing else.

### Neutral

- **Cabinet Ink** (cabinet-ink): page ground, recessed wells (inputs, coin slot, bezel strip, result panels).
- **Plum Panel / Plum Panel Raised** (plum-panel, plum-panel-raised): the control-panel and cabinet-body gradient, plus bezel cell hover.
- **Bezel Black** (bezel-black): the 14px CRT bezel and the cabinet side panels.
- **Hairline / Hairline Strong** (hairline, hairline-strong): row dividers, mounting rails, and outlines on wells and chips. Dashed hairline-strong separates header and form blocks.
- **Phosphor White / Strong** (phosphor-white, phosphor-white-strong): body text, and headings, names and values.
- **Dim / Faint Lavender** (dim-lavender, faint-lavender): secondary prose, captions, dates, table headers, placeholders. Both pass AA on cabinet ink.

### Named Rules

**The One Lit Object Rule.** Only the marquee glows. Neon text-shadow belongs to the marquee sign and nowhere else.

**The Yellow Means Now Rule.** Yellow marks only what is active or the one primary action. If a surface has no active state and no primary action, it has no yellow.

**The Phosphor Wiring Rule.** Cyan is information (links, labels, data). Magenta is structure and markers. Don't swap them.

## Typography

**Display Font:** Monoton (marquee only)
**Body Font:** Chakra Petch 400/700 (with ui-sans-serif, system-ui)
**Label/Mono Font:** Press Start 2P (with ui-monospace)

**Character:** Neon-tube lettering for the sign, a pixel face for machine text, and a squared techno sans for everything people actually read. All three are self-hosted under OFL and split into latin and latin-ext subsets.

### Hierarchy

- **Marquee** (Monoton 400, clamp(34px, 6vw, 64px); on home up to clamp(44px, min(11vw, 15vh), 140px), uppercase, 0.04em): the ZVONDIS sign. Never used for anything else.
- **Display** (700, clamp(32px, 5vw, 52px), 1.05, -0.02em, balanced): page h1. On the home screen it grows to clamp(34px, min(5.2vw, 7.4vh), 72px) at 0.98 line height and max 18ch.
- **Headline** (700, 15px, 0.12em, uppercase, cyan, behind a 10px magenta square): section titles. The "Continue?" close is the exception: magenta, larger, no square.
- **Title** (700, 18px, 1.3): entry titles. Score names are 17–21px.
- **Body** (400, 16px, 1.6, max 70ch): prose. Secondary prose uses dim lavender.
- **Label** (700, 13–14px, 0.06–0.08em, uppercase): tech labels, form labels, nav buttons, table headers.
- **Pixel** (Press Start 2P, 11–12px, 1.4, uppercase): cell keys, PRESS START key, HUD credits strip, coin slot, score ranks, the 404 numeral.

### Named Rules

**The ASCII-Only Pixel Rule.** Press Start 2P has no Czech capitals. Use it only for short ASCII strings and numbers. Any label that could carry a Czech diacritic goes in Chakra Petch.

**The Marquee Owns Monoton Rule.** Monoton is the sign, and only the sign.

## Layout

The page stacks marquee, control panel and content. The home page uses a cabinet column (max 1180px, gutter clamp(16px, 4vw, 40px)) with the cabinet body as a two-column grid: the screen (min-height clamp(380px, 52vh, 560px)) and a 280px bezel strip of four contact cells spread over the full height. Inner pages use a single centered screen container (max 1040px, padding clamp(28px, 5vw, 64px) clamp(20px, 5vw, 64px)). Sections are spaced 48px apart. The home bands (scores, continue) open up with clamp gaps of 56–112px.

Responsive: at 900px or narrower the cabinet body goes to one column, the bezel strip becomes a 2×2 grid, and two-column CV blocks stack. At 640px or narrower the bezel thins to 8px with an 18px radius, the side T-molding narrows, the nav becomes a 3-column grid of smaller buttons (18px caps), the score stack column hides, and form fields go full width. At 480px or narrower the bezel cells go to a single column.

## Elevation & Depth

Depth is physical, not ambient. The screen is recessed: a 1px outer hairline, a 120px inner black vignette, a 4% inner highlight and a long drop shadow under the cabinet. The arcade button caps are convex discs: inner shade and highlight, a dark collar ring, and a soft drop. PRESS START sits on a soft 0 8px 20px black shadow. Everything else is flat and separated by hairlines and tone. Glow is not depth here; it belongs to the marquee alone.

### Shadow Vocabulary

- **CRT recess** (`box-shadow: 0 0 0 1px #463a62, inset 0 0 0 1px rgb(255 255 255 / 4%), inset 0 0 120px rgb(0 0 0 / 65%), 0 24px 48px rgb(0 0 0 / 55%)`): the screen container only.
- **Button cap** (`box-shadow: inset 0 -3px 5px rgb(0 0 0 / 35%), inset 0 2px 3px rgb(255 255 255 / 35%), 0 0 0 3px #07060d, 0 0 0 4px #463a62, 0 3px 8px 3px rgb(0 0 0 / 55%)`): nav caps.
- **Start lift** (`box-shadow: 0 8px 20px rgb(0 0 0 / 55%)`): PRESS START.
- **Neon tube** (`text-shadow: 0 0 2px #fff, 0 0 10px #ff2bd6, 0 0 28px #ff2bd6, 0 0 64px rgb(255 43 214 / 55%)`): the marquee sign only.

### Named Rules

**The Flat Glass Rule.** Content on the screen is flat. Rows, chips and panels separate with hairlines and ink wells, never with shadows.

## Shapes

The CRT is the only large rounded shape (28px bezel radius, 14px bezel). Everything set into or onto it (chips, inputs, wells, toggles, PRESS START) uses a 4px corner. Nav caps are full circles. Section markers are hard 10px squares. The energy bar is segmented (10px cells, 3px gaps), never a smooth pill. Cabinet body edges carry a 3px magenta T-molding strip.

## Components

### Buttons

- **Shape:** squared with a slight round (4px).
- **Primary (PRESS START):** start-yellow fill, ink text. A blinking pixel "PRESS START" key over the phone number in 700 tabular figures. Lifts 1px on hover and presses 3px on active. The only big yellow object on any page.
- **Toggle:** magenta-soft fill, 1px magenta border, uppercase 700 label. Fills solid magenta with ink text on hover.
- **Text link button:** faint-lavender underlined text, magenta on hover.

### Chips

- **Tag:** cyan-soft fill, 35% cyan border, 13px body text.
- **Contact chip / coin slot:** ink well, hairline-strong border, cyan border and text on hover. The coin slot is the language switch: pixel CZ/EN beside a 3px slot mark.

### Cards / Containers

- **CRT screen:** see Elevation (CRT recess). A radial plum-to-ink glass, with scanlines (3px period, 22% black) above the content in a pointer-transparent layer.
- **Wells:** results, the bezel strip and the progress track are ink fill with a hairline-strong border, 4px corners and hairline row dividers.

### Inputs / Fields

- **Style:** ink fill, hairline-strong border, 4px corners, strong text, tabular numbers, dark colour scheme.
- **Focus:** the border turns yellow and the caret is yellow. Radios use a yellow accent, and a checked radio pill gets a yellow border and text.

### Navigation

- **Control panel:** a plum gradient strip of round arcade buttons with uppercase 700 labels in dim lavender. Caps alternate magenta and cyan. The current page's cap and label are yellow. The cap presses 2px on active. The coin slot language switch sits at the end. Rendered by a light-DOM custom element.

### Marquee (signature)

A full-width backboard with two hairline mounting rails and a 3px magenta bottom edge. The Monoton sign glows as a neon tube and stutters twice on load (steps, lit by default).

### High-score table (signature)

A pixel magenta rank, a 700 name and a dim right-aligned stack column. Uppercase faint headers sit over a 2px magenta rule, with hairline rows below.

### Motion

CRT power-on (520ms, the home screen opens from a bright line), the CRT-cut cross-document view transition (170ms out, 300ms in), the neon stutter (900ms, steps), and the PRESS START blink (1s steps, 6 cycles, then still). The standard easing is cubic-bezier(0.16, 1, 0.3, 1) at 160ms. Every animation is removed under reduced motion.

## Do's and Don'ts

### Do:

- **Do** put every page's content on the CRT screen under the marquee and control panel.
- **Do** keep yellow to the current nav button, focus and checked states, and the single primary action.
- **Do** use cyan for links, labels and data, and magenta for markers, rules and the marquee.
- **Do** use Press Start 2P only for short ASCII labels and numbers, and Chakra Petch for any text that may carry Czech diacritics.
- **Do** separate rows with 1px hairlines and keep corners at 4px inside the screen.
- **Do** gate every new animation behind the existing reduced-motion reset, and cap any blink at a few cycles.

### Don't:

- **Don't** give anything but the marquee sign a neon glow or text-shadow.
- **Don't** use yellow as decoration, an accent or a highlight colour.
- **Don't** use Monoton outside the marquee.
- **Don't** set prose, headings or Czech-bearing labels in the pixel face.
- **Don't** replace the segmented energy bar or the round arcade buttons with smooth pills or plain text tabs.
- **Don't** add loops that run forever; attract-mode motion settles after load.
