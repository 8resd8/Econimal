import React, { useState, useEffect } from 'react';
import bgImage from "@/assets/auth_background.png";
import GoMainBtn from '@/components/GoMainBtn';

// Components
import WorldMap from './components/WorldMap';
import RegionInfo from './components/RegionInfo';
import TimeSlider from './components/TimeSlider';
import { TimeRange } from './components/TimeSlider';
import MapLayout from './components/EarthLayout';

// Features (API 관련)
import { 
  fetchWorldData, 
  CountryData as WorldCountryData 
} from './features/worldDataApi';
import { 
  fetchRegionInfo, 
  fetchHistoricalData, 
  RegionData 
} from './features/regionInfoApi';

// 데이터 타입 옵션
type DataType = 'temperature' | 'humidity' | 'co2';

const Earth: React.FC = () => {
  // 각 기능별 상태 관리
  const [worldData, setWorldData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionInfo, setRegionInfo] = useState<RegionData | null>(null);
  
  // 시간 범위 관련 상태
  const [timeRange, setTimeRange] = useState<TimeRange>('hour');
  const [timeValue, setTimeValue] = useState<number>(0);
  
  // 데이터 타입 상태
  const [dataType, setDataType] = useState<DataType>('temperature');
  
  
  // 모든 국가에 대한 데이터
  const [globalData, setGlobalData] = useState<Record<string, WorldCountryData>>({});
  
  // 히스토리 데이터
  const [historicalData, setHistoricalData] = useState<{
    temperatures: { timestamp: string; value: number }[];
    co2Levels: { timestamp: string; value: number }[];
  }>({
    temperatures: [],
    co2Levels: []
  });
  
  // 초기 데이터 로딩
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const currentDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
        
        // 세계 데이터 로드
        const worldDataResponse = await fetchWorldData(startDate, currentDate, 'HOUR');
        
        // groupByDateTime에서 최신 데이터 추출
        const latestTimestamp = Object.keys(worldDataResponse.groupByDateTime).pop();
        
        if (latestTimestamp) {
          // 최신 타임스탬프의 국가별 데이터 추출
          const latestData = worldDataResponse.groupByDateTime[latestTimestamp];
          
          // 데이터 설정
          setWorldData(worldDataResponse);
          setGlobalData(latestData);
          
          console.log('로드된 데이터:', latestTimestamp, latestData);
        } else {
          console.warn('타임스탬프 데이터가 없습니다');
        }
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
      }
    };
    
    loadInitialData();
  }, []);
  
  // 시간 및 데이터 타입 변경 시 글로벌 데이터 업데이트
  // 코드 수정
  useEffect(() => {
    const updateGlobalData = async () => {
      try {
        const currentDate = new Date().toISOString();
        const startDate = new Date(Date.now() - timeValue * getTimeMultiplier(timeRange)).toISOString();
        
        const worldDataResponse = await fetchWorldData(startDate, currentDate, timeRange.toUpperCase() as 'HOUR');
        
        // groupByDateTime 객체가 있는지 확인
        if (worldDataResponse && worldDataResponse.groupByDateTime) {
          const timestamps = Object.keys(worldDataResponse.groupByDateTime);
          console.log('응답 타임스탬프:', timestamps);
          
          if (timestamps.length > 0) {
            const latestTimestamp = timestamps[timestamps.length - 1];
            const latestData = worldDataResponse.groupByDateTime[latestTimestamp];
            
            console.log('업데이트된 데이터:', latestTimestamp, latestData);
            setGlobalData(latestData);
          } else {
            console.warn('타임스탬프 데이터가 없습니다');
          }
        } else {
          console.warn('API 응답에 groupByDateTime이 없습니다:', worldDataResponse);
        }
      } catch (error) {
        console.error('글로벌 데이터 업데이트 실패:', error);
      }
    };
    
    updateGlobalData();
  }, [timeRange, timeValue]);
  
  // 지역 선택 시 히스토리 데이터 로드
  useEffect(() => {
    if (selectedRegion) {
      const loadRegionData = async () => {
        try {
          // 지역 정보 로드
          const regionData = await fetchRegionInfo({
            region: selectedRegion,
            timeRange,
            timeValue
          });
          setRegionInfo(regionData);
          
          // 히스토리 데이터 로드
          const histData = await fetchHistoricalData({
            region: selectedRegion,
            timeRange
          });
          setHistoricalData(histData);
        } catch (error) {
          console.error('지역 데이터 로드 실패:', error);
        }
      };
      
      loadRegionData();
    }
  }, [selectedRegion, timeRange, timeValue]);
  
  // 시간 승수 계산 함수
  const getTimeMultiplier = (range: TimeRange): number => {
    switch (range) {
      case 'hour': return 1000 * 60 * 60;
      case 'day': return 1000 * 60 * 60 * 24;
      case 'month': return 1000 * 60 * 60 * 24 * 30;
      case 'all': return 1000 * 60 * 60 * 24 * 365;
      default: return 1000 * 60 * 60;
    }
  };
  
  // 지역 선택 핸들러
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };
  
  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (type: DataType) => {
    setDataType(type);
  };
  
  // 지역 정보 닫기 핸들러
  const handleCloseRegionInfo = () => {
    setSelectedRegion(null);
    setRegionInfo(null);
  };
  
  // 시간 값 변경 핸들러
  const handleTimeValueChange = (value: number) => {
    setTimeValue(value);
  };
  
  // 시간 범위 변경 핸들러
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setTimeValue(0);
  };

  // 지도 컴포넌트 구성
  const mapContent = (
    <>
      <WorldMap 
        data={worldData} 
        countriesData={globalData}
        timeRange={timeRange}
        timeValue={timeValue}
        dataType={dataType}  // 여기서 타입이 명확히 지정됨
        onDataTypeChange={handleDataTypeChange}
        onRegionSelect={handleRegionSelect} 
      />
      
      {/* 지역 정보 패널 (선택된 지역이 있을 때만 표시) */}
      {selectedRegion && regionInfo && (
        <RegionInfo 
          data={regionInfo} 
          onClose={handleCloseRegionInfo}
          showCharts={false}
        />
      )}
    </>
  );
  
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 기존 레이아웃 그대로 유지 */}
      <div className='absolute top-4 left-4 z-30'>
        <GoMainBtn />
      </div>
      
      <div 
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="p-4 pb-16 min-h-full">
          <div className="flex flex-col lg:flex-row items-start justify-center">
            <div className="w-full lg:w-2/3 h-[75vh] rounded-xl">
              <MapLayout
                mapContent={mapContent}
                historicalData={historicalData}
                selectedRegion={selectedRegion}
              />
            </div>
            
            <div className="w-full lg:w-1/3 mt-4 lg:mt-0 scale-90">
              <TimeSlider
                timeRange={timeRange}
                onChange={handleTimeValueChange}
                onRangeChange={handleTimeRangeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earth;