import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { TimeRange } from './TimeSlider';
import {
  getCountryCodeByName,
  getCountryNameByCode,
} from '../utils/countryUtils';

// 스타일 컴포넌트 정의
const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0;
  overflow: hidden;
  border-radius: 10px;
`;

const MapSvg = styled.svg`
  width: 100%;
  height: 100%;
  background-color: #f0f8ff;
  border-radius: 10px;
  display: block;
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

const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  left: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 10px;
  border-radius: 5px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  scale: 90%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  top: 15px;
  left: 15px;
  display: flex;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 5px;
  z-index: 10;
  scale: 90%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DataTypeButton = styled.button<{ $active: boolean }>`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: ${(props) => (props.$active ? '#3b82f6' : '#e2e8f0')};
  color: ${(props) => (props.$active ? 'white' : '#64748b')};
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${(props) => (props.$active ? '#2563eb' : '#cbd5e1')};
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

// 컴포넌트 프롭스 정의
interface WorldMapProps {
  data: any;
  countriesData?: Record<string, CountryData>;
  timeRange: TimeRange;
  timeValue: number;
  dataType: DataType;
  onDataTypeChange: (type: DataType) => void;
  onRegionSelect: (region: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
  data,
  countriesData = {},
  timeRange,
  timeValue,
  dataType = 'temperature',
  onDataTypeChange,
  onRegionSelect,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);

  // 디버깅용 로그 추가
  useEffect(() => {
    if (Object.keys(countriesData).length > 0) {
      console.log(
        '국가 데이터 업데이트됨. 샘플:',
        Object.entries(countriesData).slice(0, 3),
      );
    } else {
      console.log('국가 데이터가 비어 있음');
    }
  }, [countriesData]);

  // 지도 데이터 로드
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        // TopoJSON 데이터 로드
        const response = await fetch(
          'https://unpkg.com/world-atlas@2.0.2/countries-110m.json',
        );
        const topology = await response.json();

        // TopoJSON에서 GeoJSON으로 변환
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);

        console.log('지도 데이터 로드 성공');
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
        // CO2 농도에 따른 색상 스케일 - 범위 확장
        return d3.scaleSequential(d3.interpolateBlues).domain([350, 430]);
      case 'temperature':
        // 온도에 따른 색상 스케일 (-10°C ~ 40°C)
        return d3.scaleSequential(d3.interpolateReds).domain([-10, 40]);
      case 'humidity':
        // 습도에 따른 색상 스케일 (0% ~ 100%)
        return d3.scaleSequential(d3.interpolateGreens).domain([0, 100]);
      default:
        return d3.scaleSequential(d3.interpolateReds).domain([-10, 40]);
    }
  };

  // 지도 렌더링
  useEffect(() => {
    if (!worldData || !svgRef.current) return;

    console.log('지도 렌더링 시작 - 데이터 타입:', dataType);

    // 실제 데이터 확인 및 강화
    let effectiveData: Record<string, CountryData> = {};

    if (Object.keys(countriesData).length > 0) {
      // 실제 데이터가 있는 경우 사용
      effectiveData = { ...countriesData };
      console.log(
        '백엔드 데이터 사용:',
        Object.keys(effectiveData).length,
        '개 국가',
      );

      // CO2 데이터 디버깅 로그 추가
      if (dataType === 'co2') {
        const countriesWithCO2 = Object.entries(effectiveData).filter(
          ([_, data]) => data.co2Level !== undefined,
        );

        console.log(`CO2 데이터가 있는 국가: ${countriesWithCO2.length}개`);

        if (countriesWithCO2.length > 0) {
          console.log('CO2 데이터 샘플:', countriesWithCO2.slice(0, 3));
        }

        // CO2 값의 범위 확인
        if (countriesWithCO2.length > 0) {
          const co2Values = countriesWithCO2.map(([_, data]) => data.co2Level);
          const minCO2 = Math.min(...(co2Values as number[]));
          const maxCO2 = Math.max(...(co2Values as number[]));
          console.log(`CO2 데이터 범위: ${minCO2} ~ ${maxCO2}`);
        }
      }
    } else {
      console.log('데이터 없음');
    }

    console.log(
      '사용할 데이터:',
      Object.keys(effectiveData).length > 0
        ? `${Object.keys(effectiveData).length}개 국가 데이터 있음`
        : '데이터 없음',
    );

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 이전 요소 제거
    svg.selectAll('*').remove();

    // 지도 프로젝션 (메르카토르) - 개선된 설정
    const projection = d3
      .geoMercator()
      .fitSize([width, height], worldData)
      .scale(width / 6.1) // 스케일 조정 - 화면에 딱 맞게
      .center([0, 35]) // 중심점 약간 조정
      .translate([width / 2, height / 2]);

    // 지리 경로 생성기
    const pathGenerator = d3.geoPath().projection(projection);

    // 색상 스케일
    const colorScale = getColorScale();

    // 줌 기능
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        svg.selectAll('path').attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // 국가 경로 추가
    svg
      .selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', (d: any) => {
        // GeoJSON에서의 국가 이름
        const countryName = d.properties.name;

        // 국가 이름으로 코드 찾기
        const countryCode = getCountryCodeByName(countryName);

        // 국가 코드가 있고, 해당 코드의 데이터가 있으면 색상 지정
        if (countryCode && effectiveData[countryCode]) {
          const countryData = effectiveData[countryCode];

          // 데이터 타입에 따른 값 선택
          let value;
          switch (dataType) {
            case 'co2':
              value = countryData.co2Level;

              // 디버깅 로그: co2Level 값이 정의되었는지 확인
              if (value === undefined) {
                console.log(
                  `경고: ${countryCode} 국가의 co2Level이 undefined입니다.`,
                );
              }
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

          // 값이 있으면 색상 적용, 없으면 노란색
          return value !== undefined ? colorScale(value) : '#FFFFCC';
        }

        // 데이터가 없는 경우 노란색 반환
        return '#FFFFCC';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .attr('vector-effect', 'non-scaling-stroke') // 줌 시에도 테두리 두께 유지
      .on('mouseover', (event, d: any) => {
        const countryName = d.properties.name;
        const countryCode = getCountryCodeByName(countryName);

        // 툴팁 표시 준비
        let tooltipContent = `<strong>${countryName}</strong>`;

        if (countryCode && effectiveData[countryCode]) {
          const data = effectiveData[countryCode];

          // 데이터 타입에 따른 값 표시
          // if (dataType === 'temperature' && data.temperature !== undefined) {
          //   tooltipContent += `<br>온도: ${data.temperature.toFixed(1)}°C`;
          // } else if (dataType === 'humidity' && data.humidity !== undefined) {
          //   tooltipContent += `<br>습도: ${data.humidity.toFixed(1)}%`;
          // } else if (dataType === 'co2' && data.co2Level !== undefined) {
          //   tooltipContent += `<br>CO2: ${data.co2Level.toFixed(1)} ppm`;
          // }

          // 수정 후 (안전한 타입 체크 추가)
          if (dataType === 'temperature' && data.temperature !== undefined) {
            tooltipContent += `<br>온도: ${
              typeof data.temperature === 'number'
                ? data.temperature.toFixed(1)
                : data.temperature
            }°C`;
          } else if (dataType === 'humidity' && data.humidity !== undefined) {
            tooltipContent += `<br>습도: ${
              typeof data.humidity === 'number'
                ? data.humidity.toFixed(1)
                : data.humidity
            }%`;
          } else if (dataType === 'co2' && data.co2Level !== undefined) {
            tooltipContent += `<br>CO2: ${
              typeof data.co2Level === 'number'
                ? data.co2Level.toFixed(1)
                : data.co2Level
            } ppm`;
          }
        }

        // 툴팁 표시
        tooltip.html(tooltipContent).style('display', 'block');

        // 테두리 스타일 변경
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
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

        if (countryCode) {
          console.log(`국가 선택: ${countryName} (${countryCode})`);
          onRegionSelect(countryCode);
        } else {
          console.log(`국가 코드를 찾을 수 없음: ${countryName}`);
        }
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
        .scale(newWidth / 6.1) // 스케일 일관성 유지
        .center([0, 35]) // 중심점 일관성 유지
        .translate([newWidth / 2, newHeight / 2]);

      svg.selectAll('path').attr('d', pathGenerator as any);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [worldData, countriesData, dataType, onRegionSelect]);

  // 범례 업데이트 함수
  const updateLegend = (
    dataType: DataType,
    colorScale: d3.ScaleSequential<string, never>,
  ) => {
    const legendSvg = d3.select('#legend-scale').selectAll('*').remove();

    const gradientId = `gradient-${dataType}`;

    // SVG 그래디언트 정의
    const defs = d3
      .select('#legend-scale')
      .append('svg')
      .attr('width', 200)
      .attr('height', 20)
      .append('defs');

    const gradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    // 그래디언트 색상 채우기
    const colorDomain = colorScale.domain();
    const colorRange = d3.range(0, 1.01, 0.1);

    colorRange.forEach((percent) => {
      const value =
        colorDomain[0] + percent * (colorDomain[1] - colorDomain[0]);
      gradient
        .append('stop')
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
        max = '430 ppm';
        title = '이산화탄소 농도';
        break;
      case 'temperature':
        min = '-10 °C';
        max = '40 °C';
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

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (type: DataType) => {
    if (onDataTypeChange) {
      onDataTypeChange(type);
    }
  };

  return (
    <MapContainer>
      <MapSvg ref={svgRef} preserveAspectRatio='xMidYMid meet' />

      <DataTypeSelector>
        <DataTypeButton
          $active={dataType === 'temperature'}
          onClick={() => handleDataTypeChange('temperature')}
        >
          온도
        </DataTypeButton>
        <DataTypeButton
          $active={dataType === 'humidity'}
          onClick={() => handleDataTypeChange('humidity')}
        >
          습도
        </DataTypeButton>
        <DataTypeButton
          $active={dataType === 'co2'}
          onClick={() => handleDataTypeChange('co2')}
        >
          이산화탄소
        </DataTypeButton>
      </DataTypeSelector>

      <Legend>
        <LegendTitle id='legend-title'>
          {dataType === 'temperature'
            ? '평균 온도'
            : dataType === 'humidity'
            ? '습도'
            : '이산화탄소 농도'}
        </LegendTitle>
        <LegendScale id='legend-scale'></LegendScale>
        <LegendLabels>
          <span id='legend-min'>
            {dataType === 'temperature'
              ? '-10 °C'
              : dataType === 'humidity'
              ? '0 %'
              : '300 ppm'}
          </span>
          <span id='legend-max'>
            {dataType === 'temperature'
              ? '40 °C'
              : dataType === 'humidity'
              ? '100 %'
              : '500 ppm'}
          </span>
        </LegendLabels>
      </Legend>

      <Tooltip ref={tooltipRef} />
    </MapContainer>
  );
};

export default WorldMap;
