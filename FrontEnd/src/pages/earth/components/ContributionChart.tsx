import React, { useEffect, useRef, useState } from 'react';
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
  courtData?: DataItem;  // 법원 데이터는 선택적
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

    // 이전 차트 인스턴스가 있으면 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      const rate = Math.round((correct / total) * 100);
      
      // 도넛 차트 옵션 타입 명시적 정의
      const options: Partial<ChartOptions> = {
        responsive: true,
        // @ts-ignore: cutout 속성 무시
        cutout: 60,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label;
                const value = context.raw as number;
                return `${label}: ${value}%`;
              }
            }
          },
          legend: {
            display: false
          }
        },
        // @ts-ignore: 커스텀 속성 추가를 위해 타입 무시
        centerTextPlugin: {
          text: `${rate}%`,
          subText: '정답률'
        },
        animation: {
          duration: 1000,
          easing: 'easeOutCubic',
        }
      };

      // 파이 차트 데이터
      const pieData = [
        rate,           // 정답률 부분
        100 - rate      // 오답률 부분
      ];

      // 각 차트 인스턴스에 대한 개별 플러그인 생성
      const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart: Chart) => {
          const width = chart.width;
          const height = chart.height;
          const ctx = chart.ctx;
          const centerText = (chart.config.options as any)?.centerTextPlugin;
          
          if (centerText) {
            ctx.restore();
            ctx.font = 'bold 24px Arial';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#333';
            ctx.fillText(centerText.text, width / 2, height / 2);
            
            if (centerText.subText) {
              ctx.font = '14px Arial';
              ctx.fillText(centerText.subText, width / 2, height / 2 + 25);
            }
            
            ctx.save();
          }
        }
      };

      // 새 차트 생성 - 도넛 차트
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut' as ChartType,
        data: {
          labels: ['정답', '오답'],
          datasets: [
            {
              data: pieData,
              backgroundColor: [
                bgColor,  // 정답 - 동적 색상
                'rgba(220, 220, 220, 0.7)'  // 오답 - 회색
              ],
              borderColor: [
                bgColor,
                'rgba(220, 220, 220, 1)'
              ],
              borderWidth: 1,
            }
          ],
        },
        options,
        plugins: [centerTextPlugin]  // 각 차트 인스턴스에 플러그인 직접 적용
      });
    }

    // 컴포넌트 언마운트 시 차트 인스턴스 정리
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
}) => {
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

  // 데이터가 유효하지 않은 경우 대체 메시지 표시
  if (!validateData()) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center mb-4">🎯 나의 퀴즈 정답률 🎯</h3>
        <div className="p-4 text-center text-gray-600">
          데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">🎯 나의 퀴즈 정답률 🎯</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <IndividualDonutChart 
          title="가스" 
          correct={gasData.correct} 
          total={gasData.total} 
          bgColor="rgba(239, 68, 68, 0.7)"  // 빨간색 계열
        />
        <IndividualDonutChart 
          title="수도" 
          correct={waterData.correct} 
          total={waterData.total} 
          bgColor="rgba(59, 130, 246, 0.7)"  // 파란색 계열
        />
        <IndividualDonutChart 
          title="전기" 
          correct={electricityData.correct} 
          total={electricityData.total} 
          bgColor="rgba(245, 158, 11, 0.7)"  // 노란색 계열
        />
      </div>
      
      {courtData && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-center mb-4">법원 퀴즈 정답률</h3>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <IndividualDonutChart 
                title="법원" 
                correct={courtData.correct} 
                total={courtData.total} 
                bgColor="rgba(16, 185, 129, 0.7)"  // 초록색 계열
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionChart;