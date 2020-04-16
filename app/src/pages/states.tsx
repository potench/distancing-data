import React, {useEffect, useState} from 'react';
import fetch from 'node-fetch';
import Layout from '../components/Layout';
import {Container, Row, Col} from 'react-bootstrap';
import TopSection from '../components/TopSection';
import StatesTable, {StatesItemRow} from '../components/StatesTable';
import SEO from '../components/Seo';

import {COVID_API_BASE_URL} from '../data/config';
import {getPeakDays, getPeakCases} from '../data/fetchData';

const StatesPage = () => {
    const [tableData, setTableData] = useState<Array<StatesItemRow>>([]);

    useEffect(() => {
        fetch(COVID_API_BASE_URL.concat('states'))
            .then(res => res.json())
            .then(data => {
                const itemRows: Array<StatesItemRow> = [];
                data.forEach((item: any, key: number) => {
                    const growth = item.todayCases / (item.cases - item.todayCases);
                    // const icuBeds = item.casesPerMil - peakCases(growth, item.cases);
                    const icuBeds = 1000;
                    const statesData: StatesItemRow = {
                        key,
                        state: item.state,
                        confirmed: item.cases,
                        newCases: item.todayCases,
                        deaths: item.deaths,
                        newDeaths: item.todayDeaths,
                        growth,
                        peakCases: getPeakCases(growth, item.cases).toLocaleString('en', {maximumFractionDigits: 0}),
                        peakDays: getPeakDays(growth),
                        icuBeds
                    };
                    itemRows.push(statesData);
                });
                setTableData(itemRows);
            });
    }, []);

    return (
        <Layout>
            <SEO 
                title="Daily infection counts, rates, and predictions for the covid-19 coronavirus by region."
                description="Global and Local Live Updates Covid-19 / Coronavirus Case Information"
            />
            <Container fluid className="px-5 py-3">
                <Row className="py-3">
                    <Col>
                        <TopSection />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <StatesTable tableData={tableData} />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default StatesPage;
