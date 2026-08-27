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

const CZ_MONTHS = [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec",
];
const CZ_DAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

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

function isAdminNow() {
    return !!auth.currentUser && auth.currentUser.email === ADMIN_EMAIL;
}

function formatDateCz(iso) {
    const [y, m, d] = iso.split("-");
    return `${parseInt(d, 10)}. ${parseInt(m, 10)}. ${y}`;
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
        loginError.textContent = "Přihlášení se nezdařilo.";
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
        semesterRangeText.textContent = `${formatDateCz(semesterRange.startDate)} – ${formatDateCz(semesterRange.endDate)}`;
        semesterStartInput.value = semesterRange.startDate;
        semesterEndInput.value = semesterRange.endDate;
    } else {
        semesterRangeText.textContent = "Termín zatím nebyl nastaven.";
    }

    if (semesterRange && semesterRange.examWinterStart && semesterRange.examWinterEnd) {
        examWinterText.textContent = `Zkouškové zimní: ${formatDateCz(semesterRange.examWinterStart)} – ${formatDateCz(semesterRange.examWinterEnd)}`;
        examWinterStartInput.value = semesterRange.examWinterStart;
        examWinterEndInput.value = semesterRange.examWinterEnd;
    } else {
        examWinterText.textContent = "Zkouškové zimní: zatím nenastaveno.";
    }

    if (semesterRange && semesterRange.examSummerStart && semesterRange.examSummerEnd) {
        examSummerText.textContent = `Zkouškové letní: ${formatDateCz(semesterRange.examSummerStart)} – ${formatDateCz(semesterRange.examSummerEnd)}`;
        examSummerStartInput.value = semesterRange.examSummerStart;
        examSummerEndInput.value = semesterRange.examSummerEnd;
    } else {
        examSummerText.textContent = "Zkouškové letní: zatím nenastaveno.";
    }
}

function czDny(n) {
    const abs = Math.abs(n);
    if (abs === 1) return "den";
    if (abs >= 2 && abs <= 4) return "dny";
    return "dní";
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
        progressHeadline.textContent = `Semestr začíná za ${daysUntilStart} ${czDny(daysUntilStart)}`;
        progressCaption.textContent = `1. týden z ${totalWeeks}`;
        progressFill.style.width = "0%";
        return;
    }

    if (today > end) {
        progressHeadline.textContent = "Semestr skončil";
        progressCaption.textContent = `${totalWeeks}. týden z ${totalWeeks} • 100 %`;
        progressFill.style.width = "100%";
        return;
    }

    const elapsedDays = Math.round((today - start) / msPerDay);
    const currentWeek = Math.min(totalWeeks, Math.floor(elapsedDays / 7) + 1);
    const daysRemaining = Math.round((end - today) / msPerDay);
    const percent = Math.round(((elapsedDays + 1) / totalDays) * 100);

    let weekType =
        toISODate(today) >= semesterRange.startDate
            ? currentWeek % 2 === 1
                ? "lichý"
                : "sudý"
            : "";

    progressHeadline.textContent = `${currentWeek}. týden z ${totalWeeks}. Týden je ${weekType}.`;
    progressCaption.textContent = `Zbývá ${daysRemaining} ${czDny(daysRemaining)} do konce semestru • ${percent} %`;
    progressFill.style.width = `${percent}%`;
}

async function loadSemesterRange() {
    try {
        const snap = await getDoc(semesterDocRef);
        if (snap.exists()) {
            semesterRange = snap.data();
        }
    } catch (err) {
        console.error("Nepodařilo se načíst termín semestru.", err);
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
        console.error("Uložení termínu se nezdařilo.", err);
    }
});

// Events

function renderEventList() {
    eventList.innerHTML = "";
    if (events.length === 0) {
        const li = document.createElement("li");
        li.className = "event-empty";
        li.textContent = "Zatím žádné události.";
        eventList.appendChild(li);
        return;
    }
    events.forEach((ev) => {
        const li = document.createElement("li");
        li.className = "event-item";

        const dateSpan = document.createElement("span");
        dateSpan.className = "event-date";
        dateSpan.textContent = formatDateCz(ev.date);

        const titleSpan = document.createElement("span");
        titleSpan.className = "event-title";
        titleSpan.textContent = ev.title;

        li.appendChild(dateSpan);
        li.appendChild(titleSpan);

        if (isAdminNow()) {
            const delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.className = "event-delete";
            delBtn.setAttribute("aria-label", `Smazat událost ${ev.title}`);
            delBtn.textContent = "×";
            delBtn.addEventListener("click", () => deleteDoc(doc(db, "events", ev.id)));
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
        await addDoc(eventsColRef, { date, title });
        addEventForm.reset();
    } catch (err) {
        console.error("Přidání události se nezdařilo.", err);
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
            console.error("Nepodařilo se načíst události.", err);
        },
    );
} catch (err) {
    console.error(err);
}

// Calendar

function renderCalendar() {
    calendarGrid.innerHTML = "";
    calMonthLabel.textContent = `${CZ_MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

    CZ_DAYS.forEach((label) => {
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
