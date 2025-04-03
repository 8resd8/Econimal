import React, { useState, useEffect } from 'react';
import RegionDataChart from './RegionDataChart';
import { getCountryNameByCode } from '../utils/countryUtils';

// 인터페이스 정의
interface MapLayoutProps {
  mapContent: React.ReactNode; // 지도 컴포넌트
  historicalData: {
    temperatures: { timestamp: string; value: number }[];
    co2Levels: { timestamp: string; value: number }[];
    humidity?: { timestamp: string; value: number }[]; // 습도 데이터 추가
  };
  selectedRegion: string | null;
}

const MapLayout: React.FC<MapLayoutProps> = ({
  mapContent,
  historicalData,
  selectedRegion
}) => {
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false);
  
  // 데이터가 있을 때 자동으로 차트 패널 열기
  useEffect(() => {
    if (selectedRegion && 
        (historicalData.temperatures.length > 0 || 
         historicalData.co2Levels.length > 0 ||
         (historicalData.humidity && historicalData.humidity.length > 0))) {
      setIsChartOpen(true);
    }
  }, [selectedRegion, historicalData]);

  // 디버깅용 데이터 로깅
  useEffect(() => {
    if (selectedRegion) {
      console.log('선택된 지역:', selectedRegion);
      console.log('온도 데이터:', historicalData.temperatures.length, '개 항목');
      console.log('CO2 데이터:', historicalData.co2Levels.length, '개 항목');
      console.log('습도 데이터:', historicalData.humidity?.length || 0, '개 항목');
      
      // 데이터 샘플 로깅
      if (historicalData.temperatures.length > 0) {
        console.log('온도 데이터 샘플:', historicalData.temperatures[0]);
      }
      if (historicalData.co2Levels.length > 0) {
        console.log('CO2 데이터 샘플:', historicalData.co2Levels[0]);
      }
      if (historicalData.humidity && historicalData.humidity.length > 0) {
        console.log('습도 데이터 샘플:', historicalData.humidity[0]);
      }
    }
  }, [selectedRegion, historicalData]);
  
  // 차트 토글 핸들러
  const toggleChart = () => {
    setIsChartOpen(!isChartOpen);
  };

  // 데이터가 없는 경우에도 더미 데이터 생성
  const generateDummyData = (type: 'temperature' | 'co2' | 'humidity', count: number = 7) => {
    const now = new Date();
    const dummyData = [];
    
    for (let i = 0; i < count; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      let value;
      switch (type) {
        case 'temperature':
          value = 20 + Math.random() * 10; // 20~30°C
          break;
        case 'co2':
          value = 380 + Math.random() * 40; // 380~420ppm
          break;
        case 'humidity':
          value = 40 + Math.random() * 50; // 40~90%
          break;
      }
      
      dummyData.push({
        timestamp: date.toISOString(),
        value
      });
    }
    
    return dummyData.reverse(); // 시간순 정렬
  };

  // 유효한 차트 데이터 확인
  const hasTemperatureData = historicalData.temperatures && historicalData.temperatures.length > 0;
  const hasCO2Data = historicalData.co2Levels && historicalData.co2Levels.length > 0;
  const hasHumidityData = historicalData.humidity && historicalData.humidity.length > 0;
  
  // 실제 데이터 또는 더미 데이터
  const temperatureData = hasTemperatureData 
    ? historicalData.temperatures 
    : generateDummyData('temperature');
    
  const co2Data = hasCO2Data 
    ? historicalData.co2Levels 
    : generateDummyData('co2');
    
  const humidityData = hasHumidityData && historicalData.humidity
    ? historicalData.humidity
    : generateDummyData('humidity');
  
  // 국가 이름 가져오기 (코드에서 변환)
  const regionName = selectedRegion 
    ? getCountryNameByCode(selectedRegion) || selectedRegion 
    : '';
  
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <div className="relative w-full h-full">
        {mapContent}
        
        {/* 차트 토글 버튼 */}
        <button 
          className="absolute top-4 right-12 bg-white/80 hover:bg-white/90 px-3 py-2 rounded-md flex items-center gap-2 text-sm font-semibold transition-all shadow-md z-20"
          onClick={toggleChart}
        >
          {isChartOpen ? (
            <>
              <svg width="10" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              차트 닫기
            </>
          ) : (
            <>
              차트 보기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
        
        {/* 차트 패널 */}
        <div 
          className={`absolute top-0 right-0 w-80 h-full bg-white/90
            backdrop-blur-sm rounded-l-lg p-5 overflow-y-auto transition-all
            duration-300 ease-in-out shadow-lg z-10 ${
            isChartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedRegion ? (
            <>
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-medium mb-3 text-gray-800">{regionName} 데이터</h3>
                
                {/* 데이터 소스 표시 */}
                <div className="text-xs text-gray-500 mb-2">
                  {(hasTemperatureData || hasCO2Data || hasHumidityData) 
                    ? '실제 API 데이터' 
                    : '더미 데이터 (API 데이터 없음)'}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800">온도 변화</h3>
                <RegionDataChart
                  title={`${regionName} 온도 데이터`}
                  dataPoints={temperatureData}
                  label="평균 온도"
                  borderColor="#E53E3E"
                  backgroundColor="rgba(229, 62, 62, 0.1)"
                  yAxisLabel="°C"
                  yAxisMin={0}
                  yAxisMax={40}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800">습도 변화</h3>
                <RegionDataChart
                  title={`${regionName} 습도 데이터`}
                  dataPoints={humidityData}
                  label="습도"
                  borderColor="#38A169"
                  backgroundColor="rgba(56, 161, 105, 0.1)"
                  yAxisLabel="%"
                  yAxisMin={0}
                  yAxisMax={100}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800">이산화탄소 농도 변화</h3>
                <RegionDataChart
                  title={`${regionName} CO2 농도`}
                  dataPoints={co2Data}
                  label="CO2 농도"
                  borderColor="#4C51BF"
                  backgroundColor="rgba(76, 81, 191, 0.1)"
                  yAxisLabel="ppm"
                  yAxisMin={350}
                  yAxisMax={450}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              지역을 선택하면 차트 데이터가 표시됩니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapLayout;