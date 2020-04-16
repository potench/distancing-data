export const data = {
    datasets: [
        {
            label: 'Shelter-in-Place',
            type: 'line',
            lineTension: 0.1,
            data: [51, 65, 40, 49, 60, 37, 40, 51, 65, 40, 49, 60, 37, 40],
            fill: true,
            borderColor: 'rgb(73,164,219)',
            backgroundColor: 'rgb(73,164,219, .7)'
            // pointBorderColor: '#EC932F',
            // pointBackgroundColor: '#EC932F',
            // pointHoverBackgroundColor: '#EC932F',
            // pointHoverBorderColor: '#EC932F',
        },
        {
            type: 'line',
            label: 'Limited Action',
            lineTension: 0.1,
            data: [200, 185, 590, 621, 250, 400, 95, 200, 185, 590, 621, 250, 400, 95],
            fill: true,
            borderColor: 'rgb(254,194,29)',
            backgroundColor: 'rgba(254,194,29, .5)'
            // hoverBackgroundColor: '#71B37C',
            // hoverBorderColor: '#71B37C',
        }
    ]
};
