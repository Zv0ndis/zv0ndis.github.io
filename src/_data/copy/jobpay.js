// Static strings for the pay calculator. The computed logic lives in
// src/assets/job-pay.<lang>.js (thresholds, tax rate, threshold/label text).

export default {
    cs: {
        h1: "Výplata",
        subtitle: "Kalkulačka výplaty z brigády (DPP / DPČ)",
        formHeading: "Zadání",
        contractAria: "Typ dohody",
        hourlyRate: "Hodinová mzda (Kč/hod)",
        regularHours: "Odpracované hodiny — běžné",
        nightHours: "Odpracované hodiny — noční / víkendové (+10\u00a0%)",
        resultHeading: "Výsledek",
        rowRegular: "Běžné hodiny",
        rowNight: "Noční / víkendové hodiny (+10\u00a0%)",
        rowGross: "Hrubá odměna celkem",
        taxLabel: "Daň z příjmu (15 %)",
        rowNet: "Odhad čisté odměny",
        disclaimer:
            "Jde o orientační výpočet pro rok 2026 (student, bez odvodů na sociální a zdravotní pojištění). Neuvažuje případné podepsané prohlášení poplatníka ani slevy na dani — skutečná čistá odměna se může lišit.",
    },
    en: {
        h1: "Job Pay",
        subtitle: "Part-time job payout calculator (DPP / DPČ)",
        formHeading: "Input",
        contractAria: "Contract type",
        hourlyRate: "Hourly rate (Kč/hr)",
        regularHours: "Hours worked — regular",
        nightHours: "Hours worked — night / weekend (+10%)",
        resultHeading: "Result",
        rowRegular: "Regular hours",
        rowNight: "Night / weekend hours (+10%)",
        rowGross: "Total gross pay",
        taxLabel: "Income tax (15%)",
        rowNet: "Estimated net pay",
        disclaimer:
            "This is a rough estimate for 2026 (student, no social/health insurance contributions). It doesn't account for a signed taxpayer declaration or tax credits — actual net pay may differ.",
    },
};
