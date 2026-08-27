# zv0ndis.github.io

Osobní stránka Tomáše Zvoníčka. Statický web generovaný **Eleventy**, nasazovaný
na GitHub Pages přes GitHub Actions (`.github/workflows/deploy.yml`).

Živě: <https://zv0ndis.github.io>

## ⚠️ Přepnutí nasazení (jednorázově)

Repo se přesunulo z „deploy přímo z větve" na build přes Actions.
V **Settings → Pages → Build and deployment → Source** přepni na
**GitHub Actions**. Bez toho se po pushnutí web rozbije (v rootu už nejsou `.html`).

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
    site.js         # base URL, seznam stránek (jazyk → URL + label)
    cv.js           # obsah CV pro CS i EN
    jobpay.js        # texty kalkulačky výplaty
    semesterui.js   # texty stránky Semestr
  _includes/
    base.njk        # HTML skeleton (head, meta, OG, hreflang, <site-nav>)
    cv-body.njk     # rozložení CV (čte cv.js)
    job-pay-body.njk
    semester-body.njk
  cs/               # české stránky (permalink: <slug>.html)
  en/               # anglické stránky (permalink: <slug>-en.html)
  assets/           # style.css, nav.js, logo.svg, *.js → kopíruje se do rootu
  root/             # robots.txt, .nojekyll, google verifikace → root
  .well-known/      # discord verifikace
  sitemap.njk       # generuje sitemap.xml ze site.pages
  404.njk
eleventy.config.js  # + transform: prettier na výstupní HTML
firestore.rules     # Firebase pravidla (nasazuje se ručně, viz PROBLEM.md)
```

URL zůstávají stejné jako dřív (`cv.html`, `cv-en.html`, `semester.html`, …).

## Přidání stránky

1. `src/cs/<name>.njk` + `src/en/<name>.njk` s front matter
   (`page_key`, `title`, `description`).
2. Přidat záznam do `pages` v `src/_data/site.js` (klíč = `page_key`).
3. Delší obsah dej do `src/_data/` a renderuj přes `_includes/<name>-body.njk`.
4. Sitemap i navigace se doplní automaticky.

## Konvence

- **Barvy** (v `src/assets/style.css`): pozadí `#070707`, text `#fff`,
  akcenty růžová `#ff5e87`, modrá `#91e4ff`, zelená `#5eff86`, odkazy `#4a9eff`.
- **Font**: Fira Code (Google Fonts).
- Prettier + html-validate běží v CI; výstupní HTML formátuje build.
- `.njk` soubory prettier ignoruje (`.prettierignore`).

## Firebase (stránka Semestr)

Projekt `semester-a8421`. Klientská konfigurace je veřejná – data chrání jen
`firestore.rules`. Deploy pravidel:

```bash
npx firebase-tools deploy --only firestore:rules
```

Kroky vyžadující konzoli viz [`PROBLEM.md`](PROBLEM.md).

## Plán rozvoje

[`PLAN.md`](PLAN.md) · [`PROBLEM.md`](PROBLEM.md)
