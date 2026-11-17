---
name: Zvondis
description: Personal site of Tomáš Zvoníček, set as a minimal Swiss page with one grotesque, one accent and hairline rules.
colors:
  paper: "#fafaf9"
  ink: "#0c0c0d"
  mute: "#595c62"
  rule: "#d9dadc"
  field: "#7a7d83"
  accent: "#1637e0"
typography:
  offer:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 6.4vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  offer-accent:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 6.4vw, 5.5rem)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  display:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw + 0.5rem, 4.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  lede:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.45
  title:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.4
  meta:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  bit-art:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontWeight: 400
    lineHeight: 1
rounded:
  sm: "2px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "32px"
  gutter-desktop: "56px"
  column-gap: "24px"
  band: "88px"
components:
  button-call:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    typography: "{typography.lede}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
    height: "60px"
  button-call-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-form:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 22px"
    height: "44px"
  button-form-hover:
    backgroundColor: "{colors.mute}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "44px"
  nav-link:
    textColor: "{colors.mute}"
    typography: "{typography.label}"
    height: "44px"
  nav-link-current:
    textColor: "{colors.ink}"
---

# Design System: Zvondis

## Overview

**Creative North Star: "The Price Tag in Blue"**

A Swiss page, set rather than decorated. One grotesque family carries everything, and the only drama is a weight clash: a heavy 800 headline that drops into a light 300 phrase in the one accent blue. On Home that phrase is "at a reasonable price." and it is the thing a visitor remembers.

The page sits on a strict 12-column grid. A narrow rail in columns 1 to 3 holds the wordmark and the vertical nav; all content hangs from column 4. Every section below the lead is a band: a 1px ink rule across the full grid, the section name in the rail columns, the content from column 4. There are no cards, no shadows, no icons and no ornament. Hairlines separate rows.

Modes per surface: Home persuades (offer, one Call button, proof of work, close). CV, Uses and Privacy are read. Semester is operated: labels above fields, native controls, tabular numbers. The 404 page is the one place the headline gets louder.

**Key Characteristics:**

- One family (Archivo, variable, latin and latin-ext), contrast by weight: 800 against 300.
- One accent, #1637E0, used only for the price phrase on Home and the Call button.
- Rail nav in columns 1 to 3 on desktop; on phones the wordmark and language switch share a top line and the page links wrap below.
- Bands with a 1px ink rule, rows with 1px #D9DADC hairlines.
- 2px corners on the only filled shapes (buttons, inputs). Nothing else is rounded.

## Colors

Near-white paper, near-black ink, one grey for secondary text and one cobalt accent.

### Primary

- **Accent** (accent, #1637E0): the light phrase in the Home headline and the Call button background. 7.57:1 against paper in both directions. It is also the focus ring colour. In dark it is #8C9EFF (see Dark). It never marks links, headings, rules or states.

### Neutral

- **Paper** (paper, #FAFAF9): the page and every input background.
- **Ink** (ink, #0C0C0D): all primary text, band rules, the current nav item, form buttons, the progress fill. 18.72:1 on paper.
- **Mute** (mute, #595C62): ledes, subtitles, roles, row details, inactive nav, labels above facts. 6.42:1 on paper.
- **Field** (field, #7A7D83): input borders. 3.95:1 on paper, above the 3:1 needed for a component boundary.
- **Rule** (rule, #D9DADC): hairlines between rows and link underlines on row titles. Decorative only; it never carries text.

### Contrast pairs

| Foreground     | Background     | Ratio   | Use                      |
| -------------- | -------------- | ------- | ------------------------ |
| ink #0C0C0D    | paper #FAFAF9  | 18.72:1 | body, headings           |
| mute #595C62   | paper #FAFAF9  | 6.42:1  | secondary text           |
| accent #1637E0 | paper #FAFAF9  | 7.57:1  | price phrase, focus ring |
| paper #FAFAF9  | accent #1637E0 | 7.57:1  | Call button label        |
| paper #FAFAF9  | ink #0C0C0D    | 18.72:1 | form buttons, selection  |
| paper #FAFAF9  | mute #595C62   | 6.42:1  | form button hover        |
| field #7A7D83  | paper #FAFAF9  | 3.95:1  | input borders (non-text) |

### Dark

The site follows the OS setting (`prefers-color-scheme: dark`); there is no toggle and nothing is stored. Dark is the same page inverted: the tokens keep their names and roles, only their values change, so no component has its own dark rule. The favicon mark inverts the same way.

| Token  | Light   | Dark    | Dark ratio on paper     |
| ------ | ------- | ------- | ----------------------- |
| paper  | #FAFAF9 | #0C0C0D | page, inputs            |
| ink    | #0C0C0D | #FAFAF9 | 18.72:1                 |
| mute   | #595C62 | #A0A3A9 | 7.73:1                  |
| field  | #7A7D83 | #7D8087 | 4.94:1 (non-text)       |
| rule   | #D9DADC | #2B2D31 | decorative only         |
| accent | #1637E0 | #8C9EFF | 7.87:1, both directions |

The accent lightens to #8C9EFF so the price phrase and focus ring stay readable on dark paper and the Call button label (dark paper on accent) keeps 7.87:1.

The rail player is an ink box, so its secondary text and progress track use two extra tokens that sit on ink rather than paper: `--player-mute` (#A8ABB1 light, #595C62 dark, 6.42:1 on dark ink) and `--player-track` (#3A3C40 light, #D9DADC dark).

### Print

Printing (CV above all) always uses the light tokens on a white sheet, whatever the OS scheme. The rail, skip link, bit art and buttons are hidden, `@page` sets A4 margins, entries and rows never split, and band headings stay with their content. Web links print their URL after the text. `npm run pdf` regenerates `/cv.pdf` and `/en/cv.pdf` from this print view with headless Brave; rerun it whenever the CV copy or styles change.

### Share cards

Each page has a 1200x630 PNG card per language in `src/assets/og/` (og:image, twitter summary_large_image); 404 and the redirects use the home card. They are light only: the mark, the page headline in 800 (Home uses the offer with its accent phrase), the subtitle in mute, the page's bit art and an ink rule over the name and address. `npm run og` renders them from the site stylesheet with headless Brave; rerun it when a headline, subtitle or art changes.

### Named Rules

**The One Blue Rule.** The accent appears twice on the whole site: the price phrase and the Call button. Adding it anywhere else dilutes the offer.

**No Colour Alone.** States are carried by weight and words (bold current nav item, bold over-threshold pay notice, written error text), never by hue.

## Typography

**Family:** Archivo variable, self-hosted as two woff2 files (latin, latin-ext) with the OFL text beside them. Helvetica Neue, Helvetica and Arial are fallbacks only.

### Hierarchy

- **Offer** (800, clamp 44 to 88px, -0.04em, line-height 0.98): the Home headline.
- **Offer accent** (300, same size, accent colour): the closing phrase of the offer, on its own line.
- **Display** (800, clamp 40 to 72px, -0.04em): page titles. On 404 the numerals go larger and the line under them drops to 300.
- **Lede** (400, 20px, mute): the sentence under each title.
- **Title** (700, 18px, -0.01em): row and entry titles.
- **Body** (400, 17px, line-height 1.55, fills its column): everything people read.
- **Label** (700, 15px): band names in the rail, nav, field labels.
- **Meta** (400, 13 to 15px, mute): fact labels, dates, row details.
- **Bit art** (system monospace, 400): only the 0/1 drawings, the Home heart (`.heart`) and the art beside page headings (`.art`). They are pictures made of characters, so every cell, spaces included, must be the same width; Archivo's spaces are narrower than its digits and would break the grid. Never used for text people read.

### Named Rules

**The Weight Clash Rule.** Emphasis is weight, not a second family, not italics, not colour (except the one accent phrase). The bit-art monospace is not a second text family: it draws pictures, not words.

**Tabular Figures.** Dates, money and progress numbers use tabular-nums.

## Layout

12 columns, 24px gaps, full viewport width, 56px side gutters from 960px up (32px from 600px, 16px on phones). The rail takes columns 1 to 3; content takes 4 to 12. The main element is a subgrid in both axes so the lead shares row 1 with the rail and each band can return its heading to the rail columns. Bands are spaced 88px on desktop and 64px below. Below 960px everything is one column.

## Elevation & Depth

Flat. No shadows, no blur, no layered surfaces. Hierarchy comes from scale, weight and the ink band rules.

## Shapes

Square by default. Buttons and inputs take a 2px radius so they do not read as sharp-edged boxes; nothing else is rounded.

## Components

### Buttons

- **Call** (button-call): accent fill, paper text, 20px bold, 60px tall, the phone number in the label. Hover turns ink. Home only, one per page.
- **Form button** (button-form): ink fill, paper text, 44px tall, used for Log in and Save.
- **Text CTA**: bold underlined text with a 44px hit area (View CV, the CV link under the project rows, back home on 404).

### Inputs / Fields

Label above the field, bold 15px. Field 44px tall, 1px field-grey border, 2px radius, paper fill; hover and focus turn the border ink and add the accent focus ring. Radios are native, tinted ink.

### Navigation

`<site-nav>` renders a list of plain text links. Inactive links are mute, the current one is ink and bold with aria-current. On desktop they stack in the rail at a 30px rhythm for mouse users and 44px on touch; the language switch sits under them. On phones the language switch moves to the right of the wordmark and the links wrap in a row, each 44px tall.

**Search** (`assets/search.js`): the script adds a Search button (`.search-open`) to the nav list; without JavaScript there is none. It opens `.search` in flow under the nav: a labelled combobox field, a `role="status"` count, the result listbox and a mute key hint. Each result is a title in bold and a mute line. The active one gets an ink bar on the left and a 2px underline, not a colour. Ctrl+K and `/` open it, arrows choose, Enter opens, Esc closes. The index is `/search.json` (`src/search.11ty.js`), pages from `site.pages` and tools from `site.tools`; matching ignores case and diacritics and covers both languages. `npm run search` copies the index and script to the tools repo, whose CSP only allows same-origin fetches.

### Rows (signature)

The project list, the Uses lists and the CV projects share one row: a bold title in the left 5 of 9 content columns and a mute detail in the right 4, with a #D9DADC hairline under each row. On phones the detail drops under the title.

### Motion

Colour transitions of 150ms on links and buttons and a plain cross-document view transition. Both are switched off under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:

- Keep the accent to the price phrase and the Call button.
- Hang every block from column 4 and put band names in the rail.
- Use weight for emphasis and tabular figures for numbers.
- Keep every interactive target at least 44px tall on touch.

### Don't:

- Don't add cards, shadows, icons, eyebrows or decorative dots.
- Don't introduce a second typeface or italics for emphasis.
- Don't colour states; say them in words and weight.
- Don't use em or en dashes in copy; use a hyphen or restructure.
