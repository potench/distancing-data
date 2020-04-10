#!/bin/bash

complete=${complete} # runs all csvs
date=${date}
database=${database}
fetch=${fetch}
json=${json}
reset=${reset}

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
            generate_json $datepart
        else 
            run_insert $datepart $parser
            generate_html $datepart
        fi
    done
}

run_insert() {
    datepart=$1
    parser=$2
    
    
    echo "  >   INSERTING MySQL: php $parser.php $datepart | mysql $database"

    sqlout=`php $parser.php $datepart`
    echo "$sqlout" > output.txt
    echo "$sqlout" | mysql $database
}

generate_html() {
    datepart=$1
    echo "  >   GENERATING HTML: php generate.php $datepart"
    htmlout=`php generate-html.php $datepart`
    echo "$htmlout" > output.txt
    echo "$htmlout"
}

generate_json() {
    datepart=$1
    echo "  >   GENERATING JSON: $datepart";
    htmlout=`php generate-json.php $datepart`
    echo "      > $htmlout"
}

if [ "$reset" = "true" ]; then
    echo 'DROP TABLE IF EXISTS `covids`;' | mysql $database
    echo `cat ./mysql.txt` | mysql $database
elif [ "$fetch" = "true" ]; then 
    echo "fetching latest $date-2020.csv"
    status=`curl --write-out %{http_code} --silent --output /dev/null https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/$date-2020.csv`
    if [ "$status" = "404" ]; then 
        echo "-------------------------"
        echo "ERROR:: "
        echo "  >   https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/$date-2020.csv Does not exist"
        echo "  >   Try again later"
        echo "-------------------------"
    else         
        curl -o ./csv/new/$date-2020.csv https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/$date-2020.csv
        run_insert $date 'parse'
        generate_html $date
        generate_json $date
    fi
elif [ "$complete" = "true" ]; then
    echo "Resetting covids table and running all cvs and json - this will take a minute"
    echo "delete from covids;" | mysql $database

    run_complete 'old' 'stateparse'
    run_complete 'new' 'parse'

    run_complete 'old' 'json'
    run_complete 'new' 'json'
elif [ "$parser" = "json" ]; then 
    if [ "$date" ]; then
        generate_json $date
    else
        echo "compiling all json - this will take a minute"
        run_complete 'old' 'json'
        run_complete 'new' 'json'
    fi
elif [ "$date" != "" ]; then
    if [[ "$parser" =  "stateparse" ]]; then
        run_insert $date 'stateparse'
    else
        run_insert $date 'parse'
    fi

    generate_html $date
    generate_json $date
fi
