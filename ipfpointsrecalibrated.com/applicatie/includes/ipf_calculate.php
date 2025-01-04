<?php
// IPF Points Calculator function
function ipfPointsCalc($bwt, $total, $gender) {
    if ($gender === 'M') {
        $A = 1038.271102;
        $B = 1207.593924;
        $C = 0.017290;
    } elseif ($gender === 'F') {
        $A = 688.743183;
        $B = 1135.134454;
        $C = 0.028594;
    } else {
        throw new Exception("Invalid gender");
    }

    // Calculate IPF score
    $coeff = (100 / ($A - $B * exp(-$C * $bwt)));
    return round($coeff * $total, 2);
}

function ipfPointsCalcOld($bwt, $total, $gender) {
    if ($gender === 'M') {
        $A = 1199.72839;
        $B = 1025.18162;
        $C = 0.00921;
        
    } elseif ($gender === 'F') {
        $A = 610.32796;
        $B = 1045.59282;
        $C = 0.03048;
    } else {
        throw new Exception("Invalid gender");
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
        $gender = htmlspecialchars($_POST['gender'], ENT_QUOTES, 'UTF-8'); // Clean input with htmlspecialchars

        // Validate and sanitize gender input
        $gender = in_array($gender, ['M', 'F']) ? $gender : null;

        if ($bwt === false || $bwt <= 0 || $total === false || $total <= 0 || !$gender) {
            throw new Exception("Invalid input data.");
        }

        // Calculate both scores
        $recalibratedScore = ipfPointsCalc($bwt, $total, $gender);
        $oldScore = ipfPointsCalcOld($bwt, $total, $gender);

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
