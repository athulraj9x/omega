import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ChartView = ({filteredResultData,label}) => {
    const [chartData, setChartData] = useState([]);
    const [keys, setKeys] = useState([]);

    function removeLastPart(str) {
        const lastIndex = str.lastIndexOf(' > ');
        if (lastIndex !== -1) {
          return str.substring(0, lastIndex);
        }
        return str;
      }

    useEffect(() => {
        setChartData(filteredResultData);
        const extractedTypes = filteredResultData.map(item => item.type);
        const extractedTotalPLs = filteredResultData.map(item => item.totalPL);
        setKeys(extractedTypes);
        setChartData(extractedTotalPLs);
      }, []);


  const data = {
    labels: keys,
    datasets: [{
      label: removeLastPart(label),
      data: chartData,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Analysis Market',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartView;