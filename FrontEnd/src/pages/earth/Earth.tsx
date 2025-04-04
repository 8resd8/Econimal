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
        
        // 응답 데이터 디버깅
        console.log('백엔드 응답 데이터:', worldDataResponse);
        
        // groupByDateTime이 있는지 확인
        if (worldDataResponse && worldDataResponse.groupByDateTime) {
          // 사용 가능한 타임스탬프 가져오기
          const timestamps = Object.keys(worldDataResponse.groupByDateTime);
          
          if (timestamps.length > 0) {
            // 타임스탬프를 날짜순으로 정렬
            timestamps.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
            
            // 최신 타임스탬프 선택
            const latestTimestamp = timestamps[0];
            console.log('사용할 최신 타임스탬프:', latestTimestamp);
            
            // 최신 타임스탬프의 데이터
            const latestData = worldDataResponse.groupByDateTime[latestTimestamp];
            
            // 데이터가 있는 국가 목록
            const countries = Object.keys(latestData);
            console.log('최신 데이터에 포함된 국가:', countries.length, '개 국가', countries);
            
            // 그린란드(GL) 데이터 확인
            if (latestData['GL']) {
              console.log('그린란드 데이터 확인:', latestData['GL']);
            } else {
              console.log('그린란드 데이터 없음, 더미 데이터 생성');
              latestData['GL'] = {
                temperature: -10 + Math.random() * 5, // -10~-5도
                humidity: 70 + Math.random() * 10,    // 70~80%
                co2Level: 350 + Math.random() * 20    // 350~370ppm
              };
            }
            
            // 데이터 설정
            setWorldData(worldDataResponse);
            setGlobalData(latestData);
            
            console.log('최종 사용 데이터:', Object.keys(latestData).length, '개 국가');
          } else {
            console.warn('타임스탬프 데이터가 없습니다, 더미 데이터 사용');
            generateAndSetDummyData();
          }
        } else {
          console.warn('API 응답에 groupByDateTime이 없습니다, 더미 데이터 사용');
          generateAndSetDummyData();
        }
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
        console.warn('오류로 인해 더미 데이터 사용');
        generateAndSetDummyData();
      }
    };
    
    loadInitialData();
  }, []);

  // 더미 데이터 생성 및 설정 함수 추가
  const generateAndSetDummyData = () => {
    // WorldMap.tsx에 있는 generateDummyData 함수와 유사한 로직
    const dummyData: Record<string, any> = {};
    
    // 더 많은 국가 포함 (그린란드 포함)
    const countries = [
      "KR", "JP", "US", "CN", "RU", "GB", "FR", "DE", "IT", "CA", "AU", "IN", "BR", 
      "GL", "SE", "FI", "EG", "ZA", "AR", "MV", "TH", "SD", "MN"
    ];
    
    countries.forEach(code => {
      if (code === 'GL') {
        // 그린란드 - 추운 지역
        dummyData[code] = {
          temperature: -10 + Math.random() * 5, // -10~-5도
          humidity: 70 + Math.random() * 10,    // 70~80%
          co2Level: 350 + Math.random() * 20    // 350~370ppm
        };
      } else if (["SE", "FI", "RU", "CA", "MN"].includes(code)) {
        // 다른 추운 지역
        dummyData[code] = {
          temperature: -5 + Math.random() * 15, // -5~10도
          humidity: 50 + Math.random() * 40,    // 50~90%
          co2Level: 350 + Math.random() * 50    // 350~400ppm
        };
      } else if (["EG", "SD", "IN", "MV", "TH"].includes(code)) {
        // 더운 지역
        dummyData[code] = {
          temperature: 25 + Math.random() * 15, // 25~40도
          humidity: 40 + Math.random() * 55,    // 40~95%
          co2Level: 380 + Math.random() * 70    // 380~450ppm
        };
      } else {
        // 온대 지역
        dummyData[code] = {
          temperature: 10 + Math.random() * 20, // 10~30도
          humidity: 40 + Math.random() * 60,    // 40~100%
          co2Level: 350 + Math.random() * 100   // 350~450ppm
        };
      }
    });
    
    console.log('생성된 더미 데이터:', Object.keys(dummyData).length, '개 국가');
    
    // 더미 데이터 설정
    setGlobalData(dummyData);
  };
    
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