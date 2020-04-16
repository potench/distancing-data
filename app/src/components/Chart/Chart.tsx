import React, {FC} from 'react';
import {Line} from 'react-chartjs-2';
import {getDateParts, stringToInt} from '../../util/formatters';
import {CountriesItemRow} from '../CountriesTable';

interface ChartProps {
    title: string;
}

const formatChartData = ({casesTenDays, confirmedTotalCases, date: dateStr, estDaysToReopen, newCases: newCasesStr, peakDays, peakCases, population, ratio}: CountriesItemRow) => {
    let date  = new Date(dateStr);
    const multiplier = 10000;
    const decay = 0.96; // 0.94777; //daily decay based on Italy data (we drop by a factor of FIVE each 30 days);
    let maxGrowth = 1 + (ratio / 100); // assume you've reach max growth, what if you haven't? then you need to calculate growth
    const growthDecay = maxGrowth / peakDays;
    let newCases = stringToInt(newCasesStr);
    let i = 0;

    const labels = [];
    const data = [];

    const idealCaseDensity = .1 / 1000; // .1 cases per 1000 people
    const actualCaseDensity = (stringToInt(casesTenDays) / stringToInt(population));
    const estPeakCaseDensity = (casesTenDays * (stringToInt(peakCases) / stringToInt(confirmedTotalCases))) / stringToInt(population);
    
    for (let i = 0; i <= estDaysToReopen; i += 1) {
        date.setDate(date.getDate() + 1);
        const {day, month} = getDateParts(date);

        // labels
        if (i === 0) {
            labels.push(`Today: ${month}-${day}`);
            data.push(Math.round(actualCaseDensity * multiplier));
        } else if (i === peakDays) {
            labels.push(`Peak: ${month}-${day}`);
            data.push(Math.round(estPeakCaseDensity * multiplier));// should hit growth 
        } else if (i === estDaysToReopen) {
            labels.push(`Reopen: ${month}-${day}`);
            data.push(Math.round(idealCaseDensity * multiplier));
        } else {
            labels.push(`${month}-${day}`);
            data.push(null); // span gaps
        } 
    }

    return {
        labels,
        datasets: [
            {
                label: 'Estimated time to Reopen',
                scaleLabel: {
                    labelString: 'wut'
                },
                cubicInterpolationMode: 'monotone',
                fill: false,
                lineTension: .4,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                spanGaps: true,
                data
            }
        ]
    }
}

const Chart: FC<ChartProps> = ({title, dayData}) => {
    const data = formatChartData(dayData);
    const options = {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Cases per 10k People'
                }
            }],
        },
        responsive: true
    }

    return (
        <div className="chart">
            <h3>{title}</h3>
            <Line 
                data={data}
                options={options}
                width={500}
            />
        </div>
    );
};

export default Chart;
