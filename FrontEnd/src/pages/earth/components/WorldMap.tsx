import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { TimeRange } from './TimeSlider';

const MapContainer = styled.div`
  width: 90%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 40px;
`;

const MapSvg = styled.svg`
  width: 100%;
  height: 85%;
  background-color: #f0f8ff;
  border-radius: 10px;
`;

// const ControlPanel = styled.div`
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   display: flex;
//   flex-direction: column;
//   background-color: rgba(255, 255, 255, 0.8);
//   padding: 10px;
//   border-radius: 5px;
//   z-index: 10;
// `;

// const ZoomButton = styled.button`
//   margin: 5px;
//   padding: 5px 10px;
//   background-color: #4caf50;
//   color: white;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;
  
//   &:hover {
//     background-color: #3e8e41;
//   }
// `;

const Tooltip = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  display: none;
  z-index: 20;
`;

const Legend = styled.div`
  position: absolute;
  bottom: 35px;
  left: 0px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  scale: 90%;
`;

const LegendTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
`;

const LegendScale = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  width: 200px;
`;

const LegendLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 200px;
  font-size: 12px;
  margin-top: 4px;
`;

const DataTypeSelector = styled.div`
  position: absolute;
  top: 10px;
  left: -10px;
  display: flex;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 10;
  scale: 90%;
`;

const DataTypeButton = styled.button<{ active: boolean }>`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#cbd5e1'};
  }
`;

// 국가별 데이터 타입
interface CountryData {
  co2Level?: number;
  temperature?: number;
  humidity?: number;
  [key: string]: any;
}

// 데이터 타입 옵션
type DataType = 'temperature' | 'humidity' | 'co2';

interface WorldMapProps {
  data: any;
  countriesData?: Record<string, CountryData>;
  timeRange: TimeRange;
  timeValue: number;
  dataType: DataType;
  onDataTypeChange: (type: DataType) => void;
  onRegionSelect: (region: string) => void;
}

// 국가 코드와 이름 매핑
const countryCodeToName: Record<string, string> = {
  "KR": "South Korea",
  "JP": "Japan",
  "US": "United States",
  "CN": "China",
  "RU": "Russia",
  "GB": "United Kingdom",
  "FR": "France",
  "DE": "Germany",
  "IT": "Italy",
  "CA": "Canada",
  "AU": "Australia",
  "IN": "India",
  "BR": "Brazil",
  // 필요한 만큼 추가
};

// 국가 이름으로 코드 찾기 함수
const getCountryCodeByName = (name: string): string | null => {
  const entry = Object.entries(countryCodeToName).find(([_, countryName]) => countryName === name);
  return entry ? entry[0] : null;
};

// 국가 코드로 이름 찾기 함수
const getCountryNameByCode = (code: string): string => {
  return countryCodeToName[code] || code;
};

const WorldMap: React.FC<WorldMapProps> = ({
  data,
  countriesData = {},
  timeRange,
  timeValue,
  dataType = 'temperature', // 기본값을 temperature로 변경
  onDataTypeChange,
  onRegionSelect
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  
  // 디버깅용 로그 추가
  useEffect(() => {
    console.log('countriesData 업데이트됨:', countriesData);
  }, [countriesData]);
  
  // 지도 데이터 로드
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        // TopoJSON 데이터 로드
        const response = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json');
        const topology = await response.json();
        
        // TopoJSON에서 GeoJSON으로 변환
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);
      } catch (error) {
        console.error('지도 데이터 로드 실패:', error);
      }
    };
    
    loadWorldData();
  }, []);
  
  // 색상 스케일 및 범례 설정
  const getColorScale = () => {
    switch (dataType) {
      case 'co2':
        // CO2 농도에 따른 색상 스케일 (350ppm ~ 450ppm)
        return d3.scaleSequential(d3.interpolateBlues)
          .domain([350, 450]);
      case 'temperature':
        // 온도에 따른 색상 스케일 (0°C ~ 30°C)
        return d3.scaleSequential(d3.interpolateReds)
          .domain([0, 30]);
      case 'humidity':
        // 습도에 따른 색상 스케일 (0% ~ 100%)
        return d3.scaleSequential(d3.interpolateGreens)
          .domain([0, 100]);
      default:
        return d3.scaleSequential(d3.interpolateReds)
          .domain([0, 30]);
    }
  };
  
  // 지도 렌더링
  useEffect(() => {
    if (!worldData || !svgRef.current) return;
    
    console.log('지도 렌더링 - 데이터 타입:', dataType);
    console.log('국가 데이터:', countriesData);
    
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // 지도 프로젝션 (메르카토르)
    const projection = d3.geoMercator()
      .fitSize([width, height], worldData)
      .scale(width / 6.5)
      .center([0, 40])
      .translate([width / 2, height / 2]);
      
    // 지리 경로 생성기
    const pathGenerator = d3.geoPath().projection(projection);
    
    // 색상 스케일
    const colorScale = getColorScale();
    
    // 줌 기능
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        svg.selectAll('path')
          .attr('transform', event.transform);
      });
      
    svg.call(zoom as any);
    
    // 이전 경로 삭제
    svg.selectAll('path').remove();
    
    // 국가 경로 추가
    svg.selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', (d: any) => {
        const countryId = d.id; // GeoJSON에서의 국가 ID
        const countryName = d.properties.name;
        
        // 국가 이름으로 코드 찾기
        const countryCode = getCountryCodeByName(countryName);
        
        console.log(`국가: ${countryName}, 코드: ${countryCode}`);
        
        // 국가 코드가 있고 해당 코드의 데이터가 있는지 확인
        if (countryCode && countriesData[countryCode]) {
          const countryData = countriesData[countryCode];
          
          // 데이터 타입에 따른 값 선택
          let value;
          switch (dataType) {
            case 'co2':
              value = countryData.co2Level;
              break;
            case 'temperature':
              value = countryData.temperature;
              break;
            case 'humidity':
              value = countryData.humidity;
              break;
            default:
              value = countryData.temperature;
          }
          
          // 값이 있으면 색상 적용, 없으면 회색
          return value !== undefined ? colorScale(value) : '#e2e8f0';
        }
        
        // 데이터가 없는 경우 회색 반환
        return '#e2e8f0';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseover', (event, d: any) => {
        const countryName = d.properties.name;
        const countryCode = getCountryCodeByName(countryName);
        
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
          
        let tooltipContent;
        
        if (countryCode && countriesData[countryCode]) {
          const countryData = countriesData[countryCode];
          
          // 데이터 타입에 따른 값과 단위 설정
          let valueText;
          switch (dataType) {
            case 'co2':
              valueText = `CO2: ${countryData.co2Level?.toFixed(1) || 'N/A'} ppm`;
              break;
            case 'temperature':
              valueText = `온도: ${countryData.temperature?.toFixed(1) || 'N/A'} °C`;
              break;
            case 'humidity':
              valueText = `습도: ${countryData.humidity?.toFixed(1) || 'N/A'} %`;
              break;
            default:
              valueText = '데이터 없음';
          }
          
          tooltipContent = `${countryName}<br>${valueText}`;
        } else {
          tooltipContent = `${countryName}<br>데이터 없음`;
        }
          
        tooltip
          .style('display', 'block')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`)
          .html(tooltipContent);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5);
          
        tooltip.style('display', 'none');
      })
      .on('click', (event, d: any) => {
        const countryName = d.properties.name;
        const countryCode = getCountryCodeByName(countryName);
        
        // 국가 코드가 있으면 코드를, 없으면 이름을 리전으로 선택
        onRegionSelect(countryCode || countryName);
      });
      
    // 범례 업데이트
    updateLegend(dataType, colorScale);
    
    // 리사이징 핸들러
    const handleResize = () => {
      if (!svgRef.current) return;
      
      const newWidth = svgRef.current.clientWidth;
      const newHeight = svgRef.current.clientHeight;
      
      projection
        .fitSize([newWidth, newHeight], worldData)
        .scale(newWidth / 6.5)
        .center([0, 40])
        .translate([newWidth / 2, newHeight / 2]);
        
      svg.selectAll('path')
        .attr('d', pathGenerator as any);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [worldData, countriesData, dataType, onRegionSelect]);
  
  // 범례 업데이트 함수
  const updateLegend = (dataType: DataType, colorScale: d3.ScaleSequential<string, never>) => {
    const legendSvg = d3.select('#legend-scale')
      .selectAll('*')
      .remove();
      
    const gradientId = `gradient-${dataType}`;
    
    // SVG 그래디언트 정의
    const defs = d3.select('#legend-scale')
      .append('svg')
      .attr('width', 200)
      .attr('height', 20)
      .append('defs');
      
    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');
      
    // 그래디언트 색상 채우기
    const colorDomain = colorScale.domain();
    const colorRange = d3.range(0, 1.01, 0.1);
    
    colorRange.forEach(percent => {
      const value = colorDomain[0] + percent * (colorDomain[1] - colorDomain[0]);
      gradient.append('stop')
        .attr('offset', `${percent * 100}%`)
        .attr('stop-color', colorScale(value));
    });
    
    // 그래디언트 사각형 적용
    d3.select('#legend-scale svg')
      .append('rect')
      .attr('width', 200)
      .attr('height', 20)
      .style('fill', `url(#${gradientId})`);
      
    // 범례 레이블 및 제목 설정
    let min, max, title;
    
    switch (dataType) {
      case 'co2':
        min = '350 ppm';
        max = '450 ppm';
        title = '이산화탄소 농도';
        break;
      case 'temperature':
        min = '0 °C';
        max = '30 °C';
        title = '평균 온도';
        break;
      case 'humidity':
        min = '0 %';
        max = '100 %';
        title = '습도';
        break;
      default:
        min = '0';
        max = '100';
        title = '값';
    }
    
    d3.select('#legend-min').text(min);
    d3.select('#legend-max').text(max);
    d3.select('#legend-title').text(title);
  };
  
  const handleDataTypeChange = (type: DataType) => {
    if (onDataTypeChange) {
      onDataTypeChange(type);
    }
  };
  
  return (
    <MapContainer>
      <MapSvg ref={svgRef} />
      
      <DataTypeSelector>
        <DataTypeButton 
          active={dataType === 'temperature'} 
          onClick={() => handleDataTypeChange('temperature')}
        >
          온도
        </DataTypeButton>
        <DataTypeButton 
          active={dataType === 'humidity'} 
          onClick={() => handleDataTypeChange('humidity')}
        >
          습도
        </DataTypeButton>
        <DataTypeButton 
          active={dataType === 'co2'} 
          onClick={() => handleDataTypeChange('co2')}
        >
          이산화탄소
        </DataTypeButton>
      </DataTypeSelector>
      
      <Legend>
        <LegendTitle id="legend-title">
          {dataType === 'temperature' ? '평균 온도' : 
           dataType === 'humidity' ? '습도' : '이산화탄소 농도'}
        </LegendTitle>
        <LegendScale id="legend-scale"></LegendScale>
        <LegendLabels>
          <span id="legend-min">
            {dataType === 'temperature' ? '0 °C' : 
             dataType === 'humidity' ? '0 %' : '350 ppm'}
          </span>
          <span id="legend-max">
            {dataType === 'temperature' ? '30 °C' : 
             dataType === 'humidity' ? '100 %' : '450 ppm'}
          </span>
        </LegendLabels>
      </Legend>
      
      <Tooltip ref={tooltipRef} />
    </MapContainer>
  );
};

export default WorldMap;