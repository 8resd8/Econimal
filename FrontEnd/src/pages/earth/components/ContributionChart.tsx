// src/pages/earth/components/ContributionChart.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Chart.js 모든 컴포넌트 등록
Chart.register(...registerables);

interface DataItem {
  correct: number;
  total: number;
}

interface ContributionChartProps {
  gasData: DataItem;
  waterData: DataItem;
  electricityData: DataItem;
  courtData?: DataItem;  // 법원 데이터는 선택적
}

const ContributionChart: React.FC<ContributionChartProps> = ({
  gasData,
  waterData,
  electricityData,
  courtData,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // props 유효성 검사 함수
  const validateData = () => {
    return (
      gasData && 
      waterData && 
      electricityData && 
      typeof gasData.correct === 'number' && 
      typeof gasData.total === 'number' &&
      typeof waterData.correct === 'number' && 
      typeof waterData.total === 'number' &&
      typeof electricityData.correct === 'number' && 
      typeof electricityData.total === 'number' &&
      (!courtData || (
        typeof courtData.correct === 'number' && 
        typeof courtData.total === 'number'
      ))
    );
  };

  useEffect(() => {
    // props 데이터가 유효하지 않으면 차트를 그리지 않음
    if (!validateData() || !chartRef.current) {
      return;
    }

    // 이전 차트 인스턴스가 있으면 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      try {
        // 정답률 계산 - 숫자 타입이므로 직접 계산
        const gasRate = Math.round((gasData.correct / gasData.total) * 100) || 0;
        const waterRate = Math.round((waterData.correct / waterData.total) * 100) || 0;
        const electricityRate = Math.round((electricityData.correct / electricityData.total) * 100) || 0;
        const courtRate = courtData ? Math.round((courtData.correct / courtData.total) * 100) || 0 : 0;

        // 라벨과 데이터 배열 준비
        const labels = ['가스', '수도', '전기'];
        const rates = [gasRate, waterRate, electricityRate];
        const backgroundColors = [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ];
        const borderColors = [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ];

        // 법원 데이터가 있으면 추가
        if (courtData) {
          labels.push('법원');
          rates.push(courtRate);
          backgroundColors.push('rgba(75, 192, 192, 0.7)');
          borderColors.push('rgba(75, 192, 192, 1)');
        }

        // 새 차트 생성
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: '정답률 (%)',
                data: rates,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function (value) {
                    return value + '%';
                  },
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const dataIndex = context.dataIndex;
                    let correct, total;
                    
                    if (dataIndex === 0) {
                      correct = gasData.correct;
                      total = gasData.total;
                    } else if (dataIndex === 1) {
                      correct = waterData.correct;
                      total = waterData.total;
                    } else if (dataIndex === 2) {
                      correct = electricityData.correct;
                      total = electricityData.total;
                    } else if (dataIndex === 3 && courtData) {
                      correct = courtData.correct;
                      total = courtData.total;
                    }
                    
                    return `정답률: ${context.raw}% (${correct}/${total})`;
                  },
                },
              },
              legend: {
                display: false,
              },
            },
          },
        });
      } catch (error) {
        console.error('차트 생성 중 오류 발생:', error);
      }
    }

    // 컴포넌트 언마운트 시 차트 인스턴스 정리
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [gasData, waterData, electricityData, courtData]);

  // 데이터가 유효하지 않은 경우 대체 메시지 표시
  if (!validateData()) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center mb-4">나의 퀴즈 정답률</h3>
        <div className="p-4 text-center text-gray-600">
          데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  // 그리드 열 수 계산 (법원 데이터 포함 여부에 따라)
  const gridColsClass = courtData ? "grid-cols-4" : "grid-cols-3";

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">나의 퀴즈 정답률</h3>
      <div className="w-full h-64">
        <canvas ref={chartRef} />
      </div>
      <div className={`mt-4 grid ${gridColsClass} gap-2 text-center text-sm`}>
        <div className="p-2 rounded bg-red-100">
          <p className="font-semibold">가스</p>
          <p>{gasData.correct}/{gasData.total} 문제</p>
        </div>
        <div className="p-2 rounded bg-blue-100">
          <p className="font-semibold">수도</p>
          <p>{waterData.correct}/{waterData.total} 문제</p>
        </div>
        <div className="p-2 rounded bg-yellow-100">
          <p className="font-semibold">전기</p>
          <p>{electricityData.correct}/{electricityData.total} 문제</p>
        </div>
        {courtData && (
          <div className="p-2 rounded bg-teal-100">
            <p className="font-semibold">법원</p>
            <p>{courtData.correct}/{courtData.total} 문제</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionChart;