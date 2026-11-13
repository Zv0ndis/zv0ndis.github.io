// Semestr page: upcoming exams and hand-in deadlines from /skola.json, which the studis-gcal job
// exports from the owner's school calendars (titles, times and rooms only) to a private data repo. The
// deploy build validates that file (scripts/validate-skola.mjs) and publishes it. Independent of Firestore.
(() => {
    const section = document.getElementById("school");
    if (!section) return;
    const list = document.getElementById("schoolList");
    const status = document.getElementById("schoolStatus");
    const lang = document.documentElement.lang === "en" ? "en" : "cs";

    const when = (iso, allDay) =>
        new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "cs-CZ", {
            timeZone: "Europe/Prague",
            weekday: "short",
            day: "numeric",
            month: "numeric",
            ...(allDay ? {} : { hour: "2-digit", minute: "2-digit" }),
        }).format(new Date(allDay ? `${iso}T12:00:00Z` : iso));

    // Time left until a deadline: "za 3 dny 4 h" / "in 3 days 4 h", hours and minutes on the last day.
    const loc = lang === "en" ? "en-GB" : "cs-CZ";
    const unit = (u, n, display = "long") =>
        new Intl.NumberFormat(loc, { style: "unit", unit: u, unitDisplay: display }).format(n);
    const left = (ms) => {
        const min = Math.max(1, Math.floor(ms / 60000));
        const d = Math.floor(min / 1440),
            h = Math.floor((min % 1440) / 60),
            m = min % 60;
        const parts = d
            ? [unit("day", d), h && unit("hour", h, "short")]
            : h
              ? [unit("hour", h, "short"), m && unit("minute", m, "short")]
              : [unit("minute", m, "short")];
        return `${lang === "en" ? "in" : "za"} ${parts.filter(Boolean).join(" ")}`;
    };
    const SOON = 2 * 24 * 3600 * 1000; // under two days: highlighted

    const row = (e) => {
        const li = document.createElement("li");
        const title = document.createElement("span");
        title.className = "row-title";
        // Deadlines stay generic ("ISA – projekt"): the registered topic is never shown, even if sent.
        const name = e.kind === "exam" ? e.title : section.dataset.project;
        title.textContent = `${e.course} – ${name}`; // text from Studis/Moodle: never as HTML
        const detail = document.createElement("span");
        detail.className = "row-detail";
        // A deadline counts at its end (23:59); an exam at its start.
        const label = e.kind === "exam" ? section.dataset.exam : section.dataset.deadline;
        const at = when(e.kind === "exam" ? e.start : e.end, e.allDay);
        detail.textContent = [label, at, e.room].filter(Boolean).join(" · ");
        if (e.kind === "deadline") {
            const remaining = document.createElement("span");
            remaining.className = "row-left";
            remaining.dataset.due = String(
                new Date(e.allDay ? `${e.end}T00:00:00Z` : e.end).getTime(),
            );
            detail.append(" · ", remaining);
        }
        li.append(title, detail);
        return li;
    };

    const tick = () => {
        const now = Date.now();
        for (const el of list.querySelectorAll(".row-left")) {
            const ms = Number(el.dataset.due) - now;
            el.textContent = ms > 0 ? left(ms) : "";
            el.classList.toggle("is-soon", ms > 0 && ms < SOON);
        }
    };

    fetch("/skola.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then(({ events = [] }) => {
            const now = Date.now();
            const upcoming = events.filter(
                (e) => new Date(e.allDay ? `${e.end}T00:00:00Z` : e.end) > now,
            );
            list.replaceChildren(...upcoming.map(row));
            tick();
            setInterval(tick, 60 * 1000);
            status.textContent = upcoming.length ? "" : section.dataset.empty;
            status.hidden = upcoming.length > 0;
        })
        .catch(() => {
            status.textContent = section.dataset.error;
        });
})();
