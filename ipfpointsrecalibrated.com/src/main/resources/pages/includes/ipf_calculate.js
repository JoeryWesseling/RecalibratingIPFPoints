document.addEventListener("DOMContentLoaded", function () {
    initializeForm();
    attachEventListeners();
});

function initializeForm() {
    const form = document.getElementById("calculator-form");
    const resultElement = document.getElementById("result");
    const oldResultElement = document.getElementById("old-result");
    const bodyweightInput = document.getElementById("bodyweight");
    const totalInput = document.getElementById("total");
    const sexSelect = document.getElementById("sex");

    // Retrieve stored values from sessionStorage
    bodyweightInput.value = sessionStorage.getItem("bodyweight") || "";
    totalInput.value = sessionStorage.getItem("total") || "";
    sexSelect.value = sessionStorage.getItem("sex") || "";
    resultElement.textContent = sessionStorage.getItem("recalibrated") || "Recalibrated IPF GL Points: 0.00";
    oldResultElement.textContent = sessionStorage.getItem("old") || "Old IPF GL Points: 0.00";

    // Save input values to sessionStorage on input event
    form.addEventListener("input", function () {
        sessionStorage.setItem("bodyweight", bodyweightInput.value);
        sessionStorage.setItem("total", totalInput.value);
        sessionStorage.setItem("sex", sexSelect.value);
    });
}

function attachEventListeners() {
    const bodyweightInput = document.getElementById("bodyweight");
    const totalInput = document.getElementById("total");
    const sexSelect = document.getElementById("sex");
    const calculateBtn = document.getElementById("calculate-btn");

    // Attach event listeners for real-time calculation
    bodyweightInput.addEventListener("input", calculateIPFPoints);
    totalInput.addEventListener("input", calculateIPFPoints);
    sexSelect.addEventListener("change", calculateIPFPoints);
    calculateBtn.addEventListener("click", calculateIPFPoints);
}

function calculateIPFPoints() {
    console.log("Calculating...");

    const resultElement = document.getElementById("result");
    const oldResultElement = document.getElementById("old-result");
    const bodyweightInput = document.getElementById("bodyweight");
    const totalInput = document.getElementById("total");
    const sexSelect = document.getElementById("sex");
    const errorMessagesElement = document.getElementById("error-messages");

    // Clear previous error messages
    errorMessagesElement.textContent = "";

    // Validate inputs
    const bodyweight = parseFloat(bodyweightInput.value);
    const total = parseFloat(totalInput.value);
    const sex = sexSelect.value;

    if (isNaN(bodyweight)) {
        errorMessagesElement.textContent = "Please enter a valid bodyweight.";
        return;
    }

    if (bodyweight < 37.5) {
        errorMessagesElement.textContent = "Bodyweight must be at least 37.5kg.";
        return;
    }

    if (isNaN(total)) {
        errorMessagesElement.textContent = "Please enter a valid total performance.";
        return;
    }

    if (!sex) {
        errorMessagesElement.textContent = "Please select a valid sex.";
        return;
    }

    // Calculate IPF points
    const recalibratedScore = ipfPointsCalc(bodyweight, total, sex, "new");
    const oldScore = ipfPointsCalc(bodyweight, total, sex, "old");

    // Handle errors
    if (recalibratedScore.error || oldScore.error) {
        errorMessagesElement.textContent = recalibratedScore.error || oldScore.error;
        resultElement.textContent = "Recalibrated IPF GL Points: 0.00";
        oldResultElement.textContent = "Old IPF GL Points: 0.00";
        return;
    }

    // Update UI with results
    resultElement.textContent = `Recalibrated IPF GL Points: ${recalibratedScore}`;
    oldResultElement.textContent = `Old IPF GL Points: ${oldScore}`;

    // Update sessionStorage
    sessionStorage.setItem("recalibrated", resultElement.textContent);
    sessionStorage.setItem("old", oldResultElement.textContent);
}

//constants for the IPF coefficients. Old AND new.
const ipfCoefficients = {
    new: {
        M: {A: 1038.271102, B: 1207.593924, C: 0.017290},
        F: {A: 688.743183, B: 1135.134454, C: 0.028594},
    },
    old: {
        M: {A: 1199.72839, B: 1025.18162, C: 0.00921},
        F: {A: 610.32796, B: 1045.59282, C: 0.03048},
    }
};

function ipfPointsCalc(bwt, total, sex, version = "new") {
    const coeffData = ipfCoefficients[version][sex];
    if (!coeffData) return {error: "Invalid sex!"};

    const {A, B, C} = coeffData;
    const coeff = (100 / (A - B * Math.exp(-C * bwt)));
    return round(coeff * total, 2);
}

//
// // Calculation functions
// function ipfPointsCalc(bwt, total, sex) {
//     let A, B, C;
//     if (sex === 'M') {
//         A = 1038.271102;
//         B = 1207.593924;
//         C = 0.017290;
//     } else if (sex === 'F') {
//         A = 688.743183;
//         B = 1135.134454;
//         C = 0.028594;
//     } else {
//         return {error: "Invalid sex"};
//     }
//     const coeff = (100 / (A - B * Math.exp(-C * bwt)));
//     return round(coeff * total, 2);
// }
//
// function ipfPointsCalcOld(bwt, total, sex) {
//     let A, B, C;
//     if (sex === 'M') {
//         A = 1199.72839;
//         B = 1025.18162;
//         C = 0.00921;
//     } else if (sex === 'F') {
//         A = 610.32796;
//         B = 1045.59282;
//         C = 0.03048;
//     } else {
//         return {error: "Invalid sex"};
//     }
//     const coeff = (100 / (A - B * Math.exp(-C * bwt)));
//     return round(coeff * total, 2);
// }

// Round function
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
