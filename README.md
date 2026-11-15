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
      cv.js            # obsah CV pro CS i EN (i kontakty a projekty pro Domů)
      home.js          # texty domovské stránky
      jobpay.js        # texty kalkulačky výplaty
      semester.js      # texty stránky Semestr
      uses.js          # obsah stránky Vybavení
  _includes/
    layouts/base.njk   # HTML skeleton (head, meta, OG, hreflang, <site-nav>)
    partials/
      home.njk         # domovská stránka (čte copy.home + copy.cv)
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
firestore.rules        # Firebase pravidla (nasazuje se ručně)
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

- **Vzhled**: minimalistická švýcarská sazba, popis v `DESIGN.md`. Mřížka o 12
  sloupcích, navigace ve sloupcích 1-3, obsah od sloupce 4, sekce oddělené tenkou
  linkou. Tokeny v `src/assets/style.css`: papír `#FAFAF9`, inkoust `#0C0C0D`,
  šedá `#595C62` a jediný akcent `#1637E0` (jen „za rozumnou cenu“ a tlačítko
  Zavolat).
- **Fonty** (self-hosted, OFL): Archivo (variabilní, latin + latin-ext) na všechno,
  kontrast jen vahou 800 proti 300.
- Prettier + html-validate běží v CI; výstupní HTML formátuje build.
- `.njk` soubory prettier ignoruje (`.prettierignore`).

## Firebase (stránka Semestr)

Projekt `semester-a8421`. Klientská konfigurace je veřejná – data chrání jen
`firestore.rules`. Deploy pravidel:

```bash
npx firebase-tools deploy --only firestore:rules
```
