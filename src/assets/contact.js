/**
 * Contact page: the form posts to /api/contact (the bp-plan Worker), which redirects back here with
 * ?sent=1 or ?error=invalid|limit|send. This shows that result under the form and tidies the URL.
 */
(function () {
    "use strict";
    var out = document.querySelector("[data-contact-status]");
    var q = new URLSearchParams(location.search);
    if (!out || (!q.has("sent") && !q.has("error"))) return;
    var cs = document.documentElement.lang === "cs";
    var text = {
        sent: cs
            ? "Díky, zpráva odešla. Odpovím na váš e-mail."
            : "Thanks, your message was sent. I'll reply by email.",
        invalid: cs
            ? "Vyplňte jméno, platný e-mail a zprávu."
            : "Fill in your name, a valid email and a message.",
        limit: cs
            ? "Moc zpráv za krátkou dobu. Zkuste to za hodinu."
            : "Too many messages in a short time. Try again in an hour.",
        send: cs
            ? "Zprávu se nepodařilo odeslat. Napište prosím na contact@zvondis.dev."
            : "The message couldn't be sent. Please email contact@zvondis.dev.",
    };
    out.textContent = q.has("sent") ? text.sent : text[q.get("error")] || text.send;
    history.replaceState(null, "", location.pathname);
})();
