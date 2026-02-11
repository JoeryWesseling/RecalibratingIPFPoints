
let selectedLift = sessionStorage.getItem("lift") || "SBD";
document.addEventListener("DOMContentLoaded", function () {
    initializeForm();
    attachEventListeners();
    calculateIPFPoints();

});



function initializeForm() {
    const form = document.getElementById("calculator-form");
    const resultElement = document.getElementById("result");
    const oldResultElement = document.getElementById("old-result");
    const bodyweightInput = document.getElementById("bodyweight");
    const totalInput = document.getElementById("total");
    // const sexSelect = document.getElementById("sex");
    const liftSelect = document.getElementById("lift");



    // Retrieve stored values from sessionStorage
    bodyweightInput.value = sessionStorage.getItem("bodyweight") || "";
    totalInput.value = sessionStorage.getItem("total") || "";
    // sexSelect.value = sessionStorage.getItem("sex") || "";
    resultElement.textContent = sessionStorage.getItem("recalibrated") || "Recalibrated GL Points: 0.00";
    oldResultElement.textContent = sessionStorage.getItem("old") || "Old GL Points: 0.00";
    liftSelect.value = sessionStorage.getItem("lift") || "SBD";


    // Save input values to sessionStorage on input event
    form.addEventListener("input", function () {
        sessionStorage.setItem("bodyweight", bodyweightInput.value);
        sessionStorage.setItem("total", totalInput.value);
        // sessionStorage.setItem("sex", sexSelect.value);
        const selectedSex = document.querySelector('input[name="sex"]:checked');
        sessionStorage.setItem("sex", selectedSex ? selectedSex.value : "");

    });

    const sexInputs = document.querySelectorAll('input[name="sex"]');

    const savedSex = sessionStorage.getItem("sex");
    if (savedSex) {
        sexInputs.forEach(radio => {
            if (radio.value === savedSex) {
                radio.checked = true;
            }
        });
    }

}

function attachEventListeners() {
    const bodyweightInput = document.getElementById("bodyweight");
    const totalInput = document.getElementById("total");
    // const sexInputs = document.querySelectorAll('input[name="sex"]');
    const calculateBtn = document.getElementById("calculate-btn");


    // Attach event listeners for real-time calculation
    bodyweightInput.addEventListener("input", calculateIPFPoints);
    totalInput.addEventListener("input", calculateIPFPoints);
    // sexSelect.addEventListener("change", calculateIPFPoints);
    calculateBtn.addEventListener("click", calculateIPFPoints);

    const sexInputs = document.querySelectorAll('input[name="sex"]');

    sexInputs.forEach(radio => {
        radio.addEventListener("change", calculateIPFPoints);
    });



    const liftSelect = document.getElementById("lift");

    liftSelect.addEventListener("change", function () {
        selectedLift = liftSelect.value;
        sessionStorage.setItem("lift", selectedLift);
        calculateIPFPoints();
    });

}


function calculateIPFPoints() {
    console.log("Calculating...");
    console.log("Calculating for lift:", selectedLift);


    const resultElement = document.getElementById("result");
    const oldResultElement = document.getElementById("old-result");
    const bodyweightInput = document.getElementById("bodyweight");
    const totalInput = document.getElementById("total");
    // const sexSelect = document.getElementById("sex");
    const errorMessagesElement = document.getElementById("error-messages");
    const liftSelectedElement = document.getElementById("lift-selected");


    // Clear previous error messages
    errorMessagesElement.textContent = "";

    // Validate inputs
    const bodyweight = parseFloat(bodyweightInput.value);
    const total = parseFloat(totalInput.value);
    // const sex = sexSelect.value;

    const selectedSex = document.querySelector('input[name="sex"]:checked');
    const sex = selectedSex ? selectedSex.value : "";


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
        resultElement.textContent = "Recalibrated GL Points: 0.00";
        oldResultElement.textContent = "Old GL Points: 0.00";
        return;
    }

    // Update UI with results
    resultElement.textContent = `Recalibrated GL Points: ${recalibratedScore}`;
    oldResultElement.textContent = `Old GL Points: ${oldScore}`;
    liftSelectedElement.textContent = `Lift Selected: ${selectedLift}`;


    // Update sessionStorage
    sessionStorage.setItem("recalibrated", resultElement.textContent);
    sessionStorage.setItem("old", oldResultElement.textContent);
    sessionStorage.setItem("lift-selected", selectedLift);

}

//constants for the IPF coefficients. Old AND new.
const ipfCoefficients = {
    new: {
        SBD: { M: {A: 1038.27, B: 1207.59, C: 0.01729}, F: {A: 688.74, B: 1135.13, C: 0.02859} },
        Squat: { M: {A: 530.01583555, B: 509.13503583, C: 0.00881716}, F: {A: 372.38701723, B: 373.80985042, C: 0.01107378} },
        Bench: { M: {A: 500, B: 900, C: 0.015}, F: {A: 350, B: 750, C: 0.025} },
        Deadlift: { M: {A: 369.21260065 , B: 1052.47284818, C: 0.03804565}, F: {A: 266.37652909, B: 435.88968704, C: 0.03489198} },
    },


old: {
        SBD: { M: {A: 1199.72, B: 1025.18, C: 0.00921}, F: {A: 610.32, B: 1045.59, C: 0.03048} },
        Squat: { M: {A: 500, B: 900, C: 0.01}, F: {A: 400, B: 800, C: 0.03} },
        Bench: { M: {A: 600, B: 1000, C: 0.008}, F: {A: 450, B: 850, C: 0.025} },
        Deadlift: { M: {A: 700, B: 1100, C: 0.009}, F: {A: 500, B: 900, C: 0.02} },
    }
};

function ipfPointsCalc(bwt, total, sex, version = "new") {
    const coeffData = ipfCoefficients[version][selectedLift][sex];
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
