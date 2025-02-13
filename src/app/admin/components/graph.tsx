"use client"
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TooltipItem } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesGraph = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: [2000, 1800, 2200, 2500, 2700, 3200, 3500, 3000, 2800, 3300, 4000, 4200],
        borderColor: '#23856D',
        backgroundColor: 'rgba(35, 133, 109, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#fff',
        pointHoverBackgroundColor: '#23856D',
        pointBorderColor: '#23856D',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Sales Overview',
        font: { size: 16, weight: 'bold' as const },
        padding: 20,
        color: '#252B42',
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#252B42',
        bodyColor: '#252B42',
        bodyFont: { size: 14 },
        padding: 12,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(tooltipItem: TooltipItem<'line'>) {
            return `$${(tooltipItem.raw as number).toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#737373',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          color: '#737373',
          callback: function(tickValue: number | string) {
            return `$${Number(tickValue).toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm h-[400px]"
    >
      <Line data={data} options={options} />
    </motion.div>
  );
};

export default SalesGraph;

