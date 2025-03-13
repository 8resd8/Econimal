import React from 'react';
import styled from 'styled-components';

const RegionInfoContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 350px;
  z-index: 10;
  transition: all 0.3s ease;
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

interface RegionData {
  name: string;
  description: string;
  population?: number;
  area?: number;
  environmentalIndex?: number;
  biodiversityCount?: number;
  threatLevel?: number;
  conservationEfforts?: string[];
}

interface RegionInfoProps {
  data: RegionData | null;
  onClose?: () => void;
}

const RegionInfo: React.FC<RegionInfoProps> = ({ data, onClose }) => {
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
          {data.population && (
            <StatItem>
              <StatLabel>인구</StatLabel>
              <StatValue>{data.population.toLocaleString()}</StatValue>
            </StatItem>
          )}
          
          {data.area && (
            <StatItem>
              <StatLabel>면적 (km²)</StatLabel>
              <StatValue>{data.area.toLocaleString()}</StatValue>
            </StatItem>
          )}
          
          {data.environmentalIndex !== undefined && (
            <StatItem>
              <StatLabel>환경 지수</StatLabel>
              <StatValue>{data.environmentalIndex.toFixed(1)}</StatValue>
            </StatItem>
          )}
          
          {data.biodiversityCount && (
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
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {data.conservationEfforts.map((effort, index) => (
              <li key={index} style={{ fontSize: '14px', marginBottom: '3px' }}>{effort}</li>
            ))}
          </ul>
        </>
      )}
    </RegionInfoContainer>
  );
};

export default RegionInfo;