# PROBLEM.md

Blokery a rozhodnutí, která nemůžu udělat sám. Vyřešené položky jsou v „Hotovo".

---

## 1. Přepnout nasazení na GitHub Actions — POTŘEBUJU TEBE

Web se teď buildí Eleventy (`src/` → `_site/`). V rootu už **nejsou žádné `.html`**,
takže dosavadní režim „deploy přímo z větve" by po pushnutí ukázal prázdno.

- [ ] **Settings → Pages → Build and deployment → Source → „GitHub Actions".**
- [ ] Pak pushnout `main`. Workflow `deploy.yml` web postaví a nasadí.
- [ ] Zkontrolovat, že `https://zv0ndis.github.io/` i `/cv-en.html` atd. jedou.

Do přepnutí je bezpečné commitovat i pushovat – Pages prostě jednou selže,
dokud přepínač nepřehodíš. Nic se nesmaže.

---

## 2. Firebase konzole — NEMŮŽU udělat za tebe

Změny bezpečnostní konfigurace účtu. Soubory jsou připravené, kroky triviální:

- [ ] **Zkontrolovat současná pravidla.**
      <https://console.firebase.google.com/project/semester-a8421/firestore/rules>
      Pokud je tam `allow read, write: if true;`, může teď kdokoli přepsat data.
- [ ] **Nasadit `firestore.rules` z repa:**

  ```bash
  npx firebase-tools login
  npx firebase-tools deploy --only firestore:rules
  ```

- [ ] **Otestovat:** anonymní zápis přes REST API musí selhat (403), přihlášený
      `zvondatom@gmail.com` musí projít.
- [ ] **App Check** (reCAPTCHA v3): Firebase konzole → App Check → registrovat
      web, zapnout enforcement pro Firestore. Pak do
      `src/assets/semester.*.js` přidat `initializeAppCheck(...)`.
- [ ] **Authorized domains** (Authentication → Settings → Authorized domains):
      nechat jen `zv0ndis.github.io`, `localhost`, `semester-a8421.firebaseapp.com`.

---

## 3. Font Fira Code – self-hosting

- [ ] Stáhnout `Fira Code` (`.woff2`, váhy 400/500/700, ~150 kB) do
      `src/assets/fonts/`, `@font-face` do `style.css`, zahodit `<link>` na
      Google Fonts a `preconnect` v `base.njk`.

➡️ **Potřebuju OK**, že chceš binárky `.woff2` verzovat v repu.

---

## 4. K ověření: daňová logika kalkulačky výplaty

Prověřeno proti zdrojům pro 2026 – **dva problémy, konstanty jsem neměnil:**

**a) Limity si zdroje odporují.** DPP hranice pro pojistné/srážkovou daň se uvádí
buď **10 000**, nebo **12 000 Kč/měsíc**; DPČ **4 000** vs **4 500 Kč**. V kódu
(`src/assets/job-pay.*.js`) je natvrdo `12000` / `4500`.

**b) Logika daně je obrácená.** Kód účtuje 15 % jen **nad** limitem. Realita
(student bez podepsaného prohlášení): do limitu srážková 15 %, nad limitem
zálohová 15 % – takže 15 % skoro vždy. S podepsaným prohlášením sleva na
poplatníka (2 570 Kč/měs, 2026) daň do ~17 000 Kč srovná na nulu.

➡️ **Rozhodnutí za tebe:** předpokládat podepsané prohlášení? Ideál = přidat do
formuláře checkbox „mám podepsané prohlášení" a počítat obě větve.

Zdroje: [ČSOB](https://www.pruvodcepodnikanim.cz/clanek/jak-se-dani-dpp-a-dpc-v-roce-2026/),
[Daňový alarm](https://danovyalarm.cz/blog/dpp-dpc-2026),
[iDoklad](https://www.idoklad.cz/blog/dohody-o-praci-dpp-dpc-jejich-limity-i-vyhody).

---

## Hotovo

- **Fáze 0:** `.gitignore`, `.gitattributes` (LF), `.editorconfig`, `README.md`,
  `CLAUDE.md`, `.claude/launch.json`, `.idea/` odverzováno.
- **Fáze 1 + 2:** migrace na **Eleventy**. `src/_includes/base.njk` sdílí `<head>`,
  meta, OG, hreflang a `<site-nav>`. Stránky v `src/cs/` + `src/en/`.
  **CV, texty kalkulačky a stránky Semestr jsou v `src/_data/*.js`** – jeden
  zdroj pro obě jazykové verze. `nav.js` `<site-nav>` s klávesovou obsluhou.
  Firebase logika vytažena do `src/assets/semester.<lang>.js`. URL beze změny.
  `sitemap.xml` se generuje. Vše ověřeno v prohlížeči (CV, Semestr CS/EN
  s živým Firebase, kalkulačka, jazykový přepínač).
- **Bug:** dvojité `id="semesterProgress"` – opraveno.
- **Fáze 3:** `text-align: justify` pryč, `prefers-reduced-motion`,
  `color-scheme: dark`, meta/OG/canonical/hreflang, `robots.txt`,
  `sitemap.xml`, `404.html`. Kontrast `#888` přeměřen (5,7:1, projde AA).
- **Fáze 4:** `firestore.rules` + `firebase.json` + `.firebaserc`. `measurementId`
  odstraněn (GA se nenačítalo) → web nesbírá analytiku, cookie banner netřeba.
- **Fáze 5:** `checks.yml` (npm ci → prettier → build → html-validate → linkinator),
  `deploy.yml` (build + deploy-pages), `.htmlvalidate.json`, `.prettierrc.json`,
  `.prettierignore`. Eleventy transform formátuje výstupní HTML.
- **Pozn.:** `linkinator` neumí JS → odkazy v menu (`nav.js`) nekontroluje.
  Seznam stránek je duplicitně v `nav.js` (`PAGES`) a `src/_data/site.js`
  (`pages`) – drž je v souladu.
- **Pozn. ke commitu:** velký diff (prettier baseline + přesun do `src/`).
  Funkčně vše ověřené. Až budeš chtít commitovat, řekni – rozdělím na
  smysluplné commity.
