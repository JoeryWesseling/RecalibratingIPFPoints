document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calculator-form");
    const resultElement = document.getElementById("result");
    const oldResultElement = document.getElementById("old-result");
    const bodyweightInput = document.getElementById("bodyweight");
    const totalInput = document.getElementById("total");
    const sexSelect = document.getElementById("sex");
    const errorMessagesElement = document.getElementById("error-messages");

    // Retrieve stored values from sessionStorage
    bodyweightInput.value = sessionStorage.getItem("bodyweight") || "";
    totalInput.value = sessionStorage.getItem("total") || "";
    sexSelect.value = sessionStorage.getItem("sex") || "";
    resultElement.textContent = sessionStorage.getItem("recalibrated") || "Recalibrated IPF GL Points: 0.00";
    oldResultElement.textContent = sessionStorage.getItem("old") || "Old IPF GL Points: 0.00";

    // Save input values to sessionStorage on every input event
    form.addEventListener("input", function () {
        sessionStorage.setItem("bodyweight", bodyweightInput.value);
        sessionStorage.setItem("total", totalInput.value);
        sessionStorage.setItem("sex", sexSelect.value);
    });

    function calculateIPFPoints() {
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

        // If all inputs are valid, proceed with calculation
        const formData = new FormData();
        formData.append("bodyweight", bodyweight);
        formData.append("total", total);
        formData.append("sex", sex);

        fetch('includes/ipf_calculate.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    errorMessagesElement.textContent = data.error;
                    resultElement.textContent = "Recalibrated IPF GL Points: 0.00";
                    oldResultElement.textContent = "Old IPF GL Points: 0.00";
                } else {
                    resultElement.textContent = `Recalibrated IPF GL Points: ${data.recalibrated}`;
                    oldResultElement.textContent = `Old IPF GL Points: ${data.old}`;
                    // Update sessionStorage with new results
                    sessionStorage.setItem("recalibrated", resultElement.textContent);
                    sessionStorage.setItem("old", oldResultElement.textContent);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorMessagesElement.textContent = "An error occurred. Please try again.";
            });
    }

    // Recalculate points when form changes
    form.addEventListener("input", calculateIPFPoints);
});
