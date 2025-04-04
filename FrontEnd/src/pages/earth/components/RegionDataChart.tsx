import React, { useEffect, useState, useRef } from 'react';
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
  const chartRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // 영하 온도를 포함하도록 수정된 Y축 범위
  const getYAxisRange = () => {
    // 데이터 포인트 기반 자동 범위 계산 로직 추가
    if (dataPoints && dataPoints.length > 0) {
      const values = dataPoints.map(point => point.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      
      // 온도일 경우 영하 값을 적절히 처리
      if (label.includes('온도')) {
        // 영하 값이 있는 경우 
        if (minValue < 0) {
          return {
            min: Math.floor(minValue * 1.1), // 데이터의 최저 온도보다 약간 더 낮게
            max: Math.ceil(maxValue * 1.1)   // 데이터의 최고 온도보다 약간 더 높게
          };
        }
      }
    }
    
    // 기본값 사용 (yAxisMin, yAxisMax가 제공된 경우)
    return {
      min: yAxisMin,
      max: yAxisMax
    };
  };

  // 차트 옵션 - Y축 차트용
  const getYAxisOptions = (): ChartOptions<'line'> => {
    const yAxisRange = getYAxisRange();
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // 범례 숨김
        },
        title: {
          display: false // 제목 숨김
        },
        tooltip: {
          enabled: false // 툴팁 비활성화
        }
      },
      scales: {
        x: {
          display: false // X축 숨김
        },
        y: {
          position: 'left',
          title: {
            display: false, // Y축 제목 숨김 (공간 확보)
          },
          min: yAxisRange.min,
          max: yAxisRange.max,
          ticks: {
            font: {
              size: 10
            },
            // 텍스트 위치 조정
            align: 'center' as const,
            padding: 0, // 패딩 줄임
            // 온도, CO2, 습도에 따라 단위 표시
            callback: function(value) {
              return value + (label.includes('온도') ? '°C' : label.includes('CO2') ? 'ppm' : '%');
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          border: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'y' as const,
        intersect: false
      }
    };
  };

  // 차트 옵션 - 메인 차트용
  const getMainChartOptions = (): ChartOptions<'line'> => {
    const yAxisRange = getYAxisRange();
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            boxWidth: 15,
            padding: 8,
            font: {
              size: 11
            }
          }
        },
        title: {
          display: false // 차트 내부 제목 비활성화 (외부에서 제공)
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 12
          },
          padding: 8,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 10
            }
          },
          border: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          display: false, // Y축 숨김 (왼쪽 고정 영역에 표시됨)
          min: yAxisRange.min,
          max: yAxisRange.max,
        }
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false
      }
    };
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
        // 데이터가 정렬되어 있는지 확인하고 필요시 정렬 (날짜 오름차순)
        const sortedDataPoints = [...dataPoints].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const formattedLabels = sortedDataPoints.map(point => {
          try {
            const date = new Date(point.timestamp);
            return date.toLocaleDateString('ko-KR', {
              month: 'short',
              day: 'numeric'
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

  // 스크롤 컨테이너 초기 스크롤 위치 설정 (최신 데이터 표시)
  useEffect(() => {
    // 데이터가 로드되고 스크롤 컨테이너가 준비된 경우
    if (chartData.labels.length > 7 && scrollContainerRef.current) {
      // 스크롤을 오른쪽 끝으로 이동 (최신 데이터 표시)
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100); // 차트가 완전히 렌더링될 시간을 주기 위해 약간의 지연 추가
    }
  }, [chartData.labels.length]);

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
  
  // 데이터 포인트가 7개 초과인 경우 스크롤 활성화
  const hasScrollBar = dataPoints.length > 7;
  
  // 데이터 포인트당 너비 계산 (7개 데이터 포인트 기준으로 동일한 간격 유지)
  const pointWidth = 40; // 각 데이터 포인트당 픽셀 너비 (더 좁게 조정)
  
  // 전체 차트 너비 계산 (데이터 포인트 수 * 포인트당 너비)
  const chartWidth = Math.max(
    300, // 최소 너비
    dataPoints.length * pointWidth
  );

  // 스크롤 컨테이너 스타일
  const scrollContainerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflowY: 'hidden',
    overflowX: hasScrollBar ? 'auto' : 'hidden',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-64 flex flex-col" ref={chartRef}>
      {/* 차트 제목 영역 - 고정 */}
      <div className="flex-none mb-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      
      {/* 차트 영역 - CSS grid로 레이아웃 구성 */}
      <div className="flex-grow relative">
        {/* 이 부분이 스크롤 가능한 차트 영역 */}
        <div className="absolute inset-0" style={{ display: 'grid', gridTemplateColumns: '60px 1fr' }}>
          {/* Y축 영역 (고정) */}
          <div className="bg-white z-10" style={{ 
            gridColumn: '1', 
            overflow: 'hidden', 
            borderRight: '1px solid rgba(0,0,0,0.1)',
            paddingLeft: '5px',
            paddingRight: '5px'
          }}>
            {/* Y축만 표시 */}
            <div style={{ width: '50px', height: '100%' }}>
              <Line 
                data={{
                  ...chartData,
                  datasets: [{ ...chartData.datasets[0], data: [] }] // 데이터 없이 Y축만 표시
                }} 
                options={getYAxisOptions()}
              />
            </div>
          </div>
          
          {/* 스크롤 가능한 차트 영역 */}
          <div style={{ gridColumn: '2', position: 'relative' }}>
            <div 
              ref={scrollContainerRef}
              style={scrollContainerStyle}
              className="chart-scroll-container"
            >
              <div style={{ width: `${chartWidth}px`, height: '100%' }}>
                <Line 
                  data={chartData} 
                  options={getMainChartOptions()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionDataChart;