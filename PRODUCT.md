# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Employers / HR** reading the CV to hire a student for a part-time or junior role (cybersecurity, IT infrastructure, programming).
- **Prospective website clients** looking for someone to build them a site at a reasonable price; they act by phoning.
- **The owner himself** using personal tools (Semester tracker with Firebase sign-in, DPP/DPČ pay calculator).
- **Classmates and friends** who are sent links to the Semester and Job Pay tools.

## Product Purpose

Personal site of Tomáš Zvoníček ("Zvondis"), FIT BUT Brno student. It presents who he is and what he has built, offers website-building as a paid service, and hosts a few small personal utilities. Success: an employer reaches the CV and contacts him; a website client calls the phone number.

## Positioning

A working programmer's own site that doubles as proof of craft: hand-built static site (Eleventy, CI/CD, Firebase) by the same person offering to build sites for others.

## Capabilities and Constraints

- Static Eleventy site deployed to GitHub Pages; bilingual (Czech default, English `-en` pages).
- Pages: Home, CV, Semester (Firebase auth + Firestore), Job Pay calculator, Uses, Privacy, 404.
- Content lives in `src/_data/copy/*.js`; layouts in `src/_includes`; one stylesheet `src/assets/style.css`.
- `npm run check` (prettier, stylelint, html-validate) must pass; every change is pushed to main automatically.
- Self-hosted fonts only; no third-party trackers.

## Brand Commitments

- Name/handle: Tomáš Zvoníček, "Zvondis". Greeting voice is casual ("Heya! Zvondis here!").
- Contact: phone +420 728 517 872 (primary for web clients), zvondatom@gmail.com, GitHub Zv0ndis.
- User explicitly released all incumbent visuals (fonts, logo, motion) for the redesign.

## Evidence on Hand

- Public GitHub repos listed in the CV projects section (`src/_data/copy/cv.js`).
- No testimonials, client list, or pricing exist — never fabricate them.

## Product Principles

- Contact must be one tap away for both employers and web clients.
- The site itself is the portfolio piece; it must be fast, valid and accessible.
- Tools stay usable first; expression never gets in the way of the calculator or semester tracker.
- Both languages stay in parity.

## Accessibility & Inclusion

Respect `prefers-reduced-motion`; keep text contrast at WCAG AA.
