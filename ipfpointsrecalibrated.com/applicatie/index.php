<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>IPF Points Calculator</title>
    <link rel="icon" type="image/x-icon" href="/images/android-chrome-192x192.png">
    <link rel="stylesheet" href="assets/css/styles.css">
    <script src="assets/js/ipf_calculate.js" defer></script>
</head>
<body>
    <header>
        <h1> IPF GL Points Recalibrated Calculator</h1>
    </header>
    <main>
        <h1>Calculate your Recalibrated IPF GL Score!</h1>
        <div class="form-section">
        <div class="score-section">
                <h2 id="result">Recalibrated Score: 0.00</h2>
                <h2 id="old-result">Old Score: 0.00</h2>
            </div>
            <form id="calculator-form">
                <label for="total">Total Performance (kg):</label>
                <input type="number" id="total" name="total" step="0.01" placeholder="Total" required>

                <label for="bodyweight">Bodyweight (kg):</label>
                <input type="number" id="bodyweight" name="bodyweight" step="0.01" min="37.5" placeholder="Bodyweight" required>

                <div class="select-container">
                    <select id="gender" name="gender" required>
                        <option value="" disabled selected>Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                     </select>
                </div>
                <button type="button" id="calculate-btn" class="calculate-btn">Calculate</button>
            </form>
        </div>
    </main>
    <footer>
        <p>Data from <a href="https://www.openipf.org/">OpenPowerlifting</a>.</p>
        <p>Created By <a href="https://www.instagram.com/boarendss/">Bo Arends</a> And <a href="https://www.instagram.com/joerywesseling">Joery Wesseling</a>.</p>
        <p>Want to learn more? <a href="https://github.com/JoeryWesseling/RecalibratingIPFPoints">GitHub Refitting IPF Points</a></p>

    </footer>
</body>
</html>
