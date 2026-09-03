# zv0ndis.github.io

Osobní stránka Tomáše Zvoníčka. Statický web generovaný **Eleventy**, nasazovaný
na GitHub Pages přes GitHub Actions (`.github/workflows/deploy.yml`).

Živě: <https://zv0ndis.github.io>

## Vývoj

```bash
npm install
npm run serve     # Eleventy dev server na http://localhost:8080 (live reload)
npm run build     # jednorázový build do _site/
npm run check     # build + prettier + html-validate
```

`http://localhost:8080` musí být v Authorized domains ve Firebase konzoli,
jinak nefunguje přihlášení na stránce Semestr.

## Struktura

```
src/
  _data/
    site.js            # base URL, seznam stránek (jazyk → URL + label)
    copy/
      cv.js            # obsah CV pro CS i EN
      jobpay.js        # texty kalkulačky výplaty
      semester.js      # texty stránky Semestr
      uses.js          # obsah stránky Vybavení
  _includes/
    layouts/base.njk   # HTML skeleton (head, meta, OG, hreflang, <site-nav>)
    partials/
      cv.njk           # rozložení CV (čte copy.cv)
      job-pay.njk
      uses.njk         # čte copy.uses
      semester.njk
  cs/                  # české stránky (permalink: <slug>.html)
  en/                  # anglické stránky (permalink: <slug>-en.html)
  assets/              # style.css, nav.js, logo.svg, *.js → _site/assets/
  static/              # robots.txt, google verifikace → _site/ (root)
  .well-known/         # discord verifikace
  sitemap.njk          # generuje sitemap.xml ze site.pages
  404.njk
eleventy.config.js     # + transform: prettier na výstupní HTML
firestore.rules        # Firebase pravidla (nasazuje se ručně, viz docs/PROBLEM.md)
docs/                  # PLAN.md, PROBLEM.md
```

URL zůstávají stejné jako dřív (`cv.html`, `cv-en.html`, `semester.html`, …).
Assety jsou pod `/assets/`.

## Přidání stránky

1. `src/cs/<name>.njk` + `src/en/<name>.njk` s front matter
   (`page_key`, `title`, `description`).
2. Přidat záznam do `pages` v `src/_data/site.js` (klíč = `page_key`) a do
   `PAGES` v `src/assets/nav.js`.
3. Delší obsah dej do `src/_data/copy/` a renderuj přes
   `_includes/partials/<name>.njk`.
4. Sitemap i navigace se doplní automaticky.

## Konvence

- **Barvy** ("Neon Dusk", tokeny v `src/assets/style.css`): pozadí `#14111B`,
  text `#F6F3FA`, růžová `#FF5FA8` + azurová `#5CD0FF` jako signál, fialová
  `#6B3CFF` pro výplně, odkazy `#9D80FF`.
- **Fonty**: Space Grotesk (text) + IBM Plex Mono (technické popisky, kód, formuláře),
  obojí self-hosted. Split přes tokeny `--sans` / `--mono`.
- Prettier + html-validate běží v CI; výstupní HTML formátuje build.
- `.njk` soubory prettier ignoruje (`.prettierignore`).

## Firebase (stránka Semestr)

Projekt `semester-a8421`. Klientská konfigurace je veřejná – data chrání jen
`firestore.rules`. Deploy pravidel:

```bash
npx firebase-tools deploy --only firestore:rules
```

Kroky vyžadující konzoli viz [`docs/PROBLEM.md`](docs/PROBLEM.md).

## Plán rozvoje

[`docs/PLAN.md`](docs/PLAN.md) · [`docs/PROBLEM.md`](docs/PROBLEM.md)
