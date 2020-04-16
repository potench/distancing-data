interface ColumnsData {
    dataField: string;
    text: string;
    sort: boolean;
    align: 'left' | 'center' | 'right';
    formatter?: (cell: number, row?: any) => void;
}

const growthFormatter: ColumnsData['formatter'] = cell => {
    return `${(cell * 100).toFixed(2)}%`;
};

const statesColumns: Array<ColumnsData> = [
    {
        dataField: 'state',
        text: 'State',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'confirmed',
        text: 'Confirmed (total)',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'newCases',
        text: 'New (today)',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'deaths',
        text: 'Deaths (total)',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'newDeaths',
        text: 'Deaths (today)',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'growth',
        text: 'Daily Growth Rate',
        sort: true,
        align: 'left',
        formatter: growthFormatter
    },
    {
        dataField: 'peakCases',
        text: 'Projected Peak Cases',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'peakDays',
        text: 'Days to Projected Peak Cases',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'icuBeds',
        text: 'Projected Available ICU Beds at Peak',
        sort: true,
        align: 'left'
    }
];

export default statesColumns;
