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
        li.append(title, detail);
        return li;
    };

    fetch("/skola.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then(({ events = [] }) => {
            const now = Date.now();
            const upcoming = events.filter(
                (e) => new Date(e.allDay ? `${e.end}T00:00:00Z` : e.end) > now,
            );
            list.replaceChildren(...upcoming.map(row));
            status.textContent = upcoming.length ? "" : section.dataset.empty;
            status.hidden = upcoming.length > 0;
        })
        .catch(() => {
            status.textContent = section.dataset.error;
        });
})();
