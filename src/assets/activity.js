/**
 * Live Discord status and Spotify track in the rail, via the public Lanyard API.
 * Stays hidden if Lanyard is unreachable.
 */
(function () {
    "use strict";

    var USER = "229319556215078913";
    var el = document.querySelector("[data-activity]");
    if (!el) return;

    var cs = document.documentElement.lang === "cs";
    var LABELS = cs
        ? {
              online: "Online",
              idle: "Pryč",
              dnd: "Nerušit",
              offline: "Offline",
              music: "Poslouchám",
          }
        : {
              online: "Online",
              idle: "Away",
              dnd: "Do not disturb",
              offline: "Offline",
              music: "Listening to",
          };

    function render(d) {
        var status = LABELS[d.discord_status] ? d.discord_status : "offline";
        el.dataset.status = status;
        el.querySelector("[data-activity-status]").textContent = LABELS[status];
        var music = el.querySelector("[data-activity-music]");
        var s = d.listening_to_spotify && d.spotify;
        music.hidden = !s;
        if (s)
            music.textContent = LABELS.music + " " + s.song + " — " + s.artist.replace(/;/g, ",");
        el.hidden = false;
    }

    // shortcut: polls every 30 s instead of Lanyard's websocket; switch if near-instant updates matter.
    function poll() {
        fetch("https://api.lanyard.rest/v1/users/" + USER)
            .then(function (r) {
                return r.json();
            })
            .then(function (j) {
                if (j.success) render(j.data);
            })
            .catch(function () {
                /* keep last state */
            });
    }

    poll();
    setInterval(poll, 30000);
})();
