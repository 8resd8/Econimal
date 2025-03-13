import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

const MapContainer = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const MapSvg = styled.svg`
  width: 100%;
  height: 100%;
  background-color: #f0f8ff;
  border-radius: 10px;
`;

const ControlPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 10;
`;

const ZoomButton = styled.button`
  margin: 5px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  
  &:hover {
    background-color: #3e8e41;
  }
`;

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

interface WorldMapProps {
  data: any;
  onRegionSelect: (region: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ data, onRegionSelect }) => {
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
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseover', (event, d: any) => {
        d3.select(event.currentTarget)
          .attr('fill', '#28a745');
          
        tooltip
          .style('display', 'block')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`)
          .html(`${d.properties.name || '알 수 없는 지역'}`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .attr('fill', '#69b3a2');
          
        tooltip.style('display', 'none');
      })
      .on('click', (event, d: any) => {
        onRegionSelect(d.properties.name || '알 수 없는 지역');
      });
      
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
  }, [worldData, onRegionSelect]);
  
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current).transition()
      .call((d3.zoom() as any).scaleBy, 1.5);
  };
  
  const handleZoomOut = () => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current).transition()
      .call((d3.zoom() as any).scaleBy, 0.75);
  };
  
  const handleReset = () => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current).transition()
      .call((d3.zoom() as any).transform, d3.zoomIdentity);
  };
  
  return (
    <MapContainer>
      <MapSvg ref={svgRef} />
      
      <ControlPanel>
        <ZoomButton onClick={handleZoomIn}>확대</ZoomButton>
        <ZoomButton onClick={handleZoomOut}>축소</ZoomButton>
        <ZoomButton onClick={handleReset}>초기화</ZoomButton>
      </ControlPanel>
      
      <Tooltip ref={tooltipRef} />
    </MapContainer>
  );
};

export default WorldMap;