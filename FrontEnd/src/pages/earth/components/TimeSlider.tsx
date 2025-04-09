import React, { useState, useEffect, useCallback } from 'react';

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
  const getMaxValue = useCallback(() => {
    if (timeRange === 'year') {
      return maxYears;
    }
    return TIME_RANGE_CONFIG[timeRange].max;
  }, [timeRange, maxYears]);

  // 범위에 따른 최대값과 스텝 계산
  const maxValue = getMaxValue();
  const stepValue = TIME_RANGE_CONFIG[timeRange].step;
  
  // 초기 연도 데이터 로드 - 한 번만 로드되도록 조건 강화
  useEffect(() => {
    if (timeRange === 'year' && onFetchData && !fetchedData) {
      console.log('[TimeSlider] 연도 데이터 초기 로드 시작');
      const now = new Date();
      now.setMinutes(0, 0, 0);
      const startDate = new Date(now.getFullYear() - maxYears, 0, 1, 0);
      
      // 데이터 로드 전에 상태 변경하여 중복 요청 방지
      setFetchedData(true); 
      
      // 데이터 요청
      onFetchData(timeRange, value, startDate.toISOString(), now.toISOString());
      console.log('[TimeSlider] 연도 데이터 초기 로드 완료');
    }
  // 의존성 배열에서 value 제거하여 슬라이더 이동 시 재요청 방지
  }, [timeRange, onFetchData, maxYears, fetchedData, value]);
  
  // 날짜 범위 계산 함수
  const updateDateRange = useCallback((sliderValue: number) => {
    const now = new Date();
    // 현재 시간을 정각으로 설정 (분, 초, 밀리초를 0으로)
    now.setMinutes(0, 0, 0);
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
        start = new Date(now.getFullYear(), now.getMonth() - sliderValue, now.getDate(), now.getHours());
        break;
      case 'year':
        start = new Date(now.getFullYear() - sliderValue, 0, 1, 0);
        break;
      default:
        start = new Date(now.getTime() - sliderValue * 60 * 60 * 1000);
    }
    
    // 시작 시간도 정각으로 설정
    start.setMinutes(0, 0, 0);
    setStartDate(formatDateTimeForDisplay(start.toISOString()));
  }, [timeRange]);
  
  // 날짜 계산 및 업데이트 - 별도의 useEffect를 사용
  useEffect(() => {
    updateDateRange(value);
  }, [timeRange, value, updateDateRange]);
  

  // 슬라이더 값 변경 핸들러
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    
    // 부모 컴포넌트에 값 변경 알림을 setTimeout으로 감싸기
    setTimeout(() => {
      onChange(newValue);
    }, 0);
  };
  
  // 값이 변경될 때 부모 컴포넌트 콜백 호출 및 데이터 요청 처리
  useEffect(() => {
    // 부모 컴포넌트에 값 변경 알림
    onChange(value);
    
    // 연도 타입인 경우 슬라이더 변경 시 데이터를 다시 요청하지 않음
    if (timeRange !== 'year' && onFetchData && !playing) {
      console.log(`[TimeSlider] 슬라이더 값 변경: ${timeRange} 타입, ${value} 값`);
      
      // 직접 데이터 요청 (지도 업데이트를 위해)
      const now = new Date();
      now.setMinutes(0, 0, 0);
      let startDate: Date;
      
      switch (timeRange) {
        case 'hour':
          startDate = new Date(now.getTime() - value * 60 * 60 * 1000);
          break;
        case 'day':
          startDate = new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - value, now.getDate(), now.getHours());
          break;
        default:
          startDate = new Date(now.getTime() - value * 60 * 60 * 1000);
      }
      
      startDate.setMinutes(0, 0, 0);
      onFetchData(timeRange, value, startDate.toISOString(), now.toISOString());
    } else if (timeRange === 'year') {
      console.log(`[TimeSlider] 연도 슬라이더 값 변경: ${value}년 (API 요청 없음)`);
    }
  }, [value, timeRange, onChange, onFetchData, playing]);
  
  // 범위 변경 핸들러
  const handleRangeChange = (range: TimeRange) => {
    onRangeChange(range);
    setValue(0); // 범위 변경 시 슬라이더 초기화
    onChange(0);
    stopPlayback(); // 자동 재생 중이면 중지
    
    if (range === 'year') {
      // 연도 타입일 경우, 데이터를 이미 로드했다면 다시 로드하지 않음
      if (!fetchedData && onFetchData) {
        console.log('[TimeSlider] 연도 범위 변경: 데이터 요청');
        setFetchedData(true); // 먼저 상태 변경하여 중복 요청 방지
        
        const now = new Date();
        now.setMinutes(0, 0, 0);
        const startDate = new Date(now.getFullYear() - maxYears, 0, 1, 0);
        onFetchData(range, 0, startDate.toISOString(), now.toISOString());
      } else {
        console.log('[TimeSlider] 연도 범위 변경: 이미 데이터 있음');
      }
    } else {
      // 다른 타입으로 변경 시 새 데이터 조회 필요
      setFetchedData(false);
      updateDateRange(0);
      
      if (onFetchData) {
        console.log(`[TimeSlider] ${range} 범위 변경: 데이터 요청`);
        const now = new Date();
        now.setMinutes(0, 0, 0);
        let startDate: Date;
        
        switch (range) {
          case 'hour':
            startDate = new Date(now.getTime() - 0 * 60 * 60 * 1000);
            break;
          case 'day':
            startDate = new Date(now.getTime() - 0 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 0, now.getDate(), now.getHours());
            break;
          default:
            startDate = new Date(now.getTime() - 0 * 60 * 60 * 1000);
        }
        
        startDate.setMinutes(0, 0, 0);
        onFetchData(range, 0, startDate.toISOString(), now.toISOString());
      }
    }
  };
  
  // 날짜 입력 핸들러 - 시작일
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    setStartDate(inputDate);
    
    // 연도 타입이 아닐 때만 날짜 입력에 따른 슬라이더 값 계산
    if (timeRange !== 'year') {
      try {
        // 입력된 날짜를 파싱하고 분을 0으로 설정
        const inputDateTime = parseDisplayDate(inputDate);
        inputDateTime.setMinutes(0, 0, 0);
        
        const now = new Date();
        now.setMinutes(0, 0, 0);
        
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
        }
        
        // 값이 유효 범위 내인지 확인하고 슬라이더 업데이트
        if (newValue >= 0 && newValue <= maxValue) {
          setValue(newValue);
          onChange(newValue);
          setFetchedData(false);
        }
        
        // 변환된 정각 시간 표시를 위해 시작 날짜 업데이트
        setStartDate(formatDateTimeForDisplay(inputDateTime.toISOString()));
      } catch (e) {
        console.error('날짜 파싱 오류:', e);
      }
    }
  };
  
  // 종료일 핸들러 - 현재 시간으로 고정하되 항상 정각 시간으로 변환
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    
    try {
      // 입력된 날짜 파싱하고 정각으로 설정
      const inputDateTime = parseDisplayDate(inputDate);
      inputDateTime.setMinutes(0, 0, 0);
      
      setEndDate(formatDateTimeForDisplay(inputDateTime.toISOString()));
      // 종료일 변경 시 슬라이더 값 재계산 필요 (필요한 경우 추가 로직 구현)
    } catch (e) {
      console.error('날짜 파싱 오류:', e);
    }
  };
  
  // 조회하기 버튼 핸들러
  const handleFetchData = () => {
    if (onFetchData && timeRange !== 'year') {
      console.log(`[TimeSlider] 조회하기 버튼: ${timeRange} 타입, ${value} 값`);
      
      // 날짜 문자열을 파싱하여 Date 객체로 변환
      const startDateTime = parseDisplayDate(startDate);
      const endDateTime = parseDisplayDate(endDate);
      
      // 분, 초, 밀리초를 0으로 설정하여 정각으로 맞춤
      startDateTime.setMinutes(0, 0, 0);
      endDateTime.setMinutes(0, 0, 0);
      
      // ISO 형식으로 변환하여 API 호출
      const formattedStartDate = startDateTime.toISOString();
      const formattedEndDate = endDateTime.toISOString();
      
      onFetchData(timeRange, value, formattedStartDate, formattedEndDate);
      setFetchedData(true);
    }
  };
  
  // 재생/일시정지 핸들러
  const togglePlayback = () => {
    // 데이터가 로드되지 않았다면 먼저 로드
    if (!fetchedData && onFetchData) {
      console.log('[TimeSlider] 재생 시작 전 데이터 요청');
      if (timeRange === 'year') {
        // 연도 타입의 경우 직접 데이터 로드
        setFetchedData(true); // 먼저 상태 변경하여 중복 요청 방지
        const now = new Date();
        now.setMinutes(0, 0, 0);
        const startDate = new Date(now.getFullYear() - maxYears, 0, 1, 0);
        onFetchData(timeRange, value, startDate.toISOString(), now.toISOString());
      } else {
        // 다른 타입의 경우 기존 조회 함수 사용
        handleFetchData();
      }
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
    console.log('[TimeSlider] 재생 시작');
    
    const timer = setInterval(() => {
      setValue((prev) => {
        const newValue = prev + stepValue;
        if (newValue >= maxValue) {
          stopPlayback();
          return 0; // 마지막에 도달하면 처음으로 돌아감
        }
        
        // 값 변경 시 부모 컴포넌트에 전달하여 지도 업데이트 트리거
        onChange(newValue);
        
        // 연도 타입인 경우에만 데이터 요청 추가
        if (timeRange === 'year' && onFetchData) {
          const now = new Date();
          now.setMinutes(0, 0, 0);
          const startDate = new Date(now.getFullYear() - newValue, 0, 1, 0);
          startDate.setMinutes(0, 0, 0);
          onFetchData(timeRange, newValue, startDate.toISOString(), now.toISOString());
        }
        
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
    console.log('[TimeSlider] 재생 중지');
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
  
  // 날짜 표시용 포맷팅 함수
  function formatDateTimeForDisplay(isoString: string): string {
    const date = new Date(isoString);
    
    // 로컬 날짜 포맷 (YYYY-MM-DD HH:00)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:00`;
  }
  
  // 표시 형식 날짜를 Date 객체로 파싱
  function parseDisplayDate(displayDate: string): Date {
    // 표시용 형식(YYYY-MM-DD HH:MM)을 Date 객체로 변환
    try {
      // 입력된 날짜 파싱
      const parts = displayDate.split(' ');
      const dateParts = parts[0].split('-');
      const timeParts = parts[1] ? parts[1].split(':') : ['00', '00'];
      
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // JS에서 월은 0부터 시작
      const day = parseInt(dateParts[2]);
      const hours = parseInt(timeParts[0]);
      const minutes = parts[1] && timeParts.length > 1 ? parseInt(timeParts[1]) : 0;
      
      return new Date(year, month, day, hours, minutes);
    } catch (e) {
      console.error('날짜 변환 오류:', e);
      return new Date(); // 오류 시 현재 날짜 반환
    }
  }
  
  // 연도 타입에서는 날짜 입력 필드와 조회 버튼을 숨김
  const showDateInputs = timeRange !== 'year';
  
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
      
      {/* 날짜 입력 필드 - 연도 타입이 아닐 때만 표시 */}
      {showDateInputs && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시작 날짜 (정각)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="YYYY-MM-DD HH:00"
            />
            <p className="text-xs text-gray-500 mt-1">※ 시간은 항상 정각(00분)으로 설정됩니다</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">종료 날짜 (현재, 정각)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-100"
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="YYYY-MM-DD HH:00"
              readOnly // 종료 날짜는 현재 시간으로 고정
            />
          </div>
        </div>
      )}
      
      {/* 슬라이더 영역 - 항상 표시 */}
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
          {Array.from({ length: Math.min(11, Math.floor(maxValue / stepValue) + 1) }).map((_, i) => (
            <div key={i} className="h-1 w-1 bg-gray-400 rounded-full" />
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-auto pt-4">
        
        {/* 재생 버튼 - 연도 타입일 때만 표시 */}
        {timeRange === 'year' && (
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
        )}
      </div>
    </div>
  );
};

export default TimeSlider;