<?php

require('covid.php');

$day = '2020-'.$argv[1];
$word = date('F jS',strtotime($day));

$out = '[';

FillInCountriesWorld($day);
$pop = array();
$continents = array();
$continents['USA'] = 'Northern America';
$pop['USA Country'] = '330,000,000';
$pop['World'] = '7,800,000,000';

$cpop = file_get_contents('country-pop.txt');
foreach (preg_split("/\n/",$cpop) as $line) {
	$parts = preg_split("/\t/",$line);
	$count = preg_replace('/,/','',$parts[4]);
	$pop[trim($parts[0])." Country"] = number_format(RoundSigDigs($count,2));
	$continents[trim($parts[0])] = $parts[2];
}

$citypop = file_get_contents('city-pop-dates.txt');
$today = new DateTime($day);
$schooldays = array();
$lockdays = array();
foreach (preg_split("/\n/",$citypop) as $line) {
	$parts = preg_split("/\t/",$line);
	$city = preg_replace("/ MSA/",'',$parts[0]);
	$count = preg_replace('/,/','',$parts[1]);
	if ($parts[2]) {
		$closed = new DateTime($parts[2]);
		$schools = date_diff($closed,$today);
		$schooldays["City of ".$city] = $schools->format('%a');
	}
	if ($parts[4]) {
		$locked = new DateTime($parts[4]);
		$locks = date_diff($locked,$today);
		$lockdays["City of ".$city] = $locks->format('%a');
	}
	$pop["City of ".$city] = number_format(RoundSigDigs($count,2));
}

$spop = file_get_contents('state-pop-dates.txt');
foreach (preg_split("/\n/",$spop) as $line) {
	$parts = preg_split("/\t/",$line);
	$count = preg_replace('/,/','',$parts[1]);
	$state = trim($parts[0]);
	if ($parts[2]) {
		$closed = new DateTime($parts[2]);
		$schools = date_diff($closed,$today);
		$schooldays[$state. " State"] = $schools->format('%a');
	}
	if ($parts[4]) {
		$locked = new DateTime($parts[4]);
		$locks = date_diff($locked,$today);
		$lockdays[$state. " State"] = $locks->format('%a');
	}
	$pop[$state." State"] = number_format(RoundSigDigs($count,2));
}

$firstRun = true;
foreach (AllCovidsByDay($day) as $C) {
	
    $st = 'World';
	if ($C->region_type == 'City') {
		$st = 'City of '.$C->region;
	} else if ($C->region_type == 'Counties') {
		continue;
	} else if ($C->region_type != 'World') {
		$st = $C->region. ' '.$C->region_type;
	}
	$current_ratio = $C->ratio;
	$last_total = $C->cases;
	$new_cases = number_format($C->new_cases);
	$new_cases_day = number_format($C->new_cases_day);
	$peak_cases = number_format(RoundSigDigs($C->peak,2));
	$last_total = number_format($last_total);
	$days_left = DaysToPeak($current_ratio);
	$popu = $pop[$st];
	$popuint = preg_replace("/,/","",$popu);
	$C->SavePop(intval($popuint));
	$peak_density = '';
	$rcolor='';
	$dcolor='';

	// if ($popu != "") {
	// 	continue;
	// }
	
	if ($C->cases > 20) {
		$rcolor='lightgoldenrodyellow';
		if ($current_ratio >= 33) {
			$rcolor='palevioletred';
		} else if ($current_ratio <= 10) {
			$rcolor='lightgreen';
		}
	}
	$sch = '';
	$lock = '';
	$est_bed_shortage = 0;
	if ($popuint) {
		$sch = $schooldays[$st];
		$lock = $lockdays[$st];
		$est_beds = preg_replace("/,/","",$popu)/10000;
		$est_peak_beds = preg_replace("/,/","",$peak_cases)/10;
		$est_bed_shortage = number_format($est_beds-$est_peak_beds);
		$shortage_ratio = $est_peak_beds/$est_beds; # >1 means shortage.
		$peak_density = RoundSigDigs(preg_replace("/,/","",$popu)/preg_replace("/,/","",$peak_cases),2);
		if ($C->cases > 20) {
			$dcolor='lightgoldenrodyellow';
			if ($shortage_ratio <= 0.8) {
				$dcolor='lightgreen';
			} else if ($shortage_ratio >= 1.5) {
				$dcolor='palevioletred';
			}
		}
		$peak_density = number_format($peak_density);
	}
	$rtype = '';
	if ($C->region_type == 'Country') {
		$rtype = 'Country in '.$continents[$C->region];
	} else if ($C->region_type == 'World') {
		$rtype = 'All Countries';
	} else {
		$rtype = $C->region_type." in ".$C->country;
    }
    if (!$firstRun) {
        $out .= ",";
    }

	$out .= trim("{
		\"region\":\"$C->region\",
		\"type\":\"$rtype\",
		\"pop\":\"".preg_replace("/,/","",$popu)."\",
		\"cases\":\"".preg_replace("/,/","",$last_total)."\",
		\"newCases\":\"".preg_replace("/,/","",$new_cases)."\",
		\"newCasesDay\":\"".preg_replace("/,/","",$new_cases_day)."\",
		\"ratio\":\"".intval($current_ratio)."\",
		\"schoolClosed\":\"$sch\",
		\"physDist\":\"$lock\",
		\"peak\":\"".preg_replace("/,/","",$peak_cases)."\",
		\"estBedShort\":\"".preg_replace("/,/","",$est_bed_shortage)."\",
		\"estDaysPeak\":\"".preg_replace("/,/","",$days_left)."\"
	}");

    $firstRun = false;
}
$out .= "]";
// $out = preg_replace("/\n/", '', $out);
$filename = ($day) ? "./json/$day.json" : "./json/all.json";
$fp = fopen($filename, 'w');
fwrite($fp, $out);
fclose($fp);
echo "Successfully created $filename \n";
