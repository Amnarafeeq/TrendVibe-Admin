"use client"
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TooltipItem } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesGraph = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [2000, 1800, 2200, 2500, 2700, 3200, 3500, 3000, 2800, 3300, 4000, 4200], // Replace with actual data
        borderColor: '#23856D',
        backgroundColor: '#23856D',
        fill: false,
        tension: 0.5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales Overview',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<'line'>) {
            return '$' + (tooltipItem.raw as number).toString();
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sales ($)',
        },
        ticks: {
          beginAtZero: true,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <div className="sales-graph-container h-full w-full bg-white p-6 rounded shadow-md mt-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesGraph;
