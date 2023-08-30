<?php


// Change port accordingly
$servername = "localhost:3306";

// REPLACE with your Database name
$dbname = "faculty_access_schema";
// REPLACE with Database user
$username = "root";
// REPLACE with Database user password
$password = "";

// Keep this API Key value to be compatible with the ESP32 code provided in the project page.
// If you change this value, the ESP32 sketch needs to match
$api_key_value = "tPmAT5Ab3j7F9";

$api_key= $sensor = $location = $value1 = $value2 = $value3 = $session_id = $attendance = $ses_group = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $api_key = $data["api_key"];
    if($api_key == $api_key_value){
        $session_id = $data["session_id"];
        $attendance = $data["attendance"];
    }else{
        echo 212;
        return;
    }

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        echo 501;
    }

    $sql = '';

    // Select group of the session
    $sql = 'SELECT Ses_group FROM sessions WHERE id=' .$session_id;
    $ses_group = mysqli_query($conn, $sql);

    if (!$ses_group) {
        echo 502;
    }

    $finalResult = 0;
    if (mysqli_num_rows($ses_group) == 0) {
        echo 201;
    }else{
        $ses_group = mysqli_fetch_assoc($ses_group)["Ses_group"];

        // Update attendance
        
        /*$sql = 'UPDATE attendance_' . $ses_group . ' SET ses' . $session_id . ' = 1 WHERE Student IN (' . implode(",", $attendance) . ')';

        $result = mysqli_query($conn, $sql);

        if(!$result){
            die("Query execution failed: " . mysqli_error($conn));
        }else{
            echo "success";
        }*/

        /*$sql = 'UPDATE attendance_' . $ses_group . ' AS att INNER JOIN (SELECT Student, attendance_time FROM JSON_TABLE( [{"Student":"574269898","attendance_time":"2023-06-28"}],"$[*]" COLUMNS(Student INT PATH "$.Student", attendance_time VARCHAR(20) PATH "$.attendance_time"))) AS json_data ON att.Student = json_data.Student SET att.ses' . $session_id . ' = json_data.attendance_time';
        $result = mysqli_query($conn, $sql);

        if(!$result){
            die("Query execution failed: " . mysqli_error($conn));
        }else{
            echo "success";
        }*/
        foreach($attendance as $item){
            // $student = $item['Student'];
            // $attendance_time = $item['attendance_time'];
            $student = substr($item, 0, -9);
            $attendance_time = substr($item, -8);

            $sql = 'UPDATE attendance_' . $ses_group . ' SET ses' . $session_id . ' = "' . $attendance_time . '" WHERE Student = ' . $student;

            $result = mysqli_query($conn, $sql);
            if(!$result){
                $finalResult = 503;
                break;
            }else{
                $finalResult = 200;
            }
        }
        echo $finalResult;
        $conn->close();
    }
}else{
    echo "no http POST sent.";
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>