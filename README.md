ONE TIME SETUP:
make a mysql db with the table covids defined in mysql.txt.
update covid.php with the mysqldbname and password at the top.
Then prefill the mysql db with at least the last three days of data by downloading the last three .csv files from
https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports
and running (for example)
php parse.php 03-30 | mysql mydqldbname
php parse.php 03-31 | mysql mydqldbname
php parse.php 04-01 | mysql mydqldbname

If you want to parse csv files from 03-22-2020.csv and earlier, use stateparse.php instead of parse.php (same syntax otherwise).

If you want to update/fix any city/county population data or dates they started social distancing, just update the tab-delimited files that look like "city-pop-dates.txt"

DAILY:

around 5:30pm each day, download the newest csv file from that site (I used wget)
... make sure it's got the US (county) data, sometimes that comes in an hour or two later.. so it may be safer to wait until 8pm?!

then every day run
php parse.php 04-02 | mysql mysqldbname
.. but replace 04-02 with today's month-day.

then run:
php generate.php 04-02

then visit:
https://distancingdata.org/2020-04-02.html
... and check if it looks fine!


Assuming it does, you can copy it live with:
cp 2020-04-02.html index.html


## Notes

Bootstrap all data 
```
$ ./run.sh --database potench --complete true
```

Parse 
```
$ ./run.sh --database potench --parser parse --date 03-31
```

Generate 
```
$ ./run.sh --database potench --parser generate --date 03-31
```

Old Parse for < 03-22
```
$ ./run.sh --database potench --parser stateparse --date 03-22
```
