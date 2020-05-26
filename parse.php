<?php

require ('covid.php');

$map = array();
foreach (preg_split("/\n/",file_get_contents('county-to-city.txt')) as $line) {
	$parts = preg_split("/\t/",$line);
	if ($parts[1]) {
		$map[$parts[1].'_'.$parts[2]] = $parts[0];
	}
}


$today = '03-25';
$today = $argv[1];
$year = '2020';
$states = array();
$statedeaths = array();
$staterecovers = array();
$counties = array();
$countydeaths = array();
$countyrecovers = array();
$cities = array();
$citydeaths = array();
$cityrecovers = array();
$statetests = array();
$data = file_get_contents('./csv/new/'.$today.'-'.$year.'.csv');
$data = preg_replace('/"Korea, South"/','South Korea',$data);
$data = preg_replace('/"Korea, North"/','North Korea',$data);
$data = preg_replace("/Cote d'Ivoire/",'Ivory Coast',$data);
$data = preg_replace('/"Gambia, The"/','Gambia',$data);

# get contents of state-csv - add total-tests to state level data 
$statefile = './csv/state/'.$today.'-'.$year.'.csv';
if (file_exists($statefile)) {
	$statedata = file_get_contents($statefile);
	if ($statedata !== FALSE) {
		foreach (preg_split("/\n/", $statedata) as $line) {
			$parts = str_getcsv($line, ",", '"');
			$state = $parts[0];
			$statetests[$state] = $parts[11]; # num tests
			// print_r($parts);
		}
	}
}

print "DELETE FROM `covids` WHERE `day` = '".$year."-".$today."'; \n";

#FIPS	Admin2	Province_State	Country_Region	Last_Update	Lat	Long_	Confirmed	Deaths	Recovered	Active	Combined_Key
foreach (preg_split("/\n/",$data) as $line) {
	// $line = preg_replace("/'/","''",$line);
	// $parts = preg_split("/,/",$line);
	$parts = str_getcsv($line, ",", '"');
	$count = $parts['7'];
	$deaths = $parts['8'];
	$recovers = $parts['9'];
	if (!$count || $count == 'Confirmed') {
		continue;
	}
	$country = $parts[3];
	$state = $parts['2'];
	$county = $parts['1'];

	if ($country != 'US') {
		if ($state) { #netherlands united kingdom france denmark show up twice. # china, canada, australia only show up in provinces.
			$type = 'Province'; # china and canada
			if ($country == 'France') {
				$type = 'Department';
				$type = 'Country';
				$country = $state;
			} else if ($country == 'Denmark' || $country == 'United Kingdom') {
				$type = 'Territory';
				$type = 'Country';
				$country = $state;
			} else if ($country == 'Netherlands') {
				$type = 'Constituent';
				$type = 'Country';
				$country = $state;
			} else if ($country == 'Australia') {
				$type = 'State';
			}
			print "insert into covids values ('','".$year."-".$today."',\"{$state}\",$count,'','','$country','$type',$deaths,$recovers,'','','','','','','','','','');\n";
		} else {
			print "insert into covids values ('','".$year."-".$today."',\"{$country}\",$count,'','',\"{$country}\",'Country',$deaths,$recovers,'','','','','','','','','','');\n";
		}
		continue;
	}
	# now we're looking at US only.
	$states[$state] += $count;
	$statedeaths[$state] += $deaths;
	$staterecovers[$state] += $recovers;
	$city = $map["{$county} County_{$state}"];
	if (!$city) {
		$city = $map["{$county} city_{$state}"];
	}
	if ($city) {
		$cities[$city] += $count;
		$citydeaths[$city] += $deaths;
		$cityrecovers[$city] += $recovers;
	} else {
		$region = "$state"; // "$country-$state-$county";
		$counties[$region] += $count;
		$countydeaths[$region] += $deaths;
		$countyrecovers[$region] += $recovers;
	}
}
foreach ($states as $state => $count) {
	$deaths = $statedeaths[$state]; // + $countydeaths[$state];
	$recovers = $staterecovers[$state]; // + $countyrecovers[$state];
	$tested = $statetests[$state];
	$tested = $tested ? $tested : 0;
	print "insert into covids values ('','".$year."-".$today."',\"{$state}\",$count,'','','USA','State',$deaths,$recovers,'','','','', $tested,'','','','','');\n";
}
foreach ($counties as $state => $count) {
	$deaths = $countydeaths[$state];
	$recovers = $countyrecovers[$state];
	// print "insert into covids values ('','".$year."-".$today."',\"{$state}\",$count,'','','USA','Counties',$deaths,$recovers,'','','','','','','','','','');\n";
}
foreach ($cities as $state => $count) {
	$deaths = $citydeaths[$state];
	$recovers = $cityrecovers[$state];
	print "insert into covids values ('','".$year."-".$today."',\"{$state}\",$count,'','','USA','City',$deaths,$recovers,'','','','','','','','','','');\n";
}
print "delete from covids where region='wuhan evacuee';\n";
print "delete from covids where region='Diamond Princess';\n";
print "delete from covids where region='Grand Princess';\n";
print "update covids set region='Taiwan' where region='Taiwan*';\n";
print "update covids set country='Taiwan' where country='Taiwan*';\n";
