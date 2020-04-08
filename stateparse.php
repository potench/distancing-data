<?php

$today = '03-18';
$today = $argv[1];
$year = '2020';
#$tots = array();
$data = file_get_contents('./csv/old/'.$today.'-'.$year.'.csv');
$data = preg_replace('/"Korea, South"/','South Korea',$data);
$data = preg_replace('/"Mainland China"/','China',$data);
$data = preg_replace('/"Korea, North"/','North Korea',$data);
$data = preg_replace("/Cote d'Ivoire/",'Ivory Coast',$data);
$data = preg_replace('/"Gambia, The"/','Gambia',$data);
$data = preg_replace('/"Virgin Islands, U.S."/','United States Virgin Islands',$data);

print "DELETE FROM `covids` WHERE `day` = '".$year."-".$today."'; \n";

foreach (preg_split("/\n/",$data) as $line) {
	# $parts = preg_split("/,/",$line);
	$parts = str_getcsv($line, ",", '"');
	$count = $parts['3'];
	if (!$count) {
		continue;
	}
	if ($count == 'Confirmed') {
		continue;
	}
	$state = $parts[0];
	$country = $parts[1];
	if ($country == 'US') {
		$country = 'USA';
		if ($state == 'US') { #wtf is this data?
			continue;
		}
	}
	$deaths = intval($parts['4']);
	$recovers = intval($parts['5']);
	$type = 'State';
	if (!$state) {
		$type = 'Country';
		$state = $country;
	}
	print "insert into covids values ('','".$year."-".$today."','$state',$count,'','','$country','$type',$deaths,$recovers,'','','');\n";
}
