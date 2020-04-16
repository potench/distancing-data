import {stringToInt} from '../util/formatters';

interface ColumnsData {
    dataField: string;
    text: string;
    sort: boolean;
    align: 'left' | 'center' | 'right';
    formatter?: (cell: any, row?: any) => void;
}
const na = (cellContent: number, {ratio}) => {
    if (!cellContent && ratio > 0) {
        return (
            <abbr title="Not Applicable">NA</abbr>
        );
    }
    return cellContent;
}

const growthFormatter = (cell: number) => {
    return `${(cell * 100).toFixed(2)}%`;
};

const bedShortageFormatter = (cellContent: number, {population, estBedShortageRatio}) => {
    const popNum = stringToInt(population);
    if (!population) {
        return '';
    } else if (estBedShortageRatio <= 0.8) {
        return 'no-shortage'
    } else if (estBedShortageRatio >= 1.5) {
        return 'shortage';
    }
    return 'maybe-shortage';
};

const currentDailyGrowthFormatter = (cellContent: number, {currentDailyGrowth}) => {
    if (currentDailyGrowth >= 33) {
        return 'danger';
    }
    if (currentDailyGrowth >= 20) {
        return 'warning';
    }

    if (currentDailyGrowth <= 10) {
        return 'ok';
    }
};
const withCommas = (cellContent: number) => cellContent.toLocaleString();
const withPercent = (cellContent: number) => `${cellContent}%`;
const sortWithCommas = (a = '', b = '', order) => {
    try {
        const aNum = stringToInt(a);
        const bNum = stringToInt(b);
        if (order === 'asc') {
            return aNum - bNum; // desc
        }
        return bNum - aNum;
    } catch (e) {
        console.log('sort', a, b, e)
    }
};
const sortPercent = (a: string, b: string, order) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);

     if (order === 'asc') {
        return aNum - bNum; // desc
    }
    return bNum - aNum;
};

const countriesColumns: Array<ColumnsData> = [
    {
        dataField: 'region',
        text: 'Region',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'date',
        text: 'Date',
        hidden: true,
    },
    {
        dataField: 'type',
        text: 'Type',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'population',
        text: 'Population',
        sort: true,
        align: 'left',
        sortFunc: sortWithCommas
    },
    {
        dataField: 'confirmedTotalCases',
        text: 'Confirmed Total Cases',
        sort: true,
        align: 'left',
        sortFunc: sortWithCommas
    },
    {
        dataField: 'currentDailyGrowth',
        text: 'Current Daily Growth',
        sort: true,
        classes: currentDailyGrowthFormatter,
        formatter: withPercent,
        align: 'center',
        sortFunc: sortPercent
    },
    {
        dataField: 'dateSchoolsClosed',
        text: 'Days Since Schools Closed',
        sort: true,
        align: 'left',
        hidden: true,
    },
    {
        dataField: 'dateDistancingEnforced',
        text: 'Days Since Physical Distancing',
        sort: true,
        align: 'left',
        hidden: true,
    },
    {
        dataField: 'peakCases',
        text: 'Est Peak Cases',
        sort: true,
        align: 'left',
        sortFunc: sortWithCommas
    },
    {
        dataField: 'newCases',
        text: 'New Cases',
        hidden: true
    },
    {
        dataField: 'newCasesDay',
        text: 'New Cases Per Day',
        hidden: true
    },
    {
        dataField: 'casesTenDays',
        text: 'Cases Total Last 10 Days',
        hidden: true
    },
    {
        dataField: 'pop',
        text: 'Population Number',
        hidden: true
    },
    {
        dataField: 'ratio',
        text: 'Growth Rate',
        hidden: true
    },
    {
        dataField: 'estBedShortage',
        text: 'Est Spare ICU Beds',
        sort: true,
        align: 'left',
        classes: bedShortageFormatter,
        formatter: withCommas,
        sortFunc: sortWithCommas
    },
    {
        dataField: 'peakDays',
        text: 'Est Days to Peak Cases',
        sort: true,
        align: 'left'
    },
    {
        dataField: 'estDaysToReopen',
        text: 'Est Days to Reopen',
        sort: true,
        formatter: na,
        align: 'left'
    }
];

export default countriesColumns;
