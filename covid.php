<?php

$GLOBALS['DBH'] = mysqli_connect('127.0.0.1', 'christian','','density');
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

// $query = "DELETE FROM `covids` WHERE `region`='World'";
// $result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryt failed: $query");
# objects #

class TableObject {

	var $table;
	var $rows;
	var $primary_keys;
	

    function Kids($objectname,$etc='') {

		$column = substr($this->table,0,-1);
		if ($column == 'peopl') {
			$column = 'user';
		}
		if ($objectname == 'PayerPlan') {
			$column = 'payer';
			$select_tb = 'plans';
		} else if ($objectname == 'Job') {
			$select_tb = 'ocr_batches';
		} else if ($objectname == 'Address') {
			$select_tb = 'addresses';
		} else {
			$select_tb = strtolower($objectname).'s';
		}

		$query = "select * from ".$select_tb." where ".$column."_id='".mysqli_real_escape_string($GLOBALS['DBH'],$this->id)."'";
		if ($etc) {
			$query .= " $etc";
		}
		$result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryt failed: $query");
		$Ks = array();
		while ($line = mysqli_fetch_assoc($result)) {
			$K = new $objectname();
			$K->Fill($line);
			array_push($Ks, $K);
		}
		return $Ks;
	}

	function Parent($objectname,$column='') {
		$P = new $objectname();
		if (!$column) {
			$column = strtolower($objectname).'_id';
			if ($column == 'person_id') {
				$column = 'user_id';
			}
		}
		$P->Load(array($P->primary_keys[0]=>$this->$column));
		return $P;
	}

	function Load() {
		$numargs = func_num_args();
		if ($numargs > 0) {
			$args = func_get_arg(0); #read in variable.
			if ($args) {
				foreach ($args as $key => $value) {
					$this->$key = $value;
				}
			}
		}

		$query = "select * from ".$this->table." where ";
		$first = 1;
		foreach ($this->primary_keys as $column) {
			if (!$first) {
				$query .= " and ";
			}
			$query .= "$column='".mysqli_real_escape_string($GLOBALS['DBH'],$this->$column)."'";
			$first = 0;
		}
		$result = mysqli_query($GLOBALS['DBH'],$query) or die("Querye failed: $query");
#			@mysqli_close($link);
#print "\n\nQUERY: $query\n\n";
		if ($line = mysqli_fetch_assoc($result)) {
			foreach ($line as $column => $column_val) {
				$this->$column= $column_val;
			}
			return 1;
		} else {
			return 0;
		}
	}

	function Save() {
		## build values array the old fashioned way, since array_map doesn't seem to work well with objects.
		$vals = array();
		foreach ($this->rows as $row) {
			$val = $this->$row;
			if ($val) {
				$val = "'".mysqli_real_escape_string($GLOBALS['DBH'],$this->$row)."'";
			} else { #we're not going to use NULL as much as we can!
				$val = "''";
			}
			array_push($vals, $val);
		}

		$replace = "replace into ".$this->table." (".join(",",$this->rows).") values (".join(",",$vals).")";
		# echo "REPLACE:: $replace;";
		$result = mysqli_query($GLOBALS['DBH'],$replace) or die("Queryf failed: $replace");
#			@mysqli_close($link);

		## update auto-increment keys.
		$last = mysqli_insert_id($GLOBALS['DBH']); #auto-increment key!
		if ($last) { #if there was an auto-increment.
			if (count($this->primary_keys) == 1) { # if this only has one primary key.
				$keyname = $this->primary_keys[0];
				if (!$this->$keyname) { # if the primary key has no value.
					## update the primary key!
					$this->$keyname = $last;
				}
			}
		}
		return $result;
	}

	function Fill($values) { # used to fill the object with values without accessing the db..
		foreach ($values as $key => $value) {
			$this->$key = $value;
		}
		return 1;
	}

	function Destroy() {

		$query = "delete from ".$this->table." where ";
		$first = 1;
		foreach ($this->primary_keys as $column) {
			if (!$first) {
				$query .= " and ";
			}
			$query .= "$column='".mysqli_real_escape_string($GLOBALS['DBH'],$this->$column)."'";
			$first = 0;
		}
		$result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryg failed: $query");
		return $result;
	}
}



class Covid extends TableObject {
	var $table = 'covids';
	var $rows = array('id','day','region','cases','ratio','peak','country','region_type','deaths','recovers','new_cases','new_cases_day','cases_10','pop','tested','new_tested','positivity','positivity_10','infection_density');
	var $primary_keys = array('id');

	function SavePop($popu) {
		if (!$this->pop) {
			// echo "savePop: $this->region $popu \n";
			$this->pop = $popu;
			$this->Save();
		}
	}

	function GetDailyNewCases() {
		$query = "select new_cases from covids where day<='{$this->day}' and region='".mysqli_real_escape_string($GLOBALS['DBH'],trim($this->region))."' and country='".mysqli_real_escape_string($GLOBALS['DBH'],trim($this->country))."' and region_type='".$this->region_type."' order by day desc limit 21";
		$result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryp failed: $query");
		$new_cases = array();
		while ($line = mysqli_fetch_assoc($result)) {
			array_push($new_cases, $line['new_cases'] ? $line['new_cases'] : 0);
		}
		return $new_cases;
	}

	function GetDailyInfectionDesnity() {
		$query = "select infection_density from covids where day<='{$this->day}' and region='".mysqli_real_escape_string($GLOBALS['DBH'],trim($this->region))."' and country='".mysqli_real_escape_string($GLOBALS['DBH'],trim($this->country))."' and region_type='".$this->region_type."' order by day desc limit 21";
		$result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryp failed: $query");
		$infection_density = array();
		while ($line = mysqli_fetch_assoc($result)) {
			array_push($infection_density, $line['infection_density'] ? $line['infection_density'] : 0);
		}
		return $infection_density;
	}

	function FillRatioPeak() {
		if (!$this->ratio) {
      			$query = "select cases,tested from covids where day<'{$this->day}' and region='".mysqli_real_escape_string($GLOBALS['DBH'],trim($this->region))."' and country='".mysqli_real_escape_string($GLOBALS['DBH'],trim($this->country))."' and region_type='".$this->region_type."' order by day desc limit 3";
			$result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryp failed: $query");
			$cases = array();
			$tested = array();
			while ($line = mysqli_fetch_assoc($result)) {
				array_push($cases,$line['cases']);
				array_push($tested,$line['tested']);
			}

			$ratio = 0;
			if ($cases[2]) {
				$ratio = round((pow($this->cases / $cases[2], .33333) - 1) * 100);
			} else if ($cases[1]) {
				$ratio = round((pow($this->cases / $cases[1], .5) - 1) * 100);
			} else if ($cases[0]) {
				$ratio = round((($this->cases / $cases[0]) - 1) * 100);
			}
			$this->ratio = $ratio;
			$this->new_cases = max(0, $this->cases - $cases[0]);
			if ($this->tested > 0) {
				$this->new_tested = max(0, $this->tested - $tested[0]);
				$this->positivity = $this->new_tested ? round(($this->new_cases / $this->new_tested) * 100) : 0; // daily positivity
			}
			$this->FillReopenData();
		} else {
			#echo "had ratio for $this->region : $this->ratio : $this->new_cases \n";
		}
		if (!$this->peak) {
			$this->peak = GetPeak($this->ratio,$this->cases);
		}
		$this->Save();
	}

	function FillReopenData() {
		$query = "select new_cases, positivity from covids where day<='{$this->day}' and region='".mysqli_real_escape_string($GLOBALS['DBH'],trim($this->region))."' and country='".mysqli_real_escape_string($GLOBALS['DBH'],trim($this->country))."' and region_type='".$this->region_type."' order by day desc limit 10";
		$result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryp failed: $query");
		$new_cases = array();
		$positivity = array();
		while ($line = mysqli_fetch_assoc($result)) {
			array_push($new_cases, intval($line['new_cases']));
			array_push($positivity, intval($line['positivity']));
		}

		$this->new_cases_day = 0;
		$this->cases_10 = 0;
		$this->$positivity_10 = 0;

		if (count($new_cases) > 0) {
			$cases_10 = array_sum($new_cases) + $this->new_cases; // new_cases not saved yet so add them here
			$new_cases_day = round($cases_10 / count($new_cases));
			$this->new_cases_day = $new_cases_day;
			$this->cases_10 = $cases_10;
			# echo "new cases day ($this->region): $this->new_cases_day \n";
		}

		if (count($positivity) > 0 && $this->positivity > 0) {
			$positivity_10 = array_sum($positivity) + $this->positivity; // positivity has not been saved yet, so add it here
			$this->positivity_10 = round($positivity_10 / count($positivity));
			if ($this->positivity_10 > 0) {
				$this->infection_density = round($this->new_cases * sqrt($this->positivity / $this->positivity_10));
			} else {
				$this->infection_density = $this->new_cases; // default to new_cases 
			}
			
		}
	}
}


####### functions ######

function AmountToNum($amount) {
        $amount = trim($amount);
        $amount = preg_replace('/,/','',$amount);
        if (strtolower(substr($amount,-1,1)) == 'k') {
               $amount = 1000*substr($amount,0,-1);
        }
        if (strtolower(substr($amount,-1,1)) == 'm') {
               $amount = 1000000*substr($amount,0,-1);
        }
	return $amount;
}

function AllCovidsByDay($day) {
	$query = "select * from covids where day='$day'";
	$result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryp failed: $query");
	$Ss = array();
	while ($line = mysqli_fetch_assoc($result)) {
		$S = new Covid;
		$S->Fill($line);
		array_push($Ss,$S);
	}
	return $Ss;
}

function FillInCountriesWorld($day) {
	# check if we already did this day?!
	$query = "select count(*) as done from covids where day='$day' and region='World'";
	$result = mysqli_query($GLOBALS['DBH'],$query) or die("Queryp failed: $query");
	while ($line = mysqli_fetch_assoc($result)) {
		if ($line['done']) {
			return;
		}
	}

	$tcases = array();
	$tpeak = array();
	$worldcases = 0;
	$worldpeak = 0;
	
	foreach (AllCovidsByDay($day) as $C) {
		$C->FillRatioPeak(); # do this to get peak for country and world.
		#china canada australia us we can just add the states up.
		if ($C->region_type != 'City' && $C->region_type != 'Counties' && ($C->country == 'USA' || $C->country == 'China' || $C->country == 'China' || $C->country == 'Australia')) { 
			$tcases[$C->country] += $C->cases;
			$tpeak[$C->country] += $C->peak;
			$worldcases += $C->cases;
			$worldpeak += $C->peak;
		}
		if ($C->region_type == 'Country') {
			$worldcases += $C->cases;
			$worldpeak += $C->peak;
		}
	}
	foreach ($tcases as $country => $cases) {
		$C = new Covid;
		$C->day = $day;
		$C->region = $country;
		$C->cases = $cases;
		$C->peak = $tpeak[$country];
		$C->region_type = 'Country';
		$C->country = $country;
		$C->Save();
		$C->FillRatioPeak(); # doesn't overwrite a peak or ratio already there.
	}
	$C = new Covid;
	$C->day = $day;
	$C->region = 'World';
	$C->country = 'World';
	$C->region_type = 'World';
	$C->cases = $worldcases;
	$C->peak = $worldpeak;
	$C->Save();
	$C->FillRatioPeak(); # doesn't overwrite a peak or ratio already there.
}

function GetPeak($ratio,$tot) {
        if ($ratio == 0) {
                return $tot;
        }
        if ($ratio < 6) { # josh added this?!
                return $tot*1.1;
        }
        if ($ratio < 11) {
                return $tot*1.25;
        }
        if ($ratio < 13) {
                return $tot*1.55;
        }
        if ($ratio < 16) {
                return $tot*2.5;
        }
        if ($ratio < 20) {
                return $tot*5;
        }
        if ($ratio < 21) {
                return $tot*8;
        }
        if ($ratio < 24) {
                return $tot*12;
        }
        if ($ratio < 26) {
                return $tot*14;
        }
        if ($ratio < 31) {
                return $tot*33;
        }
        return $tot*48; # or what?
}



function DaysToPeak($ratio) {
        if ($ratio == 0) {
                return 0;
        }
        if ($ratio < 6) { # josh added this?!
                return 3;
        }
        if ($ratio < 11) {
                return 5;
        }
        if ($ratio < 13) {
                return 6;
        }
        if ($ratio < 16) {
                return 7;
        }
        if ($ratio < 20) {
                return 11;
        }
        if ($ratio < 21) {
                return 14;
        }
        if ($ratio < 24) {
                return 15;
        }
        if ($ratio < 26) {
                return 17;
        }
        if ($ratio < 31) {
                return 20;
        }
	return 30; # or what?
}

function RoundSigDigs($number, $sigdigs) {
    if (!$number) {
        return 0;
    }
    $multiplier = 1;
    while ($number < 0.1) {
        $number *= 10;
        $multiplier /= 10;
    }
    while ($number >= 1) {
        $number /= 10;
        $multiplier *= 10;
    }
    return round(round($number, $sigdigs) * $multiplier);
}


?>
