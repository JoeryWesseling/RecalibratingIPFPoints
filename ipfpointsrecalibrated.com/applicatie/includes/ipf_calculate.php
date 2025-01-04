<?php
// IPF Points Calculator function
function ipfPointsCalc($bwt, $total, $sex) {
    if ($sex === 'M') {
        $A = 1038.271102;
        $B = 1207.593924;
        $C = 0.017290;
    } elseif ($sex === 'F') {
        $A = 688.743183;
        $B = 1135.134454;
        $C = 0.028594;
    } else {
        throw new Exception("Invalid sex");
    }

    // Calculate IPF score
    $coeff = (100 / ($A - $B * exp(-$C * $bwt)));
    return round($coeff * $total, 2);
}

function ipfPointsCalcOld($bwt, $total, $sex) {
    if ($sex === 'M') {
        $A = 1199.72839;
        $B = 1025.18162;
        $C = 0.00921;
        
    } elseif ($sex === 'F') {
        $A = 610.32796;
        $B = 1045.59282;
        $C = 0.03048;
    } else {
        throw new Exception("Invalid sex");
    }

    // Calculate IPF score
    $coeff = (100 / ($A - $B * exp(-$C * $bwt)));
    return round($coeff * $total, 2);
}

session_start();
header(header: 'Content-Type: text/plain'); 


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        // Sanitize and validate inputs
        $bwt = filter_input(INPUT_POST, 'bodyweight', FILTER_VALIDATE_FLOAT);
        $total = filter_input(INPUT_POST, 'total', FILTER_VALIDATE_FLOAT);
        $sex = htmlspecialchars($_POST['sex'], ENT_QUOTES, 'UTF-8'); // Clean input with htmlspecialchars

        // Validate and sanitize sex input
        $sex = in_array($sex, ['M', 'F']) ? $sex : null;

        if ($bwt === false || $bwt <= 0 || $total === false || $total <= 0 || !$sex) {
            throw new Exception("Invalid input data.");
        }

        // Calculate both scores
        $recalibratedScore = ipfPointsCalc($bwt, $total, $sex);
        $oldScore = ipfPointsCalcOld($bwt, $total, $sex);

        // Return JSON response
        echo json_encode([
            'recalibrated' => $recalibratedScore,
            'old' => $oldScore,
        ]);
    } catch (Exception $e) {
        error_log("Error calculating IPF score: " . $e->getMessage());
        echo json_encode(['error' => "An error occurred. Please try again."]);
    }
}

?>
