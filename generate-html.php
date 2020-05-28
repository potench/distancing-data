<?php

require('covid.php');

$day = '2020-'.$argv[1];
$word = date('F jS',strtotime($day));

$out = '<!DOCTYPE html>
<html lang="en">
<head>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-87949-17"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag(\'js\', new Date());

  gtag(\'config\', \'UA-87949-17\');
</script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Daily infection counts, rates, and predictions for the covid-19 coronavirus by region.</title>
<link rel="icon" type="image/png" sizes="96x96" href="favicon.png">
<link rel="manifest" href="manifest.json">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
  <!-- Google Fonts Roboto -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
  <!-- Bootstrap core CSS -->
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <!-- Material Design Bootstrap -->
  <link rel="stylesheet" href="css/mdb.min.css">
<!-- MDBootstrap Datatables  -->
<link href="css/addons/datatables.min.css" rel="stylesheet">
  <!-- Your custom styles (optional) -->
  <link rel="stylesheet" href="css/style.css">
<style>
table.dataTable thead .sorting:after,
table.dataTable thead .sorting:before,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_asc:before,
table.dataTable thead .sorting_asc_disabled:after,
table.dataTable thead .sorting_asc_disabled:before,
table.dataTable thead .sorting_desc:after,
table.dataTable thead .sorting_desc:before,
table.dataTable thead .sorting_desc_disabled:after,
table.dataTable thead .sorting_desc_disabled:before {
bottom: .5em;
}</style>
</head>
<body style="margin:10px">
<h1>&#x1F9A0; Live Covid-19 Cases for <b>'.$word.'</b></h1>
<h5><small
Data is pulled daily from <a href=https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports>this repository.</a>
Estimates assume physical distancing remains in place until the availability of widespread testing and contact tracing.
Peak estimates are based on <a href=https://www.facebook.com/blakestah>Dave Blake Jr.\'s</a> work. See this <a href=https://medium.com/@dblake.mcg/estimating-peak-covid19-infection-rates-950c7f3cfc1a?sk=12e76358dedf8294e01e247e2c663bde>post.</a>
Estimated ICU beds assume 1 bed per 10,000 people, and 10% of cases will need one.
The real-time nature of this event means we cannot promise our estimates are accurate. You may download the source code for this site <a href=source.zip>here.</a>
</small></h5>
<br>
<h5>Try searching for <i>"China"</i>, <i>"Europe"</i>, <i>"City"</i>, <i>"New York"</i>, etc..</h5>
<table id="dtBasicExample" class="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
  <thead>
    <tr>
      <th class="th-sm">Region
      </th>
      <th class="th-sm">Type
      </th>
      <th class="th-sm">Population
      </th>
      <th class="th-sm">Confirmed Total Cases
      </th>
      <th class="th-sm">Current Daily Growth
      </th>
      <th class="th-sm">Days Since Schools Closed
      </th>
      <th class="th-sm">Days Since Physical Distancing
      </th>
      <th class="th-sm">Est. Peak Cases
      </th>
      <th class="th-sm">Est. Spare ICU Beds
      </th>
      <th class="th-sm">Days To Peak Cases
      </th>
    </tr>
  </thead>
  <tbody>

';

FillInCountriesWorld($day);
$pop = array();
$continents = array();
$continents['USA'] = 'Northern America';
$pop['USA Country'] = '330,000,000';
$pop['World'] = '7,800,000,000';

$otherpop = file_get_contents('other-pop.txt');
foreach (preg_split("/\n/",$otherpop) as $line) {
	$parts = preg_split("/\t/",$line);
	if ($parts[0]) {
		$count = preg_replace('/,/','',$parts[2]);
		$pop[trim($parts[0])." ".trim($parts[1])] = number_format(RoundSigDigs($count,2));
	}
}

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

$counter = 0;
$missing_pop = "";
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
	$peak_cases = number_format(RoundSigDigs($C->peak,2));
	$last_total = number_format($last_total);
	$days_left = DaysToPeak($current_ratio);
	$popu = $pop[$st];
	$popuint = preg_replace("/,/","",$popu);
	if (!$popu) {
		$missing_pop .= "$counter: $st $popuint \n";
		$counter += 1;
	}
	$C->SavePop(intval($popuint));
	$C->FillReopenData();
	$peak_density = '';
	$rcolor='';
	$dcolor='';

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
	$out .= "<tr>
<td>".$C->region."</td>
<td>$rtype</td>
<td>$popu</td>
<td>$last_total</td>
<td style='background-color:$rcolor'>{$current_ratio}%</td>
<td>$sch</td>
<td>$lock</td>
<td>$peak_cases</td>
<td style='background-color:$dcolor'>$est_bed_shortage</td>
<td>$days_left</td>
</tr>\n";
}
$out .= '
  </tbody>
</table>

  <!-- jQuery -->
  <script type="text/javascript" src="js/jquery.min.js"></script>
  <!-- Bootstrap tooltips -->
  <script type="text/javascript" src="js/popper.min.js"></script>
  <!-- Bootstrap core JavaScript -->
  <script type="text/javascript" src="js/bootstrap.min.js"></script>
  <!-- MDB core JavaScript -->
  <script type="text/javascript" src="js/mdb.min.js"></script>
<!-- MDBootstrap Datatables  -->
<script type="text/javascript" src="js/addons/datatables.min.js"></script>
  <!-- Your custom scripts (optional) -->
  <script type="text/javascript">
$(document).ready(function () {
$(\'#dtBasicExample\').DataTable({
"paging": false,
"order": [[7,"desc"]]
});
$(\'.dataTables_length\').addClass(\'bs-select\');
});
</script>

</body>
</html>';
file_put_contents("./missing-pop.txt", $missing_pop);
file_put_contents("./html/$day.html",$out);
file_put_contents("./html/index.html",$out);
