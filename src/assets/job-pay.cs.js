const NIGHT_WEEKEND_BONUS = 0.1;
const TAX_RATE = 0.15;
const THRESHOLDS = {
    dpp: { limit: 12000, label: "DPP" },
    dpc: { limit: 4500, label: "DPČ" },
};

const payForm = document.getElementById("payForm");
const hourlyRateInput = document.getElementById("hourlyRate");
const regularHoursInput = document.getElementById("regularHours");
const nightHoursInput = document.getElementById("nightHours");

const resRegularPay = document.getElementById("resRegularPay");
const resNightPay = document.getElementById("resNightPay");
const resGrossTotal = document.getElementById("resGrossTotal");
const resThresholdText = document.getElementById("resThresholdText");
const resTaxRow = document.getElementById("resTaxRow");
const resTaxLabel = document.getElementById("resTaxLabel");
const resTax = document.getElementById("resTax");
const resNetTotal = document.getElementById("resNetTotal");

function formatKc(amount) {
    return `${Math.round(amount).toLocaleString("cs-CZ")} Kč`;
}

function getContractType() {
    return payForm.querySelector('input[name="contractType"]:checked').value;
}

function calculate() {
    const rate = parseFloat(hourlyRateInput.value) || 0;
    const regularHours = parseFloat(regularHoursInput.value) || 0;
    const nightHours = parseFloat(nightHoursInput.value) || 0;

    const regularPay = rate * regularHours;
    const nightPay = rate * (NIGHT_WEEKEND_BONUS) * nightHours;
    const grossTotal = regularPay + nightPay;

    const contractType = getContractType();
    const { limit, label } = THRESHOLDS[contractType];
    const overLimit = grossTotal >= limit;

    const tax = grossTotal * TAX_RATE;
    const netTotal = grossTotal - tax;

    resRegularPay.textContent = formatKc(regularPay);
    resNightPay.textContent = formatKc(nightPay);
    resGrossTotal.textContent = formatKc(grossTotal);

    if (overLimit) {
        resThresholdText.textContent = `Hrubá odměna dosáhla limitu ${formatKc(limit)} pro ${label}.`;
        resThresholdText.classList.add("pay-threshold-over");
    } else {
        resThresholdText.textContent = `Hrubá odměna je pod limitem ${formatKc(limit)} pro ${label}.`;
        resThresholdText.classList.remove("pay-threshold-over");
    }

    resTaxRow.hidden = !overLimit;
    resTaxLabel.textContent = `Daň z příjmu (${Math.round(TAX_RATE * 100)} %)`;
    resTax.textContent = formatKc(tax);
    resNetTotal.textContent = formatKc(overLimit ? netTotal : grossTotal);
}

payForm.addEventListener("input", calculate);
payForm.addEventListener("change", calculate);
calculate();
