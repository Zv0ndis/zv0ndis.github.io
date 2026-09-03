import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { createCalendarSync, isGoogleDoc, googleEventIdOf } from "./google-calendar.js";

const firebaseConfig = {
    apiKey: "AIzaSyCWv9Md-whrotc61qSR8ccgQZFAPFBJkR8",
    authDomain: "semester-a8421.firebaseapp.com",
    projectId: "semester-a8421",
    storageBucket: "semester-a8421.firebasestorage.app",
    messagingSenderId: "388679329463",
    appId: "1:388679329463:web:9ebdc19bf1d896676e0f32",
};

const ADMIN_EMAIL = "zvondatom@gmail.com";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const semesterDocRef = doc(db, "semester", "config");
const eventsColRef = collection(db, "events");

let semesterRange = null;
let events = [];
let viewDate = new Date();
viewDate.setDate(1);

const EN_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const EN_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const loginToggle = document.getElementById("loginToggle");
const logoutButton = document.getElementById("logoutButton");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const adminOnlyEls = document.querySelectorAll(".admin-only");

const semesterRangeText = document.getElementById("semesterRangeText");
const examWinterText = document.getElementById("examWinterText");
const examSummerText = document.getElementById("examSummerText");
const semesterRangeForm = document.getElementById("semesterRangeForm");
const semesterStartInput = document.getElementById("semesterStart");
const semesterEndInput = document.getElementById("semesterEnd");
const examWinterStartInput = document.getElementById("examWinterStart");
const examWinterEndInput = document.getElementById("examWinterEnd");
const examSummerStartInput = document.getElementById("examSummerStart");
const examSummerEndInput = document.getElementById("examSummerEnd");

const semesterProgressSection = document.getElementById("semesterProgress");
const progressHeadline = document.getElementById("progressHeadline");
const progressCaption = document.getElementById("progressCaption");
const progressFill = document.getElementById("progressFill");

const calendarGrid = document.getElementById("calendarGrid");
const calMonthLabel = document.getElementById("calMonthLabel");
const calPrev = document.getElementById("calPrev");
const calNext = document.getElementById("calNext");

const addEventForm = document.getElementById("addEventForm");
const eventDateInput = document.getElementById("eventDate");
const eventTitleInput = document.getElementById("eventTitle");
const eventList = document.getElementById("eventList");

const SYNC_STRINGS = {
    syncing: "Syncing…",
    synced: (imported, removed) => `Done — ${imported} imported, ${removed} removed.`,
    errorAuth: "Access to Google Calendar expired or was denied.",
    errorApi: "Google Calendar returned an error.",
    errorNoRange: "Set the semester dates first.",
    errorNoClientId: "The OAuth client ID is missing.",
};

const googleSyncSection = document.getElementById("googleSync");
const googleConnectBtn = document.getElementById("googleConnect");
const googleDisconnectBtn = document.getElementById("googleDisconnect");
const googleSyncNowBtn = document.getElementById("googleSyncNow");
const googleCalendarField = document.getElementById("googleCalendarField");
const googleCalendarSelect = document.getElementById("googleCalendar");
const googleSyncControls = document.getElementById("googleSyncControls");
const googleStatus = document.getElementById("googleStatus");

let calendarSync = null;

function isAdminNow() {
    return !!auth.currentUser && auth.currentUser.email === ADMIN_EMAIL;
}

function formatDateEn(iso) {
    const [y, m, d] = iso.split("-");
    return `${EN_MONTHS[parseInt(m, 10) - 1].slice(0, 3)} ${parseInt(d, 10)}, ${y}`;
}

function toISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// Auth

loginToggle.addEventListener("click", () => {
    if (isAdminNow()) return;
    loginForm.hidden = !loginForm.hidden;
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginError.textContent = "";
    try {
        await signInWithEmailAndPassword(auth, loginEmail.value.trim(), loginPassword.value);
        loginForm.reset();
        loginForm.hidden = true;
    } catch (err) {
        loginError.textContent = "Login failed.";
    }
});

logoutButton.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
    const isAdmin = !!user && user.email === ADMIN_EMAIL;
    if (isAdmin) loginForm.hidden = true;
    logoutButton.hidden = !isAdmin;
    adminOnlyEls.forEach((el) => {
        el.hidden = !isAdmin;
    });
    renderEventList();
});

// Semester range

function renderSemesterRange() {
    if (semesterRange && semesterRange.startDate && semesterRange.endDate) {
        semesterRangeText.textContent = `${formatDateEn(semesterRange.startDate)} – ${formatDateEn(semesterRange.endDate)}`;
        semesterStartInput.value = semesterRange.startDate;
        semesterEndInput.value = semesterRange.endDate;
    } else {
        semesterRangeText.textContent = "Dates have not been set yet.";
    }

    if (semesterRange && semesterRange.examWinterStart && semesterRange.examWinterEnd) {
        examWinterText.textContent = `Winter exam period: ${formatDateEn(semesterRange.examWinterStart)} – ${formatDateEn(semesterRange.examWinterEnd)}`;
        examWinterStartInput.value = semesterRange.examWinterStart;
        examWinterEndInput.value = semesterRange.examWinterEnd;
    } else {
        examWinterText.textContent = "Winter exam period: not set yet.";
    }

    if (semesterRange && semesterRange.examSummerStart && semesterRange.examSummerEnd) {
        examSummerText.textContent = `Summer exam period: ${formatDateEn(semesterRange.examSummerStart)} – ${formatDateEn(semesterRange.examSummerEnd)}`;
        examSummerStartInput.value = semesterRange.examSummerStart;
        examSummerEndInput.value = semesterRange.examSummerEnd;
    } else {
        examSummerText.textContent = "Summer exam period: not set yet.";
    }
}

function enDays(n) {
    return Math.abs(n) === 1 ? "day" : "days";
}

function renderSemesterProgress() {
    if (!semesterRange || !semesterRange.startDate || !semesterRange.endDate) {
        semesterProgressSection.hidden = true;
        return;
    }
    semesterProgressSection.hidden = false;

    const start = new Date(`${semesterRange.startDate}T00:00:00`);
    const end = new Date(`${semesterRange.endDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round((end - start) / msPerDay) + 1;
    const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));

    if (today < start) {
        const daysUntilStart = Math.round((start - today) / msPerDay);
        progressHeadline.textContent = `Semester starts in ${daysUntilStart} ${enDays(daysUntilStart)}`;
        progressCaption.textContent = `Week 1 of ${totalWeeks}`;
        progressFill.style.width = "0%";
        return;
    }

    if (today > end) {
        progressHeadline.textContent = "Semester has ended";
        progressCaption.textContent = `Week ${totalWeeks} of ${totalWeeks} • 100%`;
        progressFill.style.width = "100%";
        return;
    }

    const elapsedDays = Math.round((today - start) / msPerDay);
    const currentWeek = Math.min(totalWeeks, Math.floor(elapsedDays / 7) + 1);
    const daysRemaining = Math.round((end - today) / msPerDay);
    const percent = Math.round(((elapsedDays + 1) / totalDays) * 100);

    const weekType =
        toISODate(today) >= semesterRange.startDate ? (currentWeek % 2 === 1 ? "odd" : "even") : "";

    progressHeadline.textContent = `Week ${currentWeek} of ${totalWeeks}. It's an ${weekType} week.`;
    progressCaption.textContent = `${daysRemaining} ${enDays(daysRemaining)} left until the end of semester • ${percent}%`;
    progressFill.style.width = `${percent}%`;
}

async function loadSemesterRange() {
    try {
        const snap = await getDoc(semesterDocRef);
        if (snap.exists()) {
            semesterRange = snap.data();
        }
    } catch (err) {
        console.error("Failed to load semester dates.", err);
    }
    renderSemesterRange();
    renderSemesterProgress();
    renderCalendar();
}

semesterRangeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const startDate = semesterStartInput.value;
    const endDate = semesterEndInput.value;
    if (!startDate || !endDate) return;
    const updated = {
        startDate,
        endDate,
        examWinterStart: examWinterStartInput.value || null,
        examWinterEnd: examWinterEndInput.value || null,
        examSummerStart: examSummerStartInput.value || null,
        examSummerEnd: examSummerEndInput.value || null,
    };
    try {
        await setDoc(semesterDocRef, updated);
        semesterRange = updated;
        renderSemesterRange();
        renderSemesterProgress();
        renderCalendar();
    } catch (err) {
        console.error("Failed to save semester dates.", err);
    }
});

// Events

function renderEventList() {
    eventList.innerHTML = "";
    if (events.length === 0) {
        const li = document.createElement("li");
        li.className = "event-empty";
        li.textContent = "No events yet.";
        eventList.appendChild(li);
        return;
    }
    events.forEach((ev) => {
        const li = document.createElement("li");
        li.className = "event-item";

        const dateSpan = document.createElement("span");
        dateSpan.className = "event-date";
        dateSpan.textContent = formatDateEn(ev.date);

        const titleSpan = document.createElement("span");
        titleSpan.className = "event-title";
        titleSpan.textContent = ev.title;

        li.appendChild(dateSpan);
        li.appendChild(titleSpan);

        if (isAdminNow()) {
            const delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.className = "event-delete";
            delBtn.setAttribute("aria-label", `Delete event ${ev.title}`);
            delBtn.textContent = "×";
            delBtn.addEventListener("click", async () => {
                try {
                    if (isGoogleDoc(ev.id) && calendarSync && calendarSync.isConnected()) {
                        await calendarSync.deleteEvent(googleEventIdOf(ev.id));
                    }
                    await deleteDoc(doc(db, "events", ev.id));
                } catch (err) {
                    console.error("Deleting the event failed.", err);
                }
            });
            li.appendChild(delBtn);
        }

        eventList.appendChild(li);
    });
}

addEventForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const date = eventDateInput.value;
    const title = eventTitleInput.value.trim();
    if (!date || !title) return;
    try {
        if (calendarSync && calendarSync.isConnected()) {
            await calendarSync.pushEvent({ date, title });
        } else {
            await addDoc(eventsColRef, { date, title });
        }
        addEventForm.reset();
    } catch (err) {
        console.error("Failed to add event.", err);
    }
});

try {
    onSnapshot(
        query(eventsColRef, orderBy("date")),
        (snapshot) => {
            events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            renderEventList();
            renderCalendar();
        },
        (err) => {
            console.error("Failed to load events.", err);
        },
    );
} catch (err) {
    console.error(err);
}

// Calendar

function renderCalendar() {
    calendarGrid.innerHTML = "";
    calMonthLabel.textContent = `${EN_MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

    EN_DAYS.forEach((label) => {
        const cell = document.createElement("div");
        cell.className = "calendar-day-label";
        cell.textContent = label;
        calendarGrid.appendChild(cell);
    });

    const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const todayISO = toISODate(new Date());
    const eventDates = new Set(events.map((ev) => ev.date));

    for (let i = 0; i < startOffset; i++) {
        const filler = document.createElement("div");
        filler.className = "calendar-cell calendar-cell-empty";
        calendarGrid.appendChild(filler);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const iso = toISODate(cellDate);
        const cell = document.createElement("div");
        cell.className = "calendar-cell";
        if (iso === todayISO) cell.classList.add("calendar-cell-today");
        if (
            semesterRange &&
            semesterRange.startDate &&
            semesterRange.endDate &&
            iso >= semesterRange.startDate &&
            iso <= semesterRange.endDate
        ) {
            cell.classList.add("calendar-cell-in-semester");
        }
        if (
            semesterRange &&
            semesterRange.examWinterStart &&
            semesterRange.examWinterEnd &&
            iso >= semesterRange.examWinterStart &&
            iso <= semesterRange.examWinterEnd
        ) {
            cell.classList.add("calendar-cell-exam");
        }
        if (
            semesterRange &&
            semesterRange.examSummerStart &&
            semesterRange.examSummerEnd &&
            iso >= semesterRange.examSummerStart &&
            iso <= semesterRange.examSummerEnd
        ) {
            cell.classList.add("calendar-cell-exam");
        }
        if (eventDates.has(iso)) cell.classList.add("calendar-cell-has-event");

        const num = document.createElement("span");
        num.className = "calendar-day-number";
        num.textContent = String(day);
        cell.appendChild(num);

        calendarGrid.appendChild(cell);
    }
}

calPrev.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
});

calNext.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();
loadSemesterRange();

// Google Calendar sync — admin only, and nothing is requested until the admin
// actually presses Connect, so visitors never load Google's script.

function renderSyncState(state) {
    googleConnectBtn.hidden = state.connected;
    googleDisconnectBtn.hidden = !state.connected;
    googleSyncNowBtn.hidden = !state.connected;
    googleCalendarField.hidden = !state.connected;
    googleSyncNowBtn.disabled = !!state.busy;
    googleStatus.textContent = state.message || "";

    if (state.connected && state.calendars) {
        googleCalendarSelect.innerHTML = "";
        state.calendars.forEach((cal) => {
            const option = document.createElement("option");
            option.value = cal.id;
            option.textContent = cal.name;
            option.selected = cal.id === state.calendarId;
            googleCalendarSelect.appendChild(option);
        });
    }
}

async function runSync(action) {
    try {
        await action();
    } catch (err) {
        googleStatus.textContent = err.message;
        console.error(err);
    }
}

function initCalendarSync() {
    if (!googleSyncSection) return;
    const clientId = googleSyncSection.dataset.clientId || "";
    if (!clientId) {
        // The status paragraph already explains why; just hide the dead controls.
        googleSyncControls.hidden = true;
        return;
    }

    calendarSync = createCalendarSync({
        clientId,
        strings: SYNC_STRINGS,
        getRange: () => semesterRange,
        firestore: {
            listEvents: () => events,
            findEvent: (id) => events.find((ev) => ev.id === id) || null,
            upsertEvent: (id, fields) => setDoc(doc(db, "events", id), fields),
            deleteEvent: (id) => deleteDoc(doc(db, "events", id)),
        },
        onState: renderSyncState,
    });

    googleConnectBtn.addEventListener("click", () =>
        runSync(async () => {
            await calendarSync.connect();
            await calendarSync.pull();
        }),
    );
    googleDisconnectBtn.addEventListener("click", () => calendarSync.disconnect());
    googleSyncNowBtn.addEventListener("click", () => runSync(() => calendarSync.pull()));
    googleCalendarSelect.addEventListener("change", () =>
        runSync(async () => {
            calendarSync.selectCalendar(googleCalendarSelect.value);
            await calendarSync.pull();
        }),
    );

    calendarSync.refresh();
}

initCalendarSync();
