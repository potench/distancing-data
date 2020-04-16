import {FC} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import statesColumns from '../data/statesColumns';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import Chart from './Chart/Chart';

interface StatesTableProps {
    tableData: Array<StatesItemRow>;
}

export type StatesItemRow = {
    key?: number;
    state: string;
    confirmed: number;
    newCases: number;
    deaths: number;
    newDeaths: number;
    growth: number;
    peakCases: string;
    peakDays: string;
    icuBeds: number;
};

const StatesTable: FC<StatesTableProps> = ({tableData}) => {
    const statesRowRenderer = (row: StatesItemRow) => <Chart title={row.state} />;

    const expandRow = {
        renderer: statesRowRenderer
    };

    const {SearchBar} = Search;

    const defaultSorted = [
        {
            dataField: 'confirmed',
            order: 'desc'
        }
    ];

    return (
        <ToolkitProvider keyField="state" data={tableData} columns={statesColumns} search>
            {(props: {searchProps: any; baseProps: any}) => (
                <div>
                    <h5>Search by US State:</h5>
                    <SearchBar {...props.searchProps} />
                    <div style={{
                        overflow: 'auto'
                    }}>
                        <BootstrapTable
                            {...props.baseProps}
                            striped
                            hover
                            bordered={false}
                            expandRow={expandRow}
                            defaultSorted={defaultSorted}
                        />
                    </div>
                </div>
            )}
        </ToolkitProvider>
    );
};

export default StatesTable;
