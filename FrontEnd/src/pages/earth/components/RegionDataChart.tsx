import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Chart.js 등록npm i
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  timestamp: string;
  value: number;
}

interface RegionDataChartProps {
  title: string;
  dataPoints: DataPoint[];
  label: string;
  borderColor: string;
  backgroundColor: string;
  yAxisLabel: string;
  yAxisMin?: number;
  yAxisMax?: number;
}

const RegionDataChart: React.FC<RegionDataChartProps> = ({
  title,
  dataPoints,
  label,
  borderColor,
  backgroundColor,
  yAxisLabel,
  yAxisMin,
  yAxisMax
}) => {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: label,
        data: [] as number[],
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
        tension: 0.1
      }
    ]
  });

  // 차트 옵션
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: yAxisLabel
        },
        min: yAxisMin,
        max: yAxisMax,
        ticks: {
          callback: function(value) {
            return value + (label.includes('온도') ? '°C' : label.includes('CO2') ? 'ppm' : '');
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  // 데이터 업데이트
  useEffect(() => {
    if (dataPoints && dataPoints.length > 0) {
      const formattedLabels = dataPoints.map(point => {
        const date = new Date(point.timestamp);
        return date.toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        });
      });

      const formattedData = dataPoints.map(point => point.value);

      setChartData({
        labels: formattedLabels,
        datasets: [
          {
            ...chartData.datasets[0],
            data: formattedData
          }
        ]
      });
    }
  }, [dataPoints]);

  // 데이터가 없는 경우 메시지 표시
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center">
        <p className="text-gray-500">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RegionDataChart;