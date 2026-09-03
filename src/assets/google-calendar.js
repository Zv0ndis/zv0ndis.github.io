/**
 * Google Calendar sync for the Semester page.
 *
 * Language-agnostic: the caller passes its own strings and Firestore helpers,
 * so cs/en share this one file.
 *
 * Auth is the browser-side Google Identity Services token flow — the site is
 * static, so there is no backend to hold a refresh token. The access token
 * lives in memory only and expires after about an hour; the admin reconnects
 * when it does. It is deliberately never persisted.
 *
 * Linking model: an event that exists in Google Calendar is stored in Firestore
 * under the document id "g_<googleEventId>". That keeps the stored fields at
 * { date, title }, so firestore.rules needs no change, and it makes the link
 * between the two systems the document id itself — no extra field to keep
 * consistent, and no way to end up with duplicates.
 */

const GIS_SRC = "https://accounts.google.com/gsi/client";
const API = "https://www.googleapis.com/calendar/v3";
const SCOPE = "https://www.googleapis.com/auth/calendar";
const DOC_PREFIX = "g_";
const CALENDAR_KEY = "semester-google-calendar-id";

export const googleDocId = (googleEventId) => DOC_PREFIX + googleEventId;
export const isGoogleDoc = (docId) => docId.startsWith(DOC_PREFIX);
export const googleEventIdOf = (docId) => docId.slice(DOC_PREFIX.length);

let gisReady = null;

function loadGis() {
    if (gisReady) return gisReady;
    gisReady = new Promise((resolve, reject) => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
            resolve();
            return;
        }
        const el = document.createElement("script");
        el.src = GIS_SRC;
        el.async = true;
        el.onload = () => resolve();
        el.onerror = () => reject(new Error("Google Identity Services failed to load"));
        document.head.appendChild(el);
    });
    return gisReady;
}

/**
 * Creates the sync controller. Nothing is requested until connect() is called,
 * so visitors never load Google's script and never see any of this.
 */
export function createCalendarSync({ clientId, strings, firestore, getRange, onState }) {
    let token = null;
    let tokenClient = null;
    let calendars = [];
    let calendarId = null;

    try {
        calendarId = window.localStorage.getItem(CALENDAR_KEY);
    } catch (err) {
        /* storage blocked; fall back to the default calendar */
    }

    const state = { connected: false, busy: false, message: "" };

    function publish(patch) {
        Object.assign(state, patch, {
            connected: !!token,
            calendars,
            calendarId,
        });
        onState(Object.assign({}, state));
    }

    async function call(path, options) {
        const opts = options || {};
        const res = await fetch(API + path, {
            ...opts,
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                ...(opts.headers || {}),
            },
        });
        if (res.status === 401 || res.status === 403) {
            token = null; // expired or revoked — let the UI offer reconnect
            throw new Error(strings.errorAuth);
        }
        if (!res.ok) throw new Error(strings.errorApi + " (HTTP " + res.status + ")");
        return res.status === 204 ? null : res.json();
    }

    async function connect() {
        if (!clientId) throw new Error(strings.errorNoClientId);
        await loadGis();

        token = await new Promise((resolve, reject) => {
            if (!tokenClient) {
                tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: SCOPE,
                    callback: () => {},
                });
            }
            tokenClient.callback = (response) => {
                if (response.error) {
                    reject(new Error(strings.errorAuth));
                    return;
                }
                resolve(response.access_token);
            };
            tokenClient.requestAccessToken({ prompt: "" });
        });

        const list = await call("/users/me/calendarList?minAccessRole=writer");
        calendars = (list.items || []).map((c) => ({
            id: c.id,
            name: c.summaryOverride || c.summary,
            primary: !!c.primary,
        }));
        if (!calendarId || !calendars.some((c) => c.id === calendarId)) {
            const fallback = calendars.find((c) => c.primary) || calendars[0];
            calendarId = fallback ? fallback.id : "primary";
        }
        publish({ message: "" });
    }

    function disconnect() {
        if (token && window.google && window.google.accounts) {
            window.google.accounts.oauth2.revoke(token, () => {});
        }
        token = null;
        calendars = [];
        publish({ message: "" });
    }

    function selectCalendar(id) {
        calendarId = id;
        try {
            window.localStorage.setItem(CALENDAR_KEY, id);
        } catch (err) {
            /* not worth surfacing */
        }
        publish({});
    }

    // Google gives all-day events a start.date and timed ones a start.dateTime.
    // The site only stores a day, so both collapse to YYYY-MM-DD.
    function eventDate(item) {
        const raw = (item.start && (item.start.date || item.start.dateTime)) || null;
        return raw ? raw.slice(0, 10) : null;
    }

    /**
     * Google Calendar -> Firestore. Imports everything inside the semester range
     * and drops previously imported events that are gone from Google, so a
     * deletion there propagates here. Only "g_" documents are ever touched —
     * events added directly on the site are left alone.
     */
    async function pull() {
        const range = getRange();
        if (!range || !range.startDate || !range.endDate) throw new Error(strings.errorNoRange);

        publish({ busy: true, message: strings.syncing });
        try {
            const params = new URLSearchParams({
                timeMin: range.startDate + "T00:00:00Z",
                timeMax: range.endDate + "T23:59:59Z",
                singleEvents: "true",
                orderBy: "startTime",
                maxResults: "2500",
            });
            const data = await call(
                "/calendars/" + encodeURIComponent(calendarId) + "/events?" + params.toString(),
            );

            const fromGoogle = new Map();
            for (const item of data.items || []) {
                if (item.status === "cancelled") continue;
                const date = eventDate(item);
                const title = (item.summary || "").trim();
                if (!date || !title) continue; // the site requires both
                fromGoogle.set(item.id, { date, title: title.slice(0, 80) });
            }

            let imported = 0;
            for (const [googleId, fields] of fromGoogle) {
                const docId = googleDocId(googleId);
                const existing = firestore.findEvent(docId);
                if (!existing || existing.date !== fields.date || existing.title !== fields.title) {
                    await firestore.upsertEvent(docId, fields);
                    imported += 1;
                }
            }

            let removed = 0;
            for (const ev of firestore.listEvents()) {
                if (!isGoogleDoc(ev.id)) continue;
                if (fromGoogle.has(googleEventIdOf(ev.id))) continue;
                await firestore.deleteEvent(ev.id);
                removed += 1;
            }

            publish({ busy: false, message: strings.synced(imported, removed) });
            return { imported, removed };
        } catch (err) {
            publish({ busy: false, message: err.message });
            throw err;
        }
    }

    /**
     * Site -> Google Calendar. Creates the event in Google first, then stores it
     * under the id Google returned, so the two are linked from the start and a
     * later pull recognises it instead of importing a duplicate.
     */
    async function pushEvent(fields) {
        const created = await call("/calendars/" + encodeURIComponent(calendarId) + "/events", {
            method: "POST",
            body: JSON.stringify({
                summary: fields.title,
                start: { date: fields.date },
                end: { date: fields.date },
            }),
        });
        await firestore.upsertEvent(googleDocId(created.id), fields);
        return created.id;
    }

    /**
     * Deleting a synced event on the site removes it from Google too — otherwise
     * the next pull would bring it straight back.
     */
    async function deleteEvent(googleEventId) {
        await call(
            "/calendars/" +
                encodeURIComponent(calendarId) +
                "/events/" +
                encodeURIComponent(googleEventId),
            { method: "DELETE" },
        );
    }

    return {
        connect,
        disconnect,
        selectCalendar,
        pull,
        pushEvent,
        deleteEvent,
        isConnected: () => !!token,
        getCalendarId: () => calendarId,
        refresh: () => publish({}),
    };
}
