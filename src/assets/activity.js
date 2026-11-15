/**
 * Live Discord status and Spotify player in the rail, pushed over Lanyard's
 * websocket. Stays hidden until the first presence arrives.
 */
(function () {
    "use strict";

    var USER = "229319556215078913";
    var el = document.querySelector("[data-activity]");
    if (!el) return;

    var LABELS =
        document.documentElement.lang === "cs"
            ? { online: "Online", idle: "Pryč", dnd: "Nerušit", offline: "Offline" }
            : { online: "Online", idle: "Away", dnd: "Do not disturb", offline: "Offline" };

    var player = el.querySelector("[data-player]");
    var cover = el.querySelector("[data-player-cover]");
    var song = el.querySelector("[data-player-song]");
    var artist = el.querySelector("[data-player-artist]");
    var progress = el.querySelector("[data-player-progress]");
    var track = null;

    function render(d) {
        var status = LABELS[d.discord_status] ? d.discord_status : "offline";
        el.querySelector("[data-activity-status]").textContent = LABELS[status];

        track = (d.listening_to_spotify && d.spotify) || null;
        player.hidden = !track;
        if (track) {
            // Lanyard data is untrusted: text via textContent, URLs only to known hosts.
            song.textContent = track.song;
            player.title = track.song + " - " + track.artist.replace(/;/g, ",");
            player.href = "https://open.spotify.com/track/" + encodeURIComponent(track.track_id);
            artist.textContent = track.artist.replace(/;/g, ",");
            var art = track.album_art_url || "";
            cover.src = art.indexOf("https://i.scdn.co/") === 0 ? art : "data:,";
            tick();
        }
        el.hidden = false;
    }

    function tick() {
        if (!track || !track.timestamps) return;
        var t = track.timestamps;
        var p = (Date.now() - t.start) / (t.end - t.start);
        progress.style.width = Math.min(Math.max(p, 0), 1) * 100 + "%";
    }

    var retry = 1000;
    function connect() {
        var ws = new WebSocket("wss://api.lanyard.rest/socket");
        var beat;
        ws.onmessage = function (e) {
            var msg = JSON.parse(e.data);
            if (msg.op === 1) {
                // Hello: subscribe, then keep the connection alive at the server's interval.
                ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: USER } }));
                beat = setInterval(function () {
                    ws.send(JSON.stringify({ op: 3 }));
                }, msg.d.heartbeat_interval);
            } else if (msg.op === 0 && msg.d) {
                retry = 1000;
                render(msg.d);
            }
        };
        ws.onclose = function () {
            clearInterval(beat);
            setTimeout(connect, retry);
            retry = Math.min(retry * 2, 60000);
        };
    }

    connect();
    setInterval(tick, 1000);
})();
