import React, { useState } from 'react';
import styled from 'styled-components';
import { RegionData } from '../features/regionInfoApi';
import { getCountryNameByCode } from '../utils/countryUtils';

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

// 스타일 컴포넌트 정의
const RegionInfoContainer = styled.div`
  position: absolute;
  top: 50px;
  left: 120px;
  right: 40px;
  width: 320px;
  max-width: calc(100% - 350px); // 화면 크기에 맞게 최대 너비 제한
  height: 220px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 20;
  
  @media (max-width: 768px) {
    width: calc(100% - 20px); // 모바일에서는 화면 너비에 맞춤
    right: 50%;
    transform: translateX(50%); // 중앙 정렬
    max-height: 70%; // 모바일에서는 조금 더 작게
  }
`;

const RegionHeader = styled.div`
  padding: 5px;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RegionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
`;

const RegionContent = styled.div`
  padding: 15px;
  overflow-y: auto;
`;

// 데이터 표시 영역의 스타일 수정 - 그리드 레이아웃 사용
const DataSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const DataItem = styled.div`
  text-align: center;
  padding: 8px 4px;
  background-color: #f9fafb;
  border-radius: 6px;
`;

const DataLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const DataValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
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
  padding: 30px 15px;
  text-align: center;
`;

const NoDataIcon = styled.div`
  font-size: 30px;
  color: #9ca3af;
  margin-bottom: 15px;
`;

const DescriptionBox = styled.div`
  margin-bottom: 12px;
  padding: 8px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  color: #4b5563;
`;

interface RegionInfoProps {
  data: ExtendedRegionData;
  onClose: () => void;
  showCharts?: boolean;
  loading?: boolean;
  noData?: boolean;
}

const RegionInfo: React.FC<RegionInfoProps> = ({
  data,
  onClose,
  loading = false,
  noData = false
}) => {
  
  const formatValue = (value: number | undefined, unit: string, precision: number = 1): string => {
    if (value === undefined) return '데이터 없음';
    return `${value.toFixed(precision)} ${unit}`;
  };
  
  // 지역명 표시
  const regionName = getCountryNameByCode(data.countryCode) || data.name || data.countryCode;
  
  return (
    <RegionInfoContainer>
      <RegionHeader>
        <RegionTitle>{regionName}</RegionTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </RegionHeader>
      
      {loading ? (
        // 로딩 중 표시
        <LoadingContainer>
          <LoadingSpinner />
          <div>데이터를 불러오는 중...</div>
        </LoadingContainer>
      ) : noData ? (
        // 데이터 없음 표시
        <NoDataContainer>
          <NoDataIcon>📊</NoDataIcon>
          <h3 className="text-lg font-medium text-gray-700 mb-2">{regionName}의 데이터가 없습니다</h3>
          <p className="text-gray-500 text-sm mb-4">
            현재 해당 지역의 데이터를 이용할 수 없습니다.
          </p>
          <p className="text-gray-400 text-xs">추후 업데이트 예정입니다.</p>
        </NoDataContainer>
      ) : (
        // 데이터 있을 때 표시
        <RegionContent>
          {/* 주요 데이터 요약 (그리드 레이아웃으로 변경) */}
          <DataSummary>
            <DataItem>
              <DataLabel>평균 온도</DataLabel>
              <DataValue>{formatValue(data.temperature, '°C')}</DataValue>
            </DataItem>
            
            <DataItem>
              <DataLabel>평균 습도</DataLabel>
              <DataValue>{formatValue(data.humidity, '%')}</DataValue>
            </DataItem>
            
            <DataItem>
              <DataLabel>평균 CO₂</DataLabel>
              <DataValue>{formatValue(data.co2Level, 'ppm')}</DataValue>
            </DataItem>
          </DataSummary>
          
          {/* 설명 영역 (있는 경우에만 표시) */}
          {data.description && (
            <DescriptionBox>
              {data.description}
            </DescriptionBox>
          )}
        </RegionContent>
      )}
    </RegionInfoContainer>
  );
};

export default RegionInfo;