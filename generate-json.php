<?php

$generate_by = 'day';
$generate_by = $argv[1];
$year = '2020';
$date = $argv[2];

if ($generate_by == 'day' && !$date) {
    echo "Date param required ex: 'php generate-json day 04-04' \n";
    return;
}

$GLOBALS['DBH'] = mysqli_connect('127.0.0.1', 'christian','','potench');
if (! $GLOBALS['DBH']) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
	echo " can't connect to db.";
	die;
}

mysqli_query($GLOBALS['DBH'], "SET GLOBAL sql_mode = ''");
mysqli_query($GLOBALS['DBH'], "SET SESSION sql_mode = ''");

$return_arr = Array();

$byDay = ($date) ? "WHERE day='$year-$date'" : "";
$query = "SELECT * FROM `covids` $byDay"; 

// echo "$query \n";

$result = mysqli_query($GLOBALS['DBH'],$query) or die("Query Failed: $query");

while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    array_push($return_arr,$row);
}

$json_result = json_encode($return_arr);

// echo "$json_result \n";

$filename = ($date) ? "./json/$year-$date.json" : "./json/all.json";
$fp = fopen($filename, 'w');
fwrite($fp, $json_result);
fclose($fp);
echo "Successfully created $filename \n";
