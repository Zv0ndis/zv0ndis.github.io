# Plán vývoje osobní stránky

Web: **Eleventy** SSG → `_site/` → GitHub Pages přes Actions.
Zdroj v `src/`, obsah v `src/_data/`, URL zůstávají stejné (`cv.html`, …).

**Další krok pro tebe:** přepnout Settings → Pages → Source na „GitHub Actions"
(viz `PROBLEM.md` #2).

---

## Fáze 0 – Základ a workflow

- [x] Vyplnit `README.md` / založit `CLAUDE.md`: struktura repa, konvence (barvy, názvy
      souborů, jak přidat stránku).
- [x] Lokální náhled: `.claude/launch.json` (`npx serve`, Python na stroji není) + `serve.json`.
- [x] `.gitignore` + `.gitattributes` (LF), `.idea/` odverzováno.
- [x] `.editorconfig`.
- [ ] Ujasnit cíl webu: rozcestník + CV + osobní nástroje (semestr, výplata). → `PROBLEM.md` #1

## Fáze 1 – Odstranění duplicity — HOTOVO

- [x] **Eleventy SSG.** `src/` + `_includes/base.njk` (sdílený `<head>` + nav + meta),
      per-jazyk stránky v `src/cs/` a `src/en/`, build do `_site/`.
- [x] Nav jako `<site-nav>` web component (`src/assets/nav.js`), klávesová obsluha.
- [x] Společná `<head>` (fonty, favicon, meta, OG, hreflang) v `base.njk`.
- [x] URL zachovány 1:1; `sitemap.xml` + nav se generují ze `src/_data/site.js`.

## Fáze 2 – Obsah a i18n

- [x] `hreflang` cs/en/x-default mezi mutacemi + v `sitemap.xml`.
- [x] **CV jako data** (`src/_data/cv.js`) – jeden zdroj pro CS i EN, žádná dvojitá údržba.
      Stejně `jobpay.js`, `semesterui.js`.
- [ ] Přepínač jazyka si pamatuje volbu (`localStorage`) na landing page.
- [ ] Zbytek obsahu (privacy, hero texty) je pořád přímo v `.njk` – OK, malé.

## Fáze 3 – Kvalita: přístupnost, SEO, výkon

### Přístupnost

- [x] Zrušen `text-align: justify` (na monospace špatně čitelné).
- [x] Menu: klávesová obsluha (šipky, Home/End, Esc, Tab zavírá), fokus na 1. položku, `aria-current`.
- [x] `prefers-reduced-motion` blok v `style.css`.
- [ ] ~~Kontrast `#888`~~ – přeměřeno: `#888` na `#070707` je 5,7:1, projde AA. Netřeba měnit.

### SEO / sdílení

- [x] `<meta name="description">`, Open Graph + Twitter card, canonical – všechny stránky.
- [x] `robots.txt`, `sitemap.xml`.
- [x] `404.html`.

### Výkon

- [x] `<meta name="color-scheme" content="dark">`.
- [ ] Self-host Fira Code (`woff2`) → `PROBLEM.md` #4 (binárky do repa – potřebuje OK).

## Fáze 4 – Bezpečnost (Firebase)

- [x] Napsaná `firestore.rules` (+ `firebase.json`, `.firebaserc`): read public,
      write jen `zvondatom@gmail.com`, validace tvaru události.
- [ ] Nasadit a otestovat pravidla → `PROBLEM.md` #2 (potřebuje konzoli).
- [ ] App Check (reCAPTCHA v3) → `PROBLEM.md` #2.
- [ ] Authorized domains → `PROBLEM.md` #2.
- [x] `.well-known/discord` (ověření domény pro Discord) a `googled739115adb3a3eae.html`
      (Google Search Console) – legitimní, necháváme.
- [x] `measurementId` odstraněn z `firebaseConfig` (GA se nenačítalo) → web nesbírá
      analytiku, cookie banner netřeba.

## Fáze 5 – Automatizace

- [x] GitHub Actions `checks.yml`: `npm ci` → `prettier --check` → `build` →
      `html-validate` (na `_site/`) → `linkinator`.
- [x] GitHub Actions `deploy.yml`: build + `deploy-pages`. **Vyžaduje přepnutí
      Pages source → GitHub Actions** (`PROBLEM.md` #2).
- [x] `.htmlvalidate.json` (`html-validate:prettier` preset), `.prettierrc.json`,
      `.prettierignore`. Výstupní HTML formátuje Eleventy transform.
- [ ] Lighthouse CI – hlídá regrese v a11y/perf/SEO.
- [ ] `stylelint` na `style.css`.

---

## Bug k opravě hned — HOTOVO

~~`semester.html` má **dvakrát** `id="semesterProgress"`~~ – opraveno. Odstraněna
zastíněná vnořená sekce, ponechána samostatná „Průběh semestru"; CS i EN sjednoceny.
Ověřeno v prohlížeči (sekce se teď správně zobrazuje).

---

## Backlog nápadů (po dokončení základu)

- [ ] `/projects` stránka (ESP32, 3D tisk, KIS pro studentský klub) + fotky.
- [ ] `now` stránka (co zrovna dělám).
- [ ] Blog / poznámky (markdown → statické stránky).
- [ ] Kalendář semestru: zvýraznění lichý/sudý týden, export do `.ics`.
- [ ] Kalkulačka výplaty: historie směn v `localStorage`, měsíční souhrn.
- [ ] RSS pro blog.
- [ ] Vlastní doména.
