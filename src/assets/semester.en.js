import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
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

let semesterRange = null;
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
});

// Semester range

function renderSemesterRange() {
    if (semesterRange && semesterRange.startDate && semesterRange.endDate) {
        semesterRangeText.textContent = `${formatDateEn(semesterRange.startDate)} - ${formatDateEn(semesterRange.endDate)}`;
        semesterStartInput.value = semesterRange.startDate;
        semesterEndInput.value = semesterRange.endDate;
    } else {
        semesterRangeText.textContent = "Dates have not been set yet.";
    }

    if (semesterRange && semesterRange.examWinterStart && semesterRange.examWinterEnd) {
        examWinterText.textContent = `Winter exam period: ${formatDateEn(semesterRange.examWinterStart)} - ${formatDateEn(semesterRange.examWinterEnd)}`;
        examWinterStartInput.value = semesterRange.examWinterStart;
        examWinterEndInput.value = semesterRange.examWinterEnd;
    } else {
        examWinterText.textContent = "Winter exam period: not set yet.";
    }

    if (semesterRange && semesterRange.examSummerStart && semesterRange.examSummerEnd) {
        examSummerText.textContent = `Summer exam period: ${formatDateEn(semesterRange.examSummerStart)} - ${formatDateEn(semesterRange.examSummerEnd)}`;
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
    // getDoc can hang on a stalled connection instead of rejecting, so cap it:
    // an endless "Načítání…" / "Loading…" is worse than an error message.
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 10000),
    );
    const snap = await Promise.race([getDoc(semesterDocRef), timeout]);
    if (snap.exists()) {
        semesterRange = snap.data();
    }
    renderSemesterRange();
    renderSemesterProgress();
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
    } catch (err) {
        console.error("Failed to save semester dates.", err);
    }
});

// Initial read on load. Surface a failure instead of leaving "Načítání…".
loadSemesterRange().catch((err) => {
    console.error("loadSemesterRange failed", err);
    semesterRangeText.textContent =
        err && err.message === "timeout"
            ? "This is taking a while. Check your connection."
            : "Could not load the dates. Try reloading.";
});
