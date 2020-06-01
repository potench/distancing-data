import React, {FC, useState} from 'react';
import {Card, Col, Container, Form, Row} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import countriesColumns from '../data/countriesColumns';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import Chart from './Chart/Chart';
import CaseChart from './Chart/CaseChart';
import SearchButton from './SearchButton';

interface CountriesTableProps {
    tableData: Array<CountriesItemRow>;
}

export type CountriesItemRow = {
    key: number;
    date: string;
    region: string;
    confirmed: number;
    newCases: number;
    casesPerMil: number;
    deathsPerMil: number;
    growth: number;
    peakCases: string;
    peakDays: string;
    icuBeds: number;
};

const rowRenderer = (row: CountriesItemRow) => {
    const {estDaysToReopen} = row;
    const estimatedChart = estDaysToReopen ? (
            <Chart title={`${row.region}: Estimated Reopen Date`} dayData={row} />
        ) : '';

    return (
        <>
            <CaseChart title={`${row.region}: New Cases Per Day`} dayData={row} />
        </>
    );
};

const getExpandRow = tableData => {
    const startExpanded = tableData.find(({region}) => region === 'USA');
    return {
        renderer: rowRenderer,
        onlyOneExpanding: true,
        parentClassName: 'expanded',
        expanded: startExpanded ? [startExpanded.key] : []
        // nonExpandable: tableData.filter(({estDaysToReopen}) => parseInt(estDaysToReopen) === 0).map(({key}) => key)
    };
};

const defaultSorted = [
    {
        dataField: 'population',
        order: 'desc'
    }
];

const CountriesTable: FC<CountriesTableProps> = ({tableData, dateSelect, onSelectDate, dateStr}) => {
    return (
        <ToolkitProvider keyField="key" data={tableData} columns={countriesColumns} search>
            {(props: {searchProps: any; baseProps: any}) => (
                <Card fluid="true" className="main">
                    <Card.Header className="main-header">
                        <Row>
                            <Col>
                                <SearchButton {...props.searchProps} dateStr={dateStr} />
                                <p className="py-2 small">
                                    Try searching for "China", "Los Angeles", "City", "New York", etc..
                                </p>
                            </Col>
                            <Col>
                                <Form.Control as="select" size="md" defaultValue="0" onChange={onSelectDate}>
                                    {dateSelect &&
                                        dateSelect.map((dateStr, index) => <option key={index}>{dateStr}</option>)}
                                </Form.Control>
                                <p className="py-2 small">Select Date</p>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body className="main-body py-0 px-1">
                        <Row className="no-gutters">
                            <Col>
                                <Container
                                    fluid
                                    className="px-0"
                                    style={{
                                        overflow: 'auto'
                                    }}
                                >
                                    <BootstrapTable
                                        {...props.baseProps}
                                        bootstrap4
                                        striped
                                        hover
                                        bordered={false}
                                        expandRow={getExpandRow(tableData)}
                                        defaultSorted={defaultSorted}
                                        loading={!!tableData}
                                    />
                                </Container>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </ToolkitProvider>
    );
};

export default CountriesTable;
