import React, { FC } from "react";
import { Bar, Line } from "react-chartjs-2";
import { getDateParts, stringToInt } from "../../util/formatters";
import { CountriesItemRow } from "../CountriesTable";

interface ChartProps {
  title: string;
}

const formatChartData = ({
  newCasesAr = [],
  infectionDensityAr = [],
  region,
  date: dateStr,
  peakDays,
  ratio,
  infectionDensity
}: CountriesItemRow) => {
  let date = new Date(dateStr);
  date.setDate(date.getDate() - (newCasesAr.length - 1));
  let i = 0;
  const labels = [];
  const data = [];
  const infectionDensityData = [];
  console.log("infectionDensityAr", infectionDensityAr);
  for (i = newCasesAr.length - 1; i >= 0; i -= 1) {
    const { day, month } = getDateParts(date);

    // labels
    if (i === 0) {
      labels.push(`Today: ${month}-${day}`);
      data.push(newCasesAr[i]);

      infectionDensityData.push(infectionDensityAr[i] * 1000);
    } else {
      labels.push(`${month}-${day}`);
      data.push(newCasesAr[i]);
      infectionDensityData.push(infectionDensityAr[i] * 1000);
    }

    date.setDate(date.getDate() + 1);
  }

  let infectionDensityChart;
  if (infectionDensity) {
    infectionDensityChart = {
      label: "Infection Density",
      type: 'bar',
      cubicInterpolationMode: "monotone",
      fill: true,
      lineTension: 0.4,
      backgroundColor: "rgba(75, 91, 192, 0.3)",
      borderColor: "rgba(75, 91, 192, 0.8)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75, 91, 192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75, 91, 192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      spanGaps: true,
      yAxisID: 'y-axis-2',
      data: infectionDensityData,
    };
  }

  const datasets = [];
  datasets.push({
    label: "New Cases Per Day",
    type: 'line',
    cubicInterpolationMode: "monotone",
    fill: true,
    lineTension: 0.4,
    backgroundColor: "rgba(75,192,192,0.4)",
    borderColor: "rgba(75,192,192,1)",
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: "rgba(75,192,192,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(75,192,192,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    spanGaps: true,
    data,
  });

  if (infectionDensityChart) {
    datasets.push(infectionDensityChart);
  }

  return {
    labels,
    datasets,
  };
};

const Chart: FC<ChartProps> = ({ title, dayData }) => {
  const data = formatChartData(dayData);
  const options = {
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "New Cases Per Day"
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          },
          scaleLabel: {
            display: true,
            labelString: "Infection Density Per 1000"
          }
        }
      ]
    },
    responsive: true
    // maintainAspectRatio: false
  };

  return (
    <div className="chart">
      <h3>{title}</h3>
      <Line 
        data={data} 
        options={options} 
        width={500}
        height={document.body.clientWidth > 1200 ? 120 : document.body.clientWidth > 800 ? 180 : 120}
      />
    </div>
  );
};

export default Chart;
