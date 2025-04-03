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

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 데이터 포인트 인터페이스
interface DataPoint {
  timestamp: string;
  value: number;
}

// 컴포넌트 프롭스 인터페이스
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

  // 데이터 확인 및 로깅 (디버깅용)
  useEffect(() => {
    console.log('RegionDataChart - 데이터 포인트:', dataPoints);
    if (!dataPoints || dataPoints.length === 0) {
      console.log('차트 데이터가 없습니다.');
    } else {
      console.log('첫 번째 데이터 포인트:', dataPoints[0]);
      console.log('마지막 데이터 포인트:', dataPoints[dataPoints.length - 1]);
    }
  }, [dataPoints]);

  // 데이터 업데이트
  useEffect(() => {
    if (dataPoints && dataPoints.length > 0) {
      try {
        // 데이터가 정렬되어 있는지 확인하고 필요시 정렬
        const sortedDataPoints = [...dataPoints].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const formattedLabels = sortedDataPoints.map(point => {
          try {
            const date = new Date(point.timestamp);
            return date.toLocaleDateString('ko-KR', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            });
          } catch (error) {
            console.error('날짜 변환 오류:', error, 'timestamp:', point.timestamp);
            return point.timestamp; // 변환 실패 시 원본 문자열 반환
          }
        });

        const formattedData = sortedDataPoints.map(point => {
          // 숫자가 아닌 경우 처리
          if (typeof point.value !== 'number') {
            console.warn('숫자가 아닌 값:', point.value);
            return parseFloat(point.value) || 0; // 변환 시도 또는 0 반환
          }
          return point.value;
        });

        setChartData({
          labels: formattedLabels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: formattedData
            }
          ]
        });
        
        console.log('차트 데이터 업데이트 완료:', formattedLabels.length, '개 데이터 포인트');
      } catch (error) {
        console.error('차트 데이터 처리 중 오류:', error);
      }
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

  // 데이터 포맷 검증
  const isValidData = chartData.labels.length > 0 && chartData.datasets[0].data.length > 0;
  
  if (!isValidData) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center">
        <p className="text-gray-500">데이터 형식이 올바르지 않습니다.</p>
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