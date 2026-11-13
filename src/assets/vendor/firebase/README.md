# Firebase JS SDK 10.13.2 (vendored)

Self-hosted so the site's CSP can keep `script-src 'self'`.

Source: `https://www.gstatic.com/firebasejs/10.13.2/firebase-{app,firestore,auth}.js`

One change from upstream: `firebase-auth.js` and `firebase-firestore.js` import
`./firebase-app.js` instead of the absolute gstatic URL.

SHA-256 of the unmodified downloads:

    7689323827fc416edc653dd06f6bd93314312ff5f71b1077a936e6803d7578d6  firebase-app.js
    09211458a3bd82b48e2f58f95c90008c9db715302c408c774118b934b4fa830e  firebase-auth.js
    2580c9eb81fb16d93418894e89fbabf4ae7a216775d4dafdaf7c32190dadf8c2  firebase-firestore.js

To upgrade: download the three files for the new version, reapply the import
change, and update this note.
