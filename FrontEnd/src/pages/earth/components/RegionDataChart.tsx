import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  // 컴포넌트 ID (고유 식별자)
  const componentId = useMemo(() => Math.random().toString(36).substr(2, 5), []);
  
  // 참조 생성
  const chartRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 컴포넌트 생명주기 로깅
  useEffect(() => {
    console.log(`[Chart-${componentId}] 마운트 - 레이블: ${label}, 데이터 포인트: ${dataPoints?.length || 0}`);
    
    if (dataPoints?.length > 0) {
      console.log(`[Chart-${componentId}] 데이터 샘플:`, {
        첫_포인트: dataPoints[0],
        마지막_포인트: dataPoints[dataPoints.length - 1],
        총_개수: dataPoints.length
      });
    }
    
    return () => {
      console.log(`[Chart-${componentId}] 언마운트 - 레이블: ${label}`);
    };
  }, []);
  
  // 차트 데이터 처리 - useMemo로 불필요한 재계산 방지
  const processedChartData = useMemo(() => {
    console.log(`[Chart-${componentId}] 차트 데이터 처리 시작`);
    
    // 데이터가 유효한지 확인
    if (!dataPoints || dataPoints.length === 0) {
      console.log(`[Chart-${componentId}] 유효한 데이터 없음 - 빈 차트 반환`);
      return {
        labels: [],
        datasets: [{
          label,
          data: [],
          borderColor,
          backgroundColor,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.1
        }]
      };
    }
    
    try {
      // 데이터 정렬 (날짜 오름차순)
      const sortedData = [...dataPoints].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      // 레이블 형식화
      const formattedLabels = sortedData.map(point => {
        try {
          const date = new Date(point.timestamp);
          return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
          });
        } catch (e) {
          console.error(`[Chart-${componentId}] 날짜 변환 오류:`, e);
          return point.timestamp;
        }
      });
      
      // 데이터 값 추출
      const values = sortedData.map(point => {
        if (typeof point.value !== 'number') {
          console.warn(`[Chart-${componentId}] 숫자가 아닌 값:`, point.value);
          return parseFloat(point.value as any) || 0;
        }
        return point.value;
      });
      
      console.log(`[Chart-${componentId}] 차트 데이터 처리 완료: ${values.length}개 포인트`);
      
      // 차트 데이터 반환
      return {
        labels: formattedLabels,
        datasets: [{
          label,
          data: values,
          borderColor,
          backgroundColor,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.1
        }]
      };
    } catch (error) {
      console.error(`[Chart-${componentId}] 데이터 처리 오류:`, error);
      return {
        labels: [],
        datasets: [{
          label,
          data: [],
          borderColor,
          backgroundColor,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.1
        }]
      };
    }
  }, [dataPoints, label, borderColor, backgroundColor, componentId]);
  
  // Y축 범위 계산 - useMemo로 최적화
  const yAxisRange = useMemo(() => {
    if (dataPoints && dataPoints.length > 0) {
      const values = dataPoints.map(point => point.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      
      if (label.includes('온도')) {
        // 영하 값 처리
        if (minValue < 0) {
          return {
            min: Math.floor(minValue * 1.1),
            max: Math.ceil(maxValue * 1.1)
          };
        }
      }
    }
    
    return {
      min: yAxisMin,
      max: yAxisMax
    };
  }, [dataPoints, yAxisMin, yAxisMax, label]);
  
  // 각 포인트당 최소 너비 - 일정한 간격 유지를 위한 상수
  const MIN_POINT_WIDTH = 40; // 각 데이터 포인트가 차지할 최소 픽셀 너비
  
  // 차트 옵션 - Y축 전용
  const yAxisOptions = useMemo((): ChartOptions<'line'> => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: {
          position: 'left',
          title: { display: false },
          min: yAxisRange.min,
          max: yAxisRange.max,
          ticks: {
            font: { size: 10 },
            align: 'center' as const,
            padding: 0,
            callback: function(value) {
              return value + (label.includes('온도') ? '°C' : label.includes('CO2') ? 'ppm' : '%');
            }
          },
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          border: { display: true, color: 'rgba(0, 0, 0, 0.1)' }
        }
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'y' as const,
        intersect: false
      }
    };
  }, [yAxisRange, label]);
  
  // 차트 옵션 - 메인 차트
  const mainChartOptions = useMemo((): ChartOptions<'line'> => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            boxWidth: 15,
            padding: 8,
            font: { size: 11 }
          }
        },
        title: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          padding: 8,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          grid: { display: true, color: 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: { size: 10 },
            autoSkip: false // 모든 레이블 표시
          },
          border: { display: true, color: 'rgba(0, 0, 0, 0.1)' }
        },
        y: {
          display: false,
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
  }, [yAxisRange]);
  
  // 반응형 디자인을 위한 상태
  const [chartWidth, setChartWidth] = useState(300);
  
  // 차트 너비 계산 함수 - 포인트 간격을 일정하게 유지하도록 개선
  const calculateChartWidth = () => {
    if (!chartRef.current) return 300;
    
    const containerWidth = chartRef.current.clientWidth - 60;
    
    // 데이터 포인트 수에 따라 필요한 너비 계산
    // 각 포인트마다 최소 MIN_POINT_WIDTH 픽셀 확보
    const requiredWidth = Math.max(
      300,  // 최소 300px
      dataPoints.length * MIN_POINT_WIDTH  // 각 포인트당 최소 너비 보장
    );
    
    // 컨테이너보다 넓으면 스크롤이 생기도록 설정
    return Math.max(requiredWidth, containerWidth);
  };
  
  // 리사이즈 처리
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(calculateChartWidth());
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 데이터 변경 시 차트 너비 업데이트
  useEffect(() => {
    if (dataPoints.length > 0 && chartRef.current) {
      setChartWidth(calculateChartWidth());
    }
  }, [dataPoints.length]);
  
  // 스크롤 컨테이너 초기 스크롤 위치 설정 (최신 데이터 표시)
  useEffect(() => {
    if (processedChartData.labels.length > 0 && scrollContainerRef.current) {
      // 스크롤을 오른쪽 끝으로 이동 (최신 데이터 표시)
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [processedChartData.labels.length]);
  
  // 데이터가 없는 경우 메시지 표시
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-60 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-2">데이터가 없습니다.</p>
        <p className="text-gray-400 text-sm">추후 업데이트 예정입니다.</p>
      </div>
    );
  }
  
  // 데이터 포맷 검증
  if (processedChartData.labels.length === 0 || processedChartData.datasets[0].data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-60 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-2">데이터 형식이 올바르지 않습니다.</p>
        <p className="text-gray-400 text-sm">추후 업데이트 예정입니다.</p>
      </div>
    );
  }
  
  // 스크롤 컨테이너 스타일
  const scrollContainerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflowY: 'hidden',
    overflowX: 'auto', // 항상 스크롤 허용
  };

  // 데이터 포인트별 간격 계산 (로깅용)
  const pointSpacing = chartWidth / processedChartData.labels.length;
  console.log(`[Chart-${componentId}] 차트 너비: ${chartWidth}px, 포인트 개수: ${processedChartData.labels.length}, 포인트당 간격: ${pointSpacing.toFixed(1)}px`);

  return (
    <div className="bg-white rounded-lg shadow p-3 h-60 flex flex-col" ref={chartRef}>
      {/* 차트 제목 영역 */}
      <div className="flex-none mb-1">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      
      {/* 차트 영역 - CSS grid로 레이아웃 구성 */}
      <div className="flex-grow relative">
        {/* 이 부분이 스크롤 가능한 차트 영역 */}
        <div className="absolute inset-0" style={{ display: 'grid', gridTemplateColumns: '45px 1fr' }}>
          {/* Y축 영역 (고정) */}
          <div className="bg-white z-10" style={{ 
            gridColumn: '1', 
            overflow: 'hidden', 
            borderRight: '1px solid rgba(0,0,0,0.1)',
            paddingLeft: '2px',
            paddingRight: '2px'
          }}>
            {/* Y축만 표시 */}
            <div style={{ width: '103px', height: '100%' }}>
              <Line 
                data={{
                  ...processedChartData,
                  datasets: [{ ...processedChartData.datasets[0], data: [] }] // 데이터 없이 Y축만 표시
                }} 
                options={yAxisOptions}
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
              {/* 여기서 chartWidth가 충분히 커서 각 포인트가 MIN_POINT_WIDTH 픽셀 이상 차지하도록 보장 */}
              <div style={{ width: `${chartWidth}px`, height: '100%' }}>
                <Line 
                  data={processedChartData} 
                  options={mainChartOptions}
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