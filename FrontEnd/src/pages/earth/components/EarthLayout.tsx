import React, { useState } from 'react';
import RegionDataChart from './RegionDataChart';

// 인터페이스 정의
interface MapLayoutProps {
  mapContent: React.ReactNode; // 지도 컴포넌트
  historicalData: {
    co2Levels: { timestamp: string; value: number }[];
    temperatures: { timestamp: string; value: number }[];
  };
  selectedRegion: string | null;
}

const MapLayout: React.FC<MapLayoutProps> = ({
  mapContent,
  historicalData,
  selectedRegion
}) => {
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false);
  
  // 차트 토글 핸들러
  const toggleChart = () => {
    setIsChartOpen(!isChartOpen);
  };
  
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
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-medium mb-3 text-gray-800">이산화탄소 농도 변화</h3>
                <RegionDataChart
                  title={`${selectedRegion} 이산화탄소 농도`}
                  dataPoints={historicalData.co2Levels}
                  label="CO2 농도"
                  borderColor="#4C51BF"
                  backgroundColor="rgba(76, 81, 191, 0.1)"
                  yAxisLabel="ppm"
                  yAxisMin={350}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800">온도 변화</h3>
                <RegionDataChart
                  title={`${selectedRegion} 온도`}
                  dataPoints={historicalData.temperatures}
                  label="평균 온도"
                  borderColor="#E53E3E"
                  backgroundColor="rgba(229, 62, 62, 0.1)"
                  yAxisLabel="°C"
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