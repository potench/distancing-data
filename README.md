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

## Setup

### Create Database Locally

```shell
mysql -u root # login to mysql

LIST DATABASES; # you have a DB you already want to use or you want to create one?

CREATE DATABASE covids; # create a new DB

USE covids # use this db

CREATE TABLE `covids` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `region` char(64) NOT NULL,
  `cases` int(11) NULL DEFAULT 0,
  `ratio` tinyint(4) NULL DEFAULT 0,
  `peak` int(11) NULL DEFAULT 0,
  `country` char(64) NOT NULL,
  `region_type` char(16) NOT NULL,
  `deaths` int(11) NULL DEFAULT 0,
  `recovers` int(11) NULL DEFAULT 0,
  `new_cases` int(11) NULL DEFAULT 0,
  `pop` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `day` (`day`),
  KEY `state` (`region`),
  KEY `cases` (`cases`),
  KEY `growth` (`ratio`),
  KEY `peak` (`peak`),
  KEY `country` (`country`),
  KEY `region_type` (`region_type`),
  KEY `deaths` (`deaths`),
  KEY `recovers` (`recovers`),
  KEY `new_cases` (`new_cases`)
) ENGINE=InnoDB AUTO_INCREMENT=43841 DEFAULT CHARSET=latin1;

```

### Use run.sh script

#### Runs parse, generate, generate-json on everything

```
$ ./run.sh --database covids --complete true
```

#### Fetch data by date; then runs parse, generate. generate-json on that day

```
$ ./run.sh --database covids --fetch true --date 03-31
```

#### Generate data by date

```
$ ./run.sh --database covids --parser generate --date 03-31
```

#### Generate JSON data < 03-22

```
$ ./run.sh --database covids --parser json --date 03-22
```

#### Old Parse to generate data < 03-22

```
$ ./run.sh --database covids --parser stateparse --date 03-22
```
