## Data For https://distancingdata.org

Days until reopening assumes (1) limited re-opening will be possible when the number of active cases is 1 per 10,000 people or less, and (2) the availability of widespread testing and contact tracing. Peak estimates are based on [Dave Blake Jr.'s](https://www.facebook.com/blakestah) work. See this [post](https://medium.com/@dblake.mcg/estimating-peak-covid19-infection-rates-950c7f3cfc1a?sk=12e76358dedf8294e01e247e2c663bde). Estimated ICU beds assume 1 bed per 10,000 people, and 10% of cases will need one.

The real-time nature of this event means we cannot promise our estimates are accurate. Data is pulled daily from https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports.

## Local Development Setup

Use the provided `./run.sh` shell script to create and populate a local MySQL database, to generate the old site's HTML, and to generate JSON use on https://distancingdata.org.

See `./output.txt` to review the MySQL commands that were last run.

- `--database` String, which database to use, run `SHOW DATABASES;` to see a list
- `--reset` Boolean, true to empty/create the `covids` table
- `--json` Boolean, true to output JSON
- `--date` String format `mm-dd`, date to perform action on
- `--fetch` Boolean, true to fetch, insert, generate-html, generate-json for that day
- `--parser` String, `stateparse` or `parse` to switch between old and new parsing < 03-22

### Create Database Locally

Creates (or empties) a `covids` table in the `--database` you provide.

```
$ ./run.sh --database corona_data --reset true
```

### Populate Table with All CSV data

Runs parse (or stateparse), generate-HTML, and generate-JSON on each CSV filling your database sequentially.
It is recommended to run `--reset true` above followd by `--complete true` below to ensure the calculated output remains consistent.

```
$ ./run.sh --database corona_data --complete true # does a complete run
```

### Fetch data by date

Fetches CSV data from https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports, then runs parse+insert, generate-html, and generate-json to append the data to existing set.

Data is updated around 5:30pm PST each day.
Make sure it's got the US (county) data, sometimes that comes in an hour or two later.. so it may be safer to wait until 8pm PST

You can just rerun it and it will overwrite any existing day-data.

```
$ ./run.sh --database corona_data --fetch true --date 04-10
```

### Parse CSV and Insert Into the Table by Date

Parse+inserts data by date into the database, generates old html and generates json. Overwrites existing data for the day

```
$ ./run.sh --database corona_data --date 03-31
```

### Generate JSON by Date

Generates JSON for the date provided

```
$ ./run.sh --database corona_data --parser json --date 03-22
```

Generates JSON for all dates

```
$ ./run.sh --database corona_data --parser json
```

#### Old Parse to generate HTML data < 03-22

```
$ ./run.sh --database corona_data --parser stateparse --date 03-22
```

## Population Data

Check `./missing-pop.txt` to see which regions are missing population data. You can add missing population data to `./output.txt`. You will need to run the following after a population update

```
$ ./run.sh --database corona_data --reset true
$ ./run.sh --database corona_data --complete true
```

If you want to update/fix any city/county population data or dates they started social distancing, just update the tab-delimited files that look like "city-pop-dates.txt".

## Notes

- Running `generate-html.php` generates HTML for the old site, but it also calculates ICU beds and other important data so you need to run this after running `parse.php` in order by Day sequentially.
- `missing-pop.txt` contains regions we are currently missing population data - feel free to manually add rows to `other-pop.txt` to help fill these out.
- Much of the original source code here was provided by Josh Jones, Michael Blend, and Dave Blake - so thanks.
- https://distancingdata.org frontend is managed in a separate private repository - let me know if you want the source code. I will move it over to this repo eventually.

## FAQ

MySQL is giving me trouble, I'm getting errors like "Can’t connect to local MySQL server through socket ‘/tmp/mysql.sock", how do setup mysql from scratch?

```sh
# remove mysql first
$ brew remove mysql
$ rm -rf

# reinstall
$ brew install mysql
$ mysql.server start

# setup mysql
$ echo $USER # remember this, let's use this as your mysql user, replace 'myuser' with it below
$ mysql -u root
```

```sql
 > SHOW DATABASES;
 > CREATE DATABASE `corona_data`;
 > CREATE USER 'myuser'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
 > GRANT ALL PRIVILEGES ON * . * TO 'myuser'@'localhost';
 > FLUSH PRIVILEGES;
 > \q
```

```sh
# setup the table
$ ./run.sh --reset true --database corona_data
$ ./run.sh --complete true --database corona_data
```
