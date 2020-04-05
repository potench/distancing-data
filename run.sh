#!/bin/bash

complete=${complete} # runs all csvs
date=${date}
database=${database}


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
        run_insert $parser $datepart
        run_generate
    done
}

run_insert() {
    parser=$1
    datepart=$2
    
    echo "  >   INSERTING: php $parser.php $datepart | mysql $database"

    sqlout=`php $parser.php $datepart`
    echo "$sqlout" > output.txt
    echo "$sqlout" | mysql $database
}

run_generate() {
    echo "  >   GENERATING: php generate.php $datepart"
    htmlout=`php generate.php $datepart`
    echo "$htmlout" > output.txt
    echo "$htmlout"
}

if [ "$complete" = "true" ]; then
    echo "Running all cvs - this will take a minute"
    run_complete 'old' 'stateparse'
    run_complete 'new' 'parse'
elif [ "$date" != "" ]; then
    if [[ "$parser" =  "generate" ]]; then
        run_generate $date
    else
        run_insert $parser $date
        run_generate $date
    fi
fi
