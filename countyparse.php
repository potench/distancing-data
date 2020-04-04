<?php

$map = array();
foreach (preg_split("/\n/",file_get_contents('county-to-city.txt')) as $line) {
	$parts = preg_split("/\t/",$line);
	if ($parts[1]) {
		$map[$parts[1].'_'.$parts[2]] = $parts[0];
	}
}

$today = '03-24';
$year = '2020';
$tots = array();
$data = file_get_contents($today.'-'.$year.'.csv');
foreach (preg_split("/\n/",$data) as $line) {
	$parts = preg_split("/,/",$line);
	if ($parts[3] != 'US') {
		continue;
	}
	$count = $parts['7'];
	if (!$count) {
		continue;
	}
	$state = $parts['2'];
	$county = $parts['1'];
	$tots[$state." State"] += $count;
	$city = $map["{$county} County_{$state}"];
	if (!$city) {
		$city = $map["{$county} city_{$state}"];
	}
	if ($city) {
		$city = "City of $city";
	} else {
		$city = "Other {$state} Counties";
	}
#	if (!$city) {
#		print "WHERE OH WHERE IS $county, $state?!!\n";
#	} else {
		$tots[$city] += $count;
#	}
}
#$today = '03-24';
foreach ($tots as $state => $count) {
	print "insert into confirmed values ('','".$year."-".$today."','$state',$count);\n";
}
print "delete from confirmed where state='other wuhan evacuee counties';\n";
print "delete from confirmed where state='wuhan evacuee state';\n";
print "delete from confirmed where state='Other Grand Princess Counties';\n";
print "delete from confirmed where state='Other Diamond Princess Counties';\n";
print "delete from confirmed where state='Grand Princess State';\n";
print "delete from confirmed where state='Diamond Princess State';\n";
