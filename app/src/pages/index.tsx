import React, {useEffect, useState} from 'react';
import {Link} from 'gatsby';
import * as d3 from 'd3';

import Layout from '../components/Layout';
import {Container, Row, Col} from 'react-bootstrap';
import TopSection from '../components/TopSection';
import CountriesTable, {CountriesItemRow} from '../components/CountriesTable';
import {COVID_API_BASE_URL} from '../data/config';
import {getPeakDays} from '../data/fetchData';
import SEO from '../components/Seo';
import {getDateParts} from '../util/formatters';

import '../constants';

type DayDataType = {
    day: number;
    month: number;
    year: number;
    dayData: object;
};

const getData = async (tries = 0, byDateStr?: string): DayDataType => {
    if (tries > 5) {
        throw new Error(`Cant't find day-data`);
    }

    let date = byDateStr ? new Date(byDateStr) : new Date();
    date.setDate(date.getDate() - tries);

    const {day, month, year} = getDateParts(date);

    try {
        const dayData = await fetch(`days/${year}-${month}-${day}.json`).then(response => response.json());
        return {
            date,
            day,
            month,
            year,
            dayData
        };
    } catch (e) {
        return getData(tries + 1, byDateStr);
    }
};

const getDateSelectAr = (currentDay: Date) => {
    const datesAr = [];
    const firstDay = new Date(`2020-01-22`);
    let daySelect = currentDay;

    while (daySelect > firstDay) {
        const {day, month, year} = getDateParts(daySelect);
        datesAr.push(`${year}-${month}-${day}`);
        daySelect.setDate(daySelect.getDate() - 1);
    }

    return datesAr;
};

const fetchData = async ({currentDateSelectStr}) => {
    const {date, day, month, year, dayData}: DayDataType = await getData(0, currentDateSelectStr);
    const itemRows: Array<CountriesItemRow> = [];
    Object.values(dayData).forEach((item: any, key: number) => {
        const {
            region,
            type,
            pop = 0,
            cases,
            casesTenDays = 0,
            newCases,
            newCasesDay,
            ratio,
            schoolClosed,
            physDist,
            peak,
            estBedShort,
            estDaysPeak
        } = item;
        if (region && type && pop) {
            const estBeds = parseInt(pop) / 10000;
            const estPeakBeds = parseInt(peak) / 10;
            const estBedShortage = pop ? Math.floor(estBeds - estPeakBeds) : '';
            const estBedShortageRatio = pop ? Math.round((estPeakBeds / estBeds) * 100) / 100 : 0;

            const idealCaseDensity = 0.1 / 1000; // .1 cases per 1000 people
            const actualCaseDensity = casesTenDays / parseInt(pop);
            const ratioCaseDensity = actualCaseDensity / idealCaseDensity;

            // The projection, EARLY, based on Italy, is that we drop by a factor of FIVE each 30 days. Or, multiply active cases by 0.94777 each day to get the active cases the following day.
            let daysToReopen = (30 * Math.log(ratioCaseDensity)) / Math.log(5.0);

            if (daysToReopen < 0) {
                // if negative, then jump to the peak
                const peakRatioCaseDensity = peak / parseInt(pop) / idealCaseDensity;
                daysToReopen = (30 * Math.log(peakRatioCaseDensity)) / Math.log(5.0);
            }

            const estDaysToReopen = Math.max(0, Math.round(parseInt(estDaysPeak || 0, 10) + daysToReopen));

            const countryData: CountriesItemRow = {
                key,
                date: `${year}-${month}-${day}`,
                region,
                type,
                population: pop ? parseInt(pop).toLocaleString() : '',
                confirmedTotalCases: parseInt(cases).toLocaleString(),
                currentDailyGrowth: ratio,
                dateSchoolsClosed: schoolClosed || '',
                dateDistancingEnforced: physDist || '',
                peakCases: parseInt(peak).toLocaleString('en', {maximumFractionDigits: 0}),
                newCases,
                newCasesDay,
                casesTenDays,
                pop,
                ratio,
                estBedShortage,
                estBedShortageRatio,
                peakDays: getPeakDays(ratio),
                estDaysToReopen
            };

            itemRows.push(countryData);
        }
    });
    return {
        day,
        month,
        year,
        date,
        itemRows
    };
};

const IndexPage = () => {
    const [tableData, setTableData] = useState<Array<CountriesItemRow>>([]);
    const [dateStr, setDateStr] = useState<String>('');
    const [dateDisplay, setDateDisplay] = useState<String>('');
    const [dateSelect, setDateSelect] = useState<Array<String>>([]);
    const [currentDateSelectStr, setCurrentDateSelectStr] = useState<String>('');

    const updateTableData = async () => {
        const {year, month, day, date, itemRows} = await fetchData({
            currentDateSelectStr
        });
        setTableData(itemRows);

        const todayDateStr = `${year}-${month}-${day}`;
        setDateStr(todayDateStr);

        const formattedDateDisplay = `${new Date(`${todayDateStr}`).toLocaleString('default', {
            month: 'long'
        })} ${day}, ${year}`;
        setDateDisplay(formattedDateDisplay);

        // ga('set', 'dimension1', todayDateStr);

        if (!dateSelect.length) {
            setDateSelect(getDateSelectAr(date));
        }
    };

    const onSelectDate = event => {
        const {target: {value: dateStr} = {}} = event || {};
        setDateDisplay('');
        setCurrentDateSelectStr(dateStr);

        ga('set', 'dimension1', dateStr);

        gtag('event', 'onSelectDate', {
            event_label: dateStr
        });
    };

    useEffect(() => {
        updateTableData();
    }, [currentDateSelectStr]);

    return (
        <Layout>
            <SEO
                title="Daily infection counts, rates, and predictions for the covid-19 coronavirus by region."
                description="Global and Local Live Updates Covid-19 / Coronavirus Case Information"
            />
            <Container fluid className="py-3 px-1 no-gutters">
                <Row className="py-3 px-3 no-gutters">
                    <Col>
                        <TopSection dateDisplay={dateDisplay} />
                    </Col>
                </Row>
                <Row className="no-gutters">
                    <Col className="px-0">
                        <CountriesTable
                            tableData={tableData}
                            dateSelect={dateSelect}
                            onSelectDate={onSelectDate}
                            dateStr={dateStr}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default IndexPage;
