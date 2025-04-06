import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RegionDataChart from './RegionDataChart';
import { RegionData } from '../features/regionInfoApi';
import { getCountryDescription, getCountryNameByCode } from '../utils/countryUtils';


// 스타일 컴포넌트 정의
const LayoutContainer = styled.div`
  position: relative;
  top: 5px;
  width: calc(100% - 40px);
  height: 100%;
  margin: 25px auto 0; /* 상단 여백 25px, 좌우 자동(가운데 정렬) */
  border-radius: 10px;
  overflow: hidden; // 넘치는 부분 숨김
  background-color: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center; /* 가로 중앙 */
  align-items: center;     /* 세로 중앙 */
`;

const MapArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden; // 넘치는 부분 숨김
  border-radius: 10px;
`;

const ChartsContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  width: 100%;
  height: ${(props) => (props.isOpen ? '280px' : '0')};
  bottom: 0;
  left: 0;
  background-color: white;
  transition: height 0.3s ease-in-out;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 10; // 지도 위에 표시되도록 z-index 추가
`;

const ChartToggle = styled.button`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  z-index: 15; // 지도 위에 표시되도록 z-index 증가
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f9fafb;
  }
`;

const ChartsHeader = styled.div`
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`;

const ChartsTitle = styled.h3`
  margin-top: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #374151;
`;

// 데이터 요약 영역 - 상단에 추가
const DataSummary = styled.div`
  display: flex;
  gap: 15px;
  padding: 8px 15px;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
  
  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  min-width: 80px;
  max-height: 45px;
  background-color: #f9fafb;
  border-radius: 6px;
`;

const DataLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 2px;
`;

const DataValue = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
`;

// 차트 컨테이너 스타일 수정 - 가로 스크롤 지원
const ChartsContent = styled.div`
  flex: 1;
  display: flex;
  overflow-x: auto;
  padding: 10px 15px;
  gap: 15px;
  
  /* 스크롤바 스타일 커스터마이징 */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

const ChartItem = styled.div`
  flex: 0 0 auto;
  min-width: 250px;
  max-width: 350px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 30px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  text-align: center;
  padding: 20px;
`;

const DescriptionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 12px;
  color: #4b5563;
  max-height: 45px;
`;


// 히스토리 데이터 인터페이스
interface HistoricalData {
  temperatures: { timestamp: string; value: number }[];
  co2Levels: { timestamp: string; value: number }[];
  humidity: { timestamp: string; value: number }[]; // humidity 필드가 이미 있음
}
// 확장된 HistoricalData 인터페이스 정의
interface ExtendedHistoricalData {
  temperatures: { timestamp: string; value: number }[];
  co2Levels: { timestamp: string; value: number }[];
  humidity: { timestamp: string; value: number }[];
}

// 확장된 RegionData 인터페이스 정의
interface ExtendedRegionData extends Omit<RegionData, 'historicalData'> {
  historicalData?: ExtendedHistoricalData;
}

// 컴포넌트 프롭스 인터페이스
interface MapLayoutProps {
  mapContent: React.ReactNode;
  historicalData: HistoricalData;
  selectedRegion: string | null;
  loading?: boolean;
  noData?: boolean;
  data: ExtendedRegionData;
}

const MapLayout: React.FC<MapLayoutProps> = ({
  mapContent,
  historicalData,
  selectedRegion,
  loading = false,
  noData = false,
  data = {} as ExtendedRegionData
}) => {
  const [isChartsOpen, setIsChartsOpen] = useState<boolean>(false);
  
  // 디버깅용 로그 추가
  useEffect(() => {
    console.log('MapLayout 컴포넌트 상태:', {
      selectedRegion,
      loading,
      noData,
      historicalData: {
        temperatures: historicalData?.temperatures?.length || 0,
        humidity: historicalData?.humidity?.length || 0,
        co2Levels: historicalData?.co2Levels?.length || 0
      }
    });
  }, [selectedRegion, loading, noData, historicalData]);
  
  // 선택된 지역 변경 시 차트 자동 열기 (데이터가 있는 경우에만)
  useEffect(() => {
    // 선택된 지역이 있고 로딩 중이 아닐 때
    if (selectedRegion) {
      console.log('지역 선택 감지: 차트 표시 여부 결정');
      // 로딩이 끝난 후에 데이터 여부에 따라 차트 열기/닫기
      if (!loading) {
        const hasData = 
          (historicalData?.temperatures?.length > 0) || 
          (historicalData?.humidity?.length > 0) || 
          (historicalData?.co2Levels?.length > 0);
        
        console.log('데이터 여부:', hasData, '차트 열기:', hasData && !noData);
        setIsChartsOpen(hasData && !noData);
      } else {
        // 로딩 중에는 차트 영역 보여주기 (로딩 스피너 표시)
        setIsChartsOpen(true);
      }
    } else {
      // 선택된 지역이 없으면 차트 닫기
      setIsChartsOpen(false);
    }
  }, [selectedRegion, loading, noData, historicalData]);
  
  // 차트 열기/닫기 토글
  const toggleCharts = () => {
    setIsChartsOpen(!isChartsOpen);
  };
  
  // 지역명 가져오기
  const regionName = selectedRegion ? getCountryNameByCode(selectedRegion) || selectedRegion : '';
  
  // 데이터가 있는지 확인 (배열이 비어있지 않은지)
  const hasTemperatureData = historicalData?.temperatures?.length > 0;
  const hasHumidityData = historicalData?.humidity?.length > 0;
  const hasCO2Data = historicalData?.co2Levels?.length > 0;
  
  // 표시 가능한 데이터가 있는지 확인
  const hasAnyData = hasTemperatureData || hasHumidityData || hasCO2Data;
  
  // 차트 토글 버튼 텍스트
  const toggleButtonText = isChartsOpen ? '차트 숨기기' : '차트 보기';

  // 현재 데이터 값 포맷팅 함수
  const formatValue = (value: number | undefined, unit: string): string => {
    if (value === undefined) return '데이터 없음';
    return `${value.toFixed(1)} ${unit}`;
  };
  
  // 최신 데이터 값 가져오기
  const getLatestValue = (dataPoints: { timestamp: string; value: number }[]): number | undefined => {
    if (!dataPoints || dataPoints.length === 0) return undefined;
    return dataPoints[dataPoints.length - 1].value;
  };
  
  // 각 데이터의 최신 값
  const latestTemperature = hasTemperatureData ? getLatestValue(historicalData.temperatures) : undefined;
  const latestHumidity = hasHumidityData ? getLatestValue(historicalData.humidity) : undefined;
  const latestCO2 = hasCO2Data ? getLatestValue(historicalData.co2Levels) : undefined;
  
  // 디버깅용 로그 추가
  useEffect(() => {
    console.log('MapLayout 데이터:', data);
    console.log('countryCode 존재 여부:', !!data?.countryCode);
    if (data?.countryCode) {
      console.log('설명 함수 반환 값:', getCountryDescription(data.countryCode));
    }
  }, [data, data?.countryCode]);

  return (
    <LayoutContainer>
      <MapArea>
        {mapContent}
      </MapArea>
      
      {/* 차트 토글 버튼 (선택된 지역이 있고 데이터가 있거나 로딩 중일 때만 표시) */}
      {selectedRegion && (loading || hasAnyData || noData) && (
        <ChartToggle onClick={toggleCharts}>
          {toggleButtonText}
        </ChartToggle>
      )}
      
      {/* 차트 컨테이너 */}
      <ChartsContainer isOpen={isChartsOpen && !!selectedRegion}>
        <ChartsHeader>
          <ChartsTitle>
            {regionName ? `${regionName} 지역 데이터` : '지역 데이터'}
          </ChartsTitle>
        </ChartsHeader>
        
        {/* 데이터 요약 영역 (로딩 중이 아니고 데이터가 있을 때) */}
        {!loading && !noData && hasAnyData && (
          <DataSummary>
            {hasTemperatureData && (
              <DataItem>
                <DataLabel>현재 온도</DataLabel>
                <DataValue>{formatValue(latestTemperature, '°C')}</DataValue>
              </DataItem>
            )}
            
            {hasHumidityData && (
              <DataItem>
                <DataLabel>현재 습도</DataLabel>
                <DataValue>{formatValue(latestHumidity, '%')}</DataValue>
              </DataItem>
            )}
            
            {hasCO2Data && (
              <DataItem>
                <DataLabel>현재 CO₂</DataLabel>
                <DataValue>{formatValue(latestCO2, 'ppm')}</DataValue>
              </DataItem>
            )}

            {/* 설명 영역 - 가로로 나열하기 위해 DataItem 안에 포함 */}
            {data && data.countryCode && (
              <DescriptionBox style={{ flex: '1 1 auto', minWidth: '200px', margin: '0' }}>
                {getCountryDescription(data.countryCode)}
              </DescriptionBox>
            )}
          </DataSummary>
        )}
        
        {/* 로딩 중일 때 표시 */}
        {loading && (
          <LoadingContainer>
            <LoadingSpinner />
            <div>데이터를 불러오는 중...</div>
          </LoadingContainer>
        )}
        
        {/* 데이터가 없을 때 표시 */}
        {!loading && noData && (
          <NoDataContainer>
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {regionName} 지역의 데이터가 없습니다
            </h3>
            <p className="text-gray-500 text-sm mb-2">
              현재 해당 지역의 데이터를 이용할 수 없습니다.
            </p>
            <p className="text-gray-400 text-xs">
              추후 업데이트 예정입니다.
            </p>
          </NoDataContainer>
        )}
        
        {/* 데이터가 있을 때 차트 표시 - 가로 스크롤로 변경 */}
        {!loading && !noData && hasAnyData && (
          <ChartsContent>
            {/* 온도 차트 */}
            {hasTemperatureData && (
              <ChartItem>
                <RegionDataChart
                  title="온도 추이"
                  dataPoints={historicalData.temperatures}
                  label="온도"
                  borderColor="#ef4444"
                  backgroundColor="rgba(239, 68, 68, 0.2)"
                  yAxisLabel="온도 (°C)"
                  yAxisMin={-10}
                  yAxisMax={40}
                />
              </ChartItem>
            )}
            
            {/* 습도 차트 */}
            {hasHumidityData && (
              <ChartItem>
                <RegionDataChart
                  title="습도 추이"
                  dataPoints={historicalData.humidity}
                  label="습도"
                  borderColor="#10b981"
                  backgroundColor="rgba(16, 185, 129, 0.2)"
                  yAxisLabel="습도 (%)"
                  yAxisMin={0}
                  yAxisMax={100}
                />
              </ChartItem>
            )}
            
            {/* CO2 차트 */}
            {hasCO2Data && (
              <ChartItem>
                <RegionDataChart
                  title="이산화탄소 농도 추이"
                  dataPoints={historicalData.co2Levels}
                  label="CO2"
                  borderColor="#3b82f6"
                  backgroundColor="rgba(59, 130, 246, 0.2)"
                  yAxisLabel="CO2 (ppm)"
                  yAxisMin={350}
                  yAxisMax={450}
                />
              </ChartItem>
            )}
          </ChartsContent>
        )}
      </ChartsContainer>
    </LayoutContainer>
  );
};

export default MapLayout;