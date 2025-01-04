document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calculator-form");
    const resultElement = document.getElementById("result");
    const oldResultElement = document.getElementById("old-result");
    const calculateBtn = document.getElementById("calculate-btn");

    // Set initial values
    resultElement.textContent = "Recalibrated Score: 0.00";
    oldResultElement.textContent = "Old Score: 0.00";

    // Automatically calculate as input changes
    form.addEventListener("input", calculateIPFPoints);

    // Trigger calculation when the button is clicked (backup)
    calculateBtn.addEventListener("click", calculateIPFPoints);

    function calculateIPFPoints() {
        const bodyweight = parseFloat(document.getElementById("bodyweight").value);
        const total = parseFloat(document.getElementById("total").value);
        const sex = document.getElementById("sex").value;

        // If any field is incomplete or invalid, do not calculate and reset output
        if (isNaN(bodyweight) || isNaN(total) || !sex) {
            // Show default 0.00 values if inputs are incomplete or invalid
            resultElement.innerHTML = "Recalibrated Score: 0.00";
            oldResultElement.innerHTML = "Old Score: 0.00";
            return;
        }

        // Validate minimum bodyweight
        if (bodyweight < 37.5) {
            resultElement.textContent = "Bodyweight must be at least 37.5kg.";
            oldResultElement.textContent = "";
            return;
        }

        // Proceed with the calculation if all fields are valid
        const formData = new FormData();
        formData.append("bodyweight", bodyweight);
        formData.append("total", total);
        formData.append("sex", sex);

        resultElement.textContent = "Calculating...";
        oldResultElement.textContent = "";

        fetch('includes/ipf_calculate.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json()) // Parse JSON response
            .then(data => {
                if (data.error) {
                    resultElement.textContent = data.error; // Handle error from server
                    oldResultElement.textContent = "";
                } else {
                    // Format the output
                    resultElement.innerHTML = `Recalibrated Score: ${data.recalibrated}`;
                    oldResultElement.innerHTML = `Old Score: ${data.old}`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultElement.textContent = "An error occurred. Please try again.";
                oldResultElement.textContent = "";
            });
    }
});
