import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

/**
 * PolarChart Component for AI Learning Visualization
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array with labels and values
 * @param {string} props.title - Chart title
 * @param {Object} props.options - Additional chart options
 */
const PolarChart = ({ data = [], title = "AI Learning Progress", options = {} }) => {
  // Default colors for the chart segments
  const defaultColors = [
    'rgba(107, 107, 236, 0.8)', // Primary theme color
    'rgba(34, 197, 94, 0.8)',   // Green
    'rgba(249, 115, 22, 0.8)',  // Orange
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(168, 85, 247, 0.8)',  // Purple
    'rgba(14, 165, 233, 0.8)',  // Blue
    'rgba(245, 158, 11, 0.8)',  // Amber
    'rgba(236, 72, 153, 0.8)',  // Pink
  ];

  const borderColors = [
    'rgba(107, 107, 236, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(14, 165, 233, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(236, 72, 153, 1)',
  ];

  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.label || 'Unknown'),
    datasets: [
      {
        label: 'Learning Progress',
        data: data.map(item => item.value || 0),
        backgroundColor: defaultColors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 2,
      },
    ],
  };

  // Default chart options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} interactions (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 11,
          },
        },
        ticks: {
          display: false, // Hide the radial scale numbers for cleaner look
        },
      },
    },
    ...options,
  };

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-base-content/60">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-sm">No data available for chart</p>
        <p className="text-xs">Start interacting with Yunia to see learning progress</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-center mb-4 text-base-content">
          {title}
        </h3>
      )}
      <div className="relative h-64 w-full">
        <PolarArea data={chartData} options={defaultOptions} />
      </div>
      
      {/* Additional info below chart */}
      <div className="mt-4 text-center">
        <p className="text-xs text-base-content/70">
          Total interactions: {data.reduce((sum, item) => sum + (item.value || 0), 0)}
        </p>
      </div>
    </div>
  );
};

export default PolarChart;
