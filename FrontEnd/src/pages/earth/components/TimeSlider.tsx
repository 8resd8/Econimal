import React, { useState, useEffect } from 'react';

// 시간 범위 타입
export type TimeRange = 'hour' | 'day' | 'month' | 'year';

// 각 범위별 최대 기간 및 라벨 정의
const TIME_RANGE_CONFIG = {
  hour: { max: 72, label: '72h', step: 1 },    // 72시간, 1시간 단위
  day: { max: 90, label: '3mo', step: 1 },     // 3개월(약 90일), 1일 단위
  month: { max: 12, label: '12mo', step: 1 },  // 1년(12개월), 1개월 단위
  year: { max: 0, label: 'All', step: 1 },     // 백엔드 데이터 전체 범위, 1년 단위
};

interface TimeSliderProps {
  timeRange: TimeRange;
  onChange: (value: number) => void;
  onRangeChange: (range: TimeRange) => void;
  onFetchData?: (range: TimeRange, value: number, startDate: string, endDate: string) => void;
  maxYears?: number; // 백엔드에서 가져온 데이터의 최대 연도 범위 (기본값: 15)
}

const TimeSlider: React.FC<TimeSliderProps> = ({ 
  timeRange, 
  onChange, 
  onRangeChange,
  onFetchData,
  maxYears = 15 // 기본값 15년으로 설정 (백엔드에서 실제 값을 가져오면 업데이트)
}) => {
  const [value, setValue] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [interval, setIntervalState] = useState<NodeJS.Timeout | null>(null);
  const [fetchedData, setFetchedData] = useState<boolean>(false);
  
  // 날짜 직접 입력을 위한 상태
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 연도 범위 처리 - 'year' 타입일 때는 백엔드 최대값 사용
  const getMaxValue = () => {
    if (timeRange === 'year') {
      return maxYears;
    }
    return TIME_RANGE_CONFIG[timeRange].max;
  };

  // 범위에 따른 최대값과 스텝 계산
  const maxValue = getMaxValue();
  const stepValue = TIME_RANGE_CONFIG[timeRange].step;
  
  // 날짜 계산 및 업데이트
  useEffect(() => {
    updateDateRange(value);
  }, [timeRange, value]);
  
  // 날짜 범위 계산 함수
  const updateDateRange = (sliderValue: number) => {
    const now = new Date();
    const end = now.toISOString();
    setEndDate(formatDateTimeForDisplay(end));
    
    let start: Date;
    switch (timeRange) {
      case 'hour':
        start = new Date(now.getTime() - sliderValue * 60 * 60 * 1000);
        break;
      case 'day':
        start = new Date(now.getTime() - sliderValue * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth() - sliderValue, now.getDate());
        break;
      case 'year':
        start = new Date(now.getFullYear() - sliderValue, 0, 1);
        break;
      default:
        start = new Date(now.getTime() - sliderValue * 60 * 60 * 1000);
    }
    
    setStartDate(formatDateTimeForDisplay(start.toISOString()));
  };
  
  // 슬라이더 값 변경 핸들러
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    onChange(newValue);
    setFetchedData(false); // 값이 변경되면 데이터를 다시 가져와야 함
  };
  
  // 범위 변경 핸들러
  const handleRangeChange = (range: TimeRange) => {
    onRangeChange(range);
    setValue(0); // 범위 변경 시 슬라이더 초기화
    onChange(0);
    stopPlayback(); // 자동 재생 중이면 중지
    setFetchedData(false); // 새 범위로 데이터를 다시 가져와야 함
    updateDateRange(0);
    
    // 범위 변경 시 자동으로 데이터 조회
    if (onFetchData) {
      const now = new Date();
      let startDate: Date;
      
      switch (range) {
        case 'hour':
          startDate = new Date(now.getTime() - 0 * 60 * 60 * 1000);
          break;
        case 'day':
          startDate = new Date(now.getTime() - 0 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 0, now.getDate());
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 0, 0, 1);
          break;
        default:
          startDate = new Date(now.getTime() - 0 * 60 * 60 * 1000);
      }
      
      onFetchData(range, 0, startDate.toISOString(), now.toISOString());
    }
  };
  
  // 날짜 입력 핸들러 - 시작일
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    setStartDate(inputDate);
    
    // 날짜 입력에 따른 슬라이더 값 계산
    try {
      const inputDateTime = new Date(inputDate);
      const now = new Date();
      
      let newValue = 0;
      switch (timeRange) {
        case 'hour':
          newValue = Math.round((now.getTime() - inputDateTime.getTime()) / (60 * 60 * 1000));
          break;
        case 'day':
          newValue = Math.round((now.getTime() - inputDateTime.getTime()) / (24 * 60 * 60 * 1000));
          break;
        case 'month':
          newValue = (now.getFullYear() - inputDateTime.getFullYear()) * 12 + 
                    (now.getMonth() - inputDateTime.getMonth());
          break;
        case 'year':
          newValue = now.getFullYear() - inputDateTime.getFullYear();
          break;
      }
      
      // 값이 유효 범위 내인지 확인하고 슬라이더 업데이트
      if (newValue >= 0 && newValue <= maxValue) {
        setValue(newValue);
        onChange(newValue);
        setFetchedData(false);
      }
    } catch (e) {
      console.error('날짜 파싱 오류:', e);
    }
  };
  
  // 날짜 입력 핸들러 - 종료일 (항상 현재 시간이므로 사용자가 변경 시 시작일만 조정)
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    setEndDate(inputDate);
    // 종료일은 현재로 고정되어 있으므로 추가적인 처리는 필요 없음
  };
  
  // 조회하기 버튼 핸들러
  const handleFetchData = () => {
    if (onFetchData) {
      // ISO 형식으로 변환하여 API 호출
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);
      
      onFetchData(timeRange, value, formattedStartDate, formattedEndDate);
      setFetchedData(true);
    }
  };
  
  // 재생/일시정지 핸들러
  const togglePlayback = () => {
    if (!fetchedData && onFetchData) {
      // 데이터가 아직 로드되지 않았다면 먼저 로드
      handleFetchData();
    }
    
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
      case 'year':
        return `${value}년 전`;
      default:
        return '';
    }
  };
  
  // 범위에 따른 최대값 라벨 표시
  const getMaxValueLabel = () => {
    switch (timeRange) {
      case 'hour':
        return '72시간 전';
      case 'day':
        return '90일 전';
      case 'month':
        return '12개월 전';
      case 'year':
        return `${maxYears}년 전`;
      default:
        return '';
    }
  };
  
  // 날짜 표시용 포맷팅
  function formatDateTimeForDisplay(isoString: string): string {
    const date = new Date(isoString);
    
    // 로컬 날짜 포맷 (YYYY-MM-DD HH:MM)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  // API 요청용 날짜 포맷팅
  function formatDateForAPI(displayDate: string): string {
    // 표시용 형식(YYYY-MM-DD HH:MM)을 ISO 형식으로 변환
    try {
      // 입력된 날짜 파싱
      const parts = displayDate.split(' ');
      const dateParts = parts[0].split('-');
      const timeParts = parts[1] ? parts[1].split(':') : ['00', '00'];
      
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // JS에서 월은 0부터 시작
      const day = parseInt(dateParts[2]);
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      
      const date = new Date(year, month, day, hours, minutes);
      return date.toISOString();
    } catch (e) {
      console.error('날짜 변환 오류:', e);
      return new Date().toISOString(); // 오류 시 현재 날짜 반환
    }
  }
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 flex flex-col h-full mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">데이터 타임라인</h3>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        <button
          className={`px-3 py-1 rounded text-sm ${timeRange === 'hour' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleRangeChange('hour')}
        >
          {TIME_RANGE_CONFIG.hour.label}
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${timeRange === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleRangeChange('day')}
        >
          {TIME_RANGE_CONFIG.day.label}
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleRangeChange('month')}
        >
          {TIME_RANGE_CONFIG.month.label}
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleRangeChange('year')}
        >
          {TIME_RANGE_CONFIG.year.label}
        </button>
      </div>
      
      {/* 날짜 입력 필드 추가 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">시작 날짜</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={startDate}
            onChange={handleStartDateChange}
            placeholder="YYYY-MM-DD HH:MM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">종료 날짜 (현재)</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-100"
            value={endDate}
            onChange={handleEndDateChange}
            placeholder="YYYY-MM-DD HH:MM"
            readOnly // 종료 날짜는 현재 시간으로 고정
          />
        </div>
      </div>
      
      {/* 슬라이더 영역 - 항상 표시 (year 타입도 포함) */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">현재</span>
          <span className="text-sm font-medium text-gray-700">{getValueLabel()}</span>
          <span className="text-sm text-gray-500">{getMaxValueLabel()}</span>
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
      
      <div className="flex justify-center gap-4 mt-auto pt-4">
        <button
          onClick={handleFetchData}
          className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          조회하기
        </button>
        
        <button
          onClick={togglePlayback}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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