// src/components/ContributionChart.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartType, ChartOptions } from 'chart.js';

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
  courtData?: DataItem;
  hasParticipated?: boolean;
}

const IndividualDonutChart: React.FC<{
  title: string;
  correct: number;
  total: number;
  bgColor: string;
}> = ({ title, correct, total, bgColor }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 이전 차트 인스턴스 정리
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // 정답률 계산 (0/0 방지)
    const rate = total === 0 ? 0 : Math.round((correct / total) * 100);
    
    // Chart.js 타입 문제를 해결하기 위한 옵션 설정
    const options: any = {
      responsive: true,
      // cutout 속성 사용
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `${context.label}: ${context.raw}%`;
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutCubic',
      }
    };
    
    // 차트 생성
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['정답', '오답'],
        datasets: [
          {
            data: [rate, 100 - rate],
            backgroundColor: [
              bgColor,
              'rgba(220, 220, 220, 0.7)'
            ],
            borderColor: [
              bgColor,
              'rgba(220, 220, 220, 1)'
            ],
            borderWidth: 1,
          }
        ],
      },
      options: options,
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart: any) => {
          const width = chart.width;
          const height = chart.height;
          const ctx = chart.ctx;
          
          ctx.restore();
          ctx.font = 'bold 24px Arial';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#333';
          ctx.fillText(`${rate}%`, width / 2, height / 2);
          
          ctx.font = '14px Arial';
          ctx.fillText('정답률', width / 2, height / 2 + 25);
          
          ctx.save();
        }
      }]
    });

    // 컴포넌트 언마운트 시 차트 정리
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [correct, total, bgColor]);

  return (
    <div className="w-full h-64 flex flex-col items-center">
      <h4 className="text-md font-semibold mb-2">{title}</h4>
      <div className="w-full flex-grow flex justify-center items-center">
        <canvas ref={chartRef} />
      </div>
      <p className="text-sm mt-2">
        {correct}/{total} 문제
      </p>
    </div>
  );
};

const ContributionChart: React.FC<ContributionChartProps> = ({
  gasData,
  waterData,
  electricityData,
  courtData,
  hasParticipated = false
}) => {
  // 데이터 유효성 검사
  const isValidData = () => {
    return gasData && waterData && electricityData;
  };

  if (!isValidData()) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center mb-4">🎯 나의 퀴즈 정답률 🎯</h3>
        <div className="p-4 text-center text-gray-600">
          데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  // 아직 퀴즈에 참여하지 않은 경우
  if (!hasParticipated) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center mb-4">🎯 나의 퀴즈 정답률 🎯</h3>
        <div className="p-6 text-center">
          <p className="text-lg text-gray-700 mb-4">아직 퀴즈에 참여하지 않았습니다.</p>
          <p className="text-md text-gray-600">환경 퀴즈에 참여하고 지구를 지켜보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">🎯 나의 퀴즈 정답률 🎯</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <IndividualDonutChart 
          title="가스" 
          correct={gasData.correct} 
          total={gasData.total} 
          bgColor="rgba(239, 68, 68, 0.7)"
        />
        <IndividualDonutChart 
          title="수도" 
          correct={waterData.correct} 
          total={waterData.total} 
          bgColor="rgba(59, 130, 246, 0.7)"
        />
        <IndividualDonutChart 
          title="전기" 
          correct={electricityData.correct} 
          total={electricityData.total} 
          bgColor="rgba(245, 158, 11, 0.7)"
        />
      </div>
      
      {/* {courtData && courtData.total > 0 && (
        <div className="border-t pt-4 scale-[65%]">
          <h3 className="text-lg font-semibold text-center mb-4">법원 퀴즈 정답률</h3>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <IndividualDonutChart 
                title="법원" 
                correct={courtData.correct} 
                total={courtData.total} 
                bgColor="rgba(16, 185, 129, 0.7)"
              />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ContributionChart;