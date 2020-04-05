#!/bin/bash

complete=${complete} # runs all csvs
date=${date}
database=${database}
fetch=${fetch}
json=${json}

while [ $# -gt 0 ]; do
   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi
  shift
done

if [[ $database =  "" ]]; then
    echo "Please provide --database argument"
    exit 1
fi

echo "Using database: $database"

run_complete() {
    directory=$1
    parser=$2

    csvs=($(ls -p ./csv/$directory/ | grep -v /))
    echo "======== $directory + $parser ========"
    for i in "${csvs[@]}"
    do  
        # grab date part
        filename=(`echo $i | sed -En 's/[^0-9]*([0-9]{1,})[^0-9]*/\1 /gp'`) 
        datepart="${filename[0]}-${filename[1]}"

        if [ "$parser" = "json" ]; then
            run_json $datepart
        else 
            run_insert $datepart $parser
            run_generate $datepart
        fi
    done
}

run_insert() {
    datepart=$1
    parser=$2
    
    
    echo "  >   INSERTING: php $parser.php $datepart | mysql $database"

    sqlout=`php $parser.php $datepart`
    echo "$sqlout" > output.txt
    echo "$sqlout" | mysql $database
}

run_generate() {
    datepart=$1
    echo "  >   GENERATING: php generate.php $datepart"
    htmlout=`php generate.php $datepart`
    echo "$htmlout" > output.txt
    echo "$htmlout"
}

run_json() {
    datepart=$1
    echo "  > GENERATE JSON: $datepart";
    htmlout=`php generate-json.php day $datepart`
    echo "      > $htmlout"
}

if [ "$fetch" = "true" ]; then 
    echo "fetching latest $date-2020.csv"
    curl -o ./csv/new/$date-2020.csv https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/$date-2020.csv
    run_insert $date 'parse'
    run_generate $date
elif [ "$complete" = "true" ]; then
    echo "Running all cvs and json - this will take a minute"
    run_complete 'old' 'stateparse'
    run_complete 'new' 'parse'

    run_complete 'old' 'json'
    run_complete 'new' 'json'
elif [ "$parser" = "json" ]; then 
    if [ "$date" ]; then
        run_json $date
    else
        echo "compiling all json - this will take a minute"
        run_complete 'old' 'json'
        run_complete 'new' 'json'
    fi
elif [ "$date" != "" ]; then
    if [[ "$parser" =  "generate" ]]; then
        run_generate $date
    else
        run_insert $date $parser
        run_generate $date
    fi
fi
