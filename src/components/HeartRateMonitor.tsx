import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Heart } from 'lucide-react';
import { HeartRateData } from '../types';
import { formatTimestamp } from '../utils/dateFormat';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  heartRateData: HeartRateData[];
}

export default function HeartRateMonitor({ heartRateData }: Props) {
  const [chartData, setChartData] = useState<any>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [averageHeartRate, setAverageHeartRate] = useState<number>(0);

  useEffect(() => {
    if (heartRateData.length === 0) return;

    const labels = heartRateData.map(data => formatTimestamp(data.timestamp));
    const values = heartRateData.map(data => data.value);
    
    const latestValue = values[values.length - 1];
    if (latestValue < 60) {
      setAlert('Warning: Heart rate is below normal range (< 60 BPM)');
    } else if (latestValue > 100) {
      setAlert('Warning: Heart rate is above normal range (> 100 BPM)');
    } else {
      setAlert(null);
    }

    // Calculate average of last 10 beats
    const last10Beats = values.slice(-10);
    const average = last10Beats.reduce((a, b) => a + b, 0) / last10Beats.length;
    setAverageHeartRate(Math.round(average));

    const newChartData = {
      labels,
      datasets: [
        {
          label: 'Heart Rate (BPM)',
          data: values,
          borderColor: values.map(value => 
            value < 60 || value > 100 ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
          ),
          backgroundColor: values.map(value => 
            value < 60 || value > 100 ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
          ),
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointRadius: 4
        }
      ]
    };

    setChartData(newChartData);
  }, [heartRateData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '❤️ Real-time Heart Rate Monitoring',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 150,
        ticks: {
          stepSize: 20
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>❤️</span> Heart Rate Monitor
        </h2>
        <div className="flex items-center space-x-2">
          <Heart className={`${
            alert ? 'text-red-500' : 'text-green-500'
          } animate-pulse`} />
          <span className={`text-xl font-semibold ${
            alert ? 'text-red-600' : 'text-green-600'
          }`}>
            {heartRateData[heartRateData.length - 1]?.value || 0} BPM
          </span>
        </div>
      </div>

      {alert && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{alert}</p>
        </div>
      )}

      <div className="h-[400px]">
        {chartData && <Line data={chartData} options={options} />}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 font-medium">
          Average Heart Rate (Last 10 readings): 
          <span className="ml-2 text-xl font-bold text-indigo-600">
            {averageHeartRate} BPM
          </span>
        </p>
      </div>
    </div>
  );
}