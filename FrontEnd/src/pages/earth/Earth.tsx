import React, { useState, useEffect } from 'react';
import bgImage from "@/assets/auth_background.png"; // 배경 이미지
import GoMainBtn from '@/components/GoMainBtn';

// Components
import WorldMap from './components/WorldMap';
import RegionInfo from './components/RegionInfo';
import TimeSlider from './components/TimeSlider';
import { TimeRange } from './components/TimeSlider';
import MapLayout from './components/EarthLayout';

// Features (API 관련)
import { fetchWorldData, fetchWorldDataByTime } from './features/worldDataApi';
import { 
  fetchRegionInfo, 
  fetchHistoricalData, 
  RegionData 
} from './features/regionInfoApi';

// 국가별 데이터 인터페이스
interface CountryData {
  co2Level?: number;
  temperature?: number;
  [key: string]: any;
}

// 데이터 타입 옵션
type DataType = 'co2' | 'temperature';

const Earth: React.FC = () => {
  // 각 기능별 상태 관리
  const [worldData, setWorldData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionInfo, setRegionInfo] = useState<RegionData | null>(null);
  
  // 시간 범위 관련 상태
  const [timeRange, setTimeRange] = useState<TimeRange>('hour');
  const [timeValue, setTimeValue] = useState<number>(0);
  
  // 데이터 타입 상태
  const [dataType, setDataType] = useState<DataType>('co2');
  
  // 모든 국가에 대한 데이터
  const [globalData, setGlobalData] = useState<Record<string, CountryData>>({});
  
  // 히스토리 데이터
  const [historicalData, setHistoricalData] = useState<{
    co2Levels: { timestamp: string; value: number }[];
    temperatures: { timestamp: string; value: number }[];
  }>({
    co2Levels: [],
    temperatures: []
  });
  
  // 초기 데이터 로딩
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 세계 데이터 로드
        const worldDataResponse = await fetchWorldData();
        setWorldData(worldDataResponse);
        
        // 전역 데이터 로드
        const globalDataResponse = await fetchWorldDataByTime(timeRange, timeValue);
        if (globalDataResponse && globalDataResponse.countries) {
          setGlobalData(globalDataResponse.countries);
        }
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
      }
    };
    
    loadInitialData();
  }, []);
  
  // 시간 및 데이터 타입 변경 시 글로벌 데이터 업데이트
  useEffect(() => {
    const updateGlobalData = async () => {
      try {
        // 전역 데이터 업데이트
        const globalDataResponse = await fetchWorldDataByTime(timeRange, timeValue);
        if (globalDataResponse && globalDataResponse.countries) {
          setGlobalData(globalDataResponse.countries);
        }
      } catch (error) {
        console.error('글로벌 데이터 업데이트 실패:', error);
      }
    };
    
    updateGlobalData();
  }, [timeRange, timeValue, dataType]);
  
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
        dataType={dataType}
        onDataTypeChange={handleDataTypeChange}
        onRegionSelect={handleRegionSelect} 
      />
      
      {/* 지역 정보 패널 (선택된 지역이 있을 때만 표시) */}
      {selectedRegion && regionInfo && (
        <RegionInfo 
          data={regionInfo} 
          onClose={handleCloseRegionInfo}
          showCharts={false} // 차트는 사이드 패널에 표시되므로 여기서는 숨김
        />
      )}
    </>
  );
  
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className='absolute top-4 left-4 z-30'>
        <GoMainBtn />
      </div>
      {/* 독립적인 스크롤 컨테이너 */}
      <div 
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* 내부 콘텐츠 */}
        <div className="p-4 pb-16 min-h-full">
          {/* 메인 컨텐츠 컨테이너 - 좌우 배치 */}
          <div className="flex flex-col lg:flex-row items-start justify-center">
            {/* 왼쪽: 지도 컨테이너 */}
            <div className="w-full lg:w-2/3 h-[75vh] rounded-xl">
              <MapLayout
                mapContent={mapContent}
                historicalData={historicalData}
                selectedRegion={selectedRegion}
              />
            </div>
            
            {/* 오른쪽: 타임 슬라이더 컨테이너 */}
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