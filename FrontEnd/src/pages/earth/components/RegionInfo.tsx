import React from 'react';
import styled from 'styled-components';
import { RegionData } from './RegionDataService';

const RegionInfoContainer = styled.div`
  position: absolute;
  top: 50px;
  bottom: 120px; /* 슬라이더 위에 위치하도록 조정 */
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 350px;
  height: 170px;
  z-index: 10;
  transition: all 0.3s ease;
  scale: 75%;
  overflow-y: scroll;
`;

const RegionTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 18px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
`;

const RegionDescription = styled.p`
  margin: 0;
  color: #34495e;
  font-size: 14px;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
`;

const RegionStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 10px;
`;

const StatItem = styled.div`
  background-color: #f0f7ff;
  padding: 8px;
  border-radius: 4px;
  flex: 1 1 45%;
  min-width: 100px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #7f8c8d;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #2980b9;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  color: #95a5a6;
  cursor: pointer;
  
  &:hover {
    color: #e74c3c;
  }
`;

const ConservationList = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 20px;
  font-size: 12px;
  color: #34495e;
  line-height: 1.4;
  max-height: 80px;
  overflow-y: auto;
`;

interface RegionInfoProps {
  data: RegionData | null;
  onClose?: () => void;
  showCharts?: boolean; // 차트 표시 여부 (기본값: true)
}

const RegionInfo: React.FC<RegionInfoProps> = ({ 
  data, 
  onClose,
  showCharts = true // 기본적으로 차트 표시
}) => {
  if (!data) return null;
  
  // 데이터가 없는 필드는 표시하지 않기
  const hasDetailedStats = data.population || data.area || data.environmentalIndex || data.biodiversityCount;
  
  return (
    <RegionInfoContainer>
      <RegionTitle>{data.name}</RegionTitle>
      {onClose && <CloseButton onClick={onClose}>×</CloseButton>}
      
      <RegionDescription>{data.description}</RegionDescription>
      
      {hasDetailedStats && (
        <RegionStats>
          {data.co2Level !== undefined && (
            <StatItem>
              <StatLabel>이산화탄소 농도</StatLabel>
              <StatValue>{data.co2Level.toFixed(1)} ppm</StatValue>
            </StatItem>
          )}
          
          {data.temperature !== undefined && (
            <StatItem>
              <StatLabel>평균 온도</StatLabel>
              <StatValue>{data.temperature.toFixed(1)} °C</StatValue>
            </StatItem>
          )}
          
          {data.environmentalIndex !== undefined && (
            <StatItem>
              <StatLabel>환경 지수</StatLabel>
              <StatValue>{data.environmentalIndex.toFixed(1)}</StatValue>
            </StatItem>
          )}
          
          {data.biodiversityCount !== undefined && (
            <StatItem>
              <StatLabel>생물다양성</StatLabel>
              <StatValue>{data.biodiversityCount.toLocaleString()}</StatValue>
            </StatItem>
          )}
          
          {data.threatLevel !== undefined && (
            <StatItem>
              <StatLabel>위협 수준</StatLabel>
              <StatValue>{data.threatLevel.toFixed(1)}</StatValue>
            </StatItem>
          )}
        </RegionStats>
      )}
      
      {data.conservationEfforts && data.conservationEfforts.length > 0 && (
        <>
          <StatLabel style={{ marginTop: '10px', marginBottom: '5px' }}>보존 노력</StatLabel>
          <ConservationList>
            {data.conservationEfforts.map((effort, index) => (
              <li key={index}>{effort}</li>
            ))}
          </ConservationList>
        </>
      )}
    </RegionInfoContainer>
  );
};

export default RegionInfo;