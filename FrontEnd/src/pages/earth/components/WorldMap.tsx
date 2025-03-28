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
  [key: string]: any;
}

// 데이터 타입 옵션
type DataType = 'co2' | 'temperature';

interface WorldMapProps {
  data: any;
  countriesData?: Record<string, CountryData>;
  timeRange: TimeRange;
  timeValue: number;
  dataType?: DataType;
  onDataTypeChange?: (type: DataType) => void;
  onRegionSelect: (region: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
  data,
  countriesData = {},
  timeRange,
  timeValue,
  dataType = 'co2',
  onDataTypeChange,
  onRegionSelect
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  
  // 지도 데이터 로드
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        // TopoJSON 데이터 로드 (일반적으로 외부에서 가져옴)
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
    if (dataType === 'co2') {
      // CO2 농도에 따른 색상 스케일 (350ppm ~ 450ppm)
      return d3.scaleSequential(d3.interpolateBlues)
        .domain([350, 450]);
    } else {
      // 온도에 따른 색상 스케일 (0°C ~ 30°C)
      return d3.scaleSequential(d3.interpolateReds)
        .domain([0, 30]);
    }
  };
  
  // 지도 렌더링
  useEffect(() => {
    if (!worldData || !svgRef.current) return;
    
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
        const countryName = d.properties.name;
        const countryData = countriesData[countryName];
        
        if (!countryData) return '#e2e8f0'; // 데이터가 없는 국가
        
        const value = dataType === 'co2'
          ? countryData.co2Level
          : countryData.temperature;
          
        return value ? colorScale(value) : '#e2e8f0';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseover', (event, d: any) => {
        const countryName = d.properties.name;
        const countryData = countriesData[countryName];
        
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
          
        const tooltipContent = countryData
          ? `${countryName}<br>${dataType === 'co2' 
              ? `CO2: ${countryData.co2Level?.toFixed(1) || 'N/A'} ppm` 
              : `온도: ${countryData.temperature?.toFixed(1) || 'N/A'} °C`}`
          : `${countryName}<br>데이터 없음`;
          
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
        onRegionSelect(d.properties.name || '알 수 없는 지역');
      });
      
    // 범례 그리기
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
      
    // 범례 레이블 업데이트
    d3.select('#legend-min')
      .text(dataType === 'co2' ? '350 ppm' : '0 °C');
      
    d3.select('#legend-max')
      .text(dataType === 'co2' ? '450 ppm' : '30 °C');
      
    d3.select('#legend-title')
      .text(dataType === 'co2' ? '이산화탄소 농도' : '평균 온도');
      
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
  
  // const handleZoomIn = () => {
  //   if (!svgRef.current) return;
    
  //   d3.select(svgRef.current).transition()
  //     .call((d3.zoom() as any).scaleBy, 1.5);
  // };
  
  // const handleZoomOut = () => {
  //   if (!svgRef.current) return;
    
  //   d3.select(svgRef.current).transition()
  //     .call((d3.zoom() as any).scaleBy, 0.75);
  // };
  
  // const handleReset = () => {
  //   if (!svgRef.current) return;
    
  //   d3.select(svgRef.current).transition()
  //     .call((d3.zoom() as any).transform, d3.zoomIdentity);
  // };
  
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
          active={dataType === 'co2'} 
          onClick={() => handleDataTypeChange('co2')}
        >
          이산화탄소
        </DataTypeButton>
        <DataTypeButton 
          active={dataType === 'temperature'} 
          onClick={() => handleDataTypeChange('temperature')}
        >
          온도
        </DataTypeButton>
      </DataTypeSelector>
      
      {/* <ControlPanel>
        <ZoomButton onClick={handleZoomIn}>확대</ZoomButton>
        <ZoomButton onClick={handleZoomOut}>축소</ZoomButton>
        <ZoomButton onClick={handleReset}>초기화</ZoomButton>
      </ControlPanel> */}
      
      <Legend>
        <LegendTitle id="legend-title">
          {dataType === 'co2' ? '이산화탄소 농도' : '평균 온도'}
        </LegendTitle>
        <LegendScale id="legend-scale"></LegendScale>
        <LegendLabels>
          <span id="legend-min">{dataType === 'co2' ? '350 ppm' : '0 °C'}</span>
          <span id="legend-max">{dataType === 'co2' ? '450 ppm' : '30 °C'}</span>
        </LegendLabels>
      </Legend>
      
      <Tooltip ref={tooltipRef} />
    </MapContainer>
  );
};

export default WorldMap;