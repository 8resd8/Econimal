import React, { useState, useEffect } from 'react';

// 시간 범위 타입
export type TimeRange = 'hour' | 'day' | 'month' | 'all';

// 각 범위별 최대 기간 정의
const MAX_RANGES = {
  hour: 72, // 72시간
  day: 90,  // 3개월(약 90일)
  month: 12, // 1년(12개월)
  all: 0,    // 전체 데이터 (API에서 처리)
};

// 슬라이더 간격 (눈금) 정의
const STEP_VALUES = {
  hour: 6,   // 6시간마다
  day: 7,    // 7일마다
  month: 1,  // 1개월마다
  all: 1,    // 전체 데이터는 슬라이더 사용 안함
};

interface TimeSliderProps {
  timeRange: TimeRange;
  onChange: (value: number) => void;
  onRangeChange: (range: TimeRange) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ 
  timeRange, 
  onChange, 
  onRangeChange 
}) => {
  const [value, setValue] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [interval, setIntervalState] = useState<NodeJS.Timeout | null>(null);

  // 범위에 따른 최대값 계산
  const maxValue = MAX_RANGES[timeRange];
  const stepValue = STEP_VALUES[timeRange];
  
  // 슬라이더 값 변경 핸들러
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    onChange(newValue);
  };
  
  // 범위 변경 핸들러
  const handleRangeChange = (range: TimeRange) => {
    onRangeChange(range);
    setValue(0); // 범위 변경 시 슬라이더 초기화
    onChange(0);
    stopPlayback(); // 자동 재생 중이면 중지
  };
  
  // 재생/일시정지 핸들러
  const togglePlayback = () => {
    if (playing) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };
  
  // 자동 재생 시작
  const startPlayback = () => {
    setPlaying(true);
    const timer = setInterval(() => {
      setValue((prev) => {
        const newValue = prev + stepValue;
        if (newValue >= maxValue) {
          stopPlayback();
          return 0; // 마지막에 도달하면 처음으로 돌아감
        }
        onChange(newValue);
        return newValue;
      });
    }, 1000); // 1초마다 업데이트
    
    setIntervalState(timer);
  };
  
  // 자동 재생 중지
  const stopPlayback = () => {
    if (interval) {
      clearInterval(interval);
      setIntervalState(null);
    }
    setPlaying(false);
  };
  
  // 컴포넌트 언마운트 시 자동 재생 중지
  useEffect(() => {
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [interval]);
  
  // 범위에 따른 라벨 표시
  const getValueLabel = () => {
    switch (timeRange) {
      case 'hour':
        return `${value}시간 전`;
      case 'day':
        return `${value}일 전`;
      case 'month':
        return `${value}개월 전`;
      case 'all':
        return '전체 데이터';
      default:
        return '';
    }
  };
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">데이터 타임라인</h3>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        <button
          className={`px-3 py-1 rounded text-sm ${timeRange === 'hour' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleRangeChange('hour')}
        >
          시간별
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${timeRange === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleRangeChange('day')}
        >
          일별
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleRangeChange('month')}
        >
          월별
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${timeRange === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleRangeChange('all')}
        >
          전체
        </button>
      </div>
      
      {timeRange !== 'all' && (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">현재</span>
            <span className="text-sm font-medium text-gray-700">{getValueLabel()}</span>
            <span className="text-sm text-gray-500">
              {timeRange === 'hour' ? '72시간 전' : timeRange === 'day' ? '90일 전' : '12개월 전'}
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max={maxValue}
            step={stepValue}
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between mt-1">
            {Array.from({ length: Math.floor(maxValue / stepValue) + 1 }).map((_, i) => (
              <div key={i} className="h-1 w-1 bg-gray-400 rounded-full" />
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-auto pt-4">
        <button
          onClick={togglePlayback}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          disabled={timeRange === 'all'}
        >
          {playing ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              일시정지
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              재생
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TimeSlider;