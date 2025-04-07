import React, { useState, useEffect } from 'react';
import bgImage from "@/assets/auth_background.png";
import GoMainBtn from '@/components/GoMainBtn';
import ContributionButton from '@/components/ContributionButton';

// Components
import WorldMap from './components/WorldMap';
import TimeSlider from './components/TimeSlider';
import { TimeRange } from './components/TimeSlider';
import MapLayout from './components/EarthLayout';

// Features (API 관련)
import { 
  fetchWorldData, 
  CountryData as WorldCountryData 
} from './features/worldDataApi';
import { 
  fetchRegionInfo, 
  fetchHistoricalData, 
  RegionData 
} from './features/regionInfoApi';
import {
  fetchAllCountriesCO2Data,
  fetchCountryCO2Data  // 이 부분이 추가되어야 함
} from './features/co2DataApi';

// 데이터 타입 옵션
type DataType = 'temperature' | 'humidity' | 'co2';

const Earth: React.FC = () => {
  // 각 기능별 상태 관리
  const [worldData, setWorldData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionInfo, setRegionInfo] = useState<RegionData | null>(null);
  
  // 시간 범위 관련 상태
  const [timeRange, setTimeRange] = useState<TimeRange>('hour');
  const [timeValue, setTimeValue] = useState<number>(0);
  
  // 데이터 타입 상태
  const [dataType, setDataType] = useState<DataType>('temperature');
  
  // 모든 국가에 대한 데이터
  const [globalData, setGlobalData] = useState<Record<string, WorldCountryData>>({});
  
  // 히스토리 데이터
  const [historicalData, setHistoricalData] = useState<{
    temperatures: { timestamp: string; value: number }[];
    co2Levels: { timestamp: string; value: number }[];
    humidity: { timestamp: string; value: number }[]; 
  }>({
    temperatures: [],
    co2Levels: [],
    humidity: []
  });
  
  // 최대 연도 범위 (백엔드에서 가져온 데이터의 최대 범위)
  const [maxYears, setMaxYears] = useState<number>(10); // 기본값 10년으로 설정
  
  // 데이터 로드 상태 추가
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  // 데이터 없음 상태 추가
  const [noDataAvailable, setNoDataAvailable] = useState<boolean>(false);
  
  // Earth.tsx 컴포넌트의 초기 데이터 로딩 부분 수정

  // 초기 데이터 로딩
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setDataLoading(true);
        const currentDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
        
        // 세계 데이터 로드 (온도, 습도 데이터)
        const worldDataResponse = await fetchWorldData(startDate, currentDate, 'HOUR');
        
        // [수정] CO2 데이터 로드 (별도 API)
        console.log('CO2 데이터 로드 시작');
        const co2Data = await fetchAllCountriesCO2Data();
        console.log(`CO2 데이터 로드 완료: ${Object.keys(co2Data).length}개 국가`);
        
        // 응답 데이터 디버깅
        console.log('백엔드 응답 데이터:', worldDataResponse);
        
        // 최대 연도 범위 계산
        const currentYear = new Date().getFullYear();
        let oldestYear = currentYear - 10; // 기본값: 현재 연도 - 10년
        
        // 1. groupByDateTime에서 가장 오래된 타임스탬프 찾기
        if (worldDataResponse && worldDataResponse.groupByDateTime) {
          let allTimestamps: string[] = [];
          
          // groupByDateTime에서 모든 타임스탬프 수집
          allTimestamps = Object.keys(worldDataResponse.groupByDateTime);
          
          // 2. 추가로 groupByCountry에서도 타임스탬프 수집 (더 오래된 데이터가 있을 수 있음)
          if (worldDataResponse.groupByCountry) {
            Object.values(worldDataResponse.groupByCountry).forEach(countryData => {
              allTimestamps = [...allTimestamps, ...Object.keys(countryData)];
            });
          }
          
          // 중복 제거
          allTimestamps = [...new Set(allTimestamps)];
          
          if (allTimestamps.length > 0) {
            // 유효한 타임스탬프만 필터링 (잘못된 형식 제외)
            const validTimestamps = allTimestamps.filter(timestamp => {
              const date = new Date(timestamp);
              return !isNaN(date.getTime());
            });
            
            if (validTimestamps.length > 0) {
              // 날짜순으로 정렬 (오름차순)
              validTimestamps.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
              
              // 가장 오래된 타임스탬프
              const oldestTimestamp = validTimestamps[0];
              const oldestDate = new Date(oldestTimestamp);
              
              // 최소 5년, 최대 실제 데이터 범위로 설정
              oldestYear = oldestDate.getFullYear();
              console.log(`가장 오래된 타임스탬프: ${oldestTimestamp}, 연도: ${oldestYear}`);
            }
          }
        }
        
        // [수정] CO2 데이터에서도 가장 오래된 연도 확인
        Object.values(co2Data).forEach(countryData => {
          if (countryData.length > 0) {
            // 연도순으로 정렬
            const sortedData = [...countryData].sort((a, b) => a.year - b.year);
            // 가장 오래된 연도
            const year = sortedData[0].year;
            if (year < oldestYear) {
              oldestYear = year;
              console.log(`CO2 데이터에서 더 오래된 연도 발견: ${year}`);
            }
          }
        });
        
        // 최대 연도 범위 계산 (현재 연도 - 가장 오래된 연도 + 1)
        const yearsRange = Math.max(5, currentYear - oldestYear + 1);
        setMaxYears(yearsRange);
        console.log(`최대 연도 범위 설정: ${yearsRange}년`);
        
        // groupByDateTime이 있는지 확인
        if (worldDataResponse && worldDataResponse.groupByDateTime) {
          // 사용 가능한 타임스탬프 가져오기
          const timestamps = Object.keys(worldDataResponse.groupByDateTime);
          
          if (timestamps.length > 0) {
            // 타임스탬프를 날짜순으로 정렬
            timestamps.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
            
            // 최신 타임스탬프 선택
            const latestTimestamp = timestamps[0];
            console.log('사용할 최신 타임스탬프:', latestTimestamp);
            
            // 최신 타임스탬프의 데이터
            const latestData = worldDataResponse.groupByDateTime[latestTimestamp];
            
            // 데이터가 있는 국가 목록
            const countries = Object.keys(latestData);
            console.log('최신 데이터에 포함된 국가:', countries.length, '개 국가', countries);
            
            // [수정] CO2 데이터 통합 (각 국가의 최신 CO2 데이터 추가)
            countries.forEach(countryCode => {
              // 해당 국가의 CO2 데이터가 있는지 확인
              if (co2Data[countryCode] && co2Data[countryCode].length > 0) {
                // 연도순으로 정렬하여 가장 최신 데이터 사용
                const sortedCO2Data = [...co2Data[countryCode]].sort((a, b) => b.year - a.year);
                // 기존 데이터에 CO2 데이터 추가
                latestData[countryCode].co2Level = sortedCO2Data[0].value;
              }
            });
            
            // 데이터 설정
            setWorldData(worldDataResponse);
            setGlobalData(latestData);
            
            console.log('최종 사용 데이터:', Object.keys(latestData).length, '개 국가');
          } else {
            console.warn('타임스탬프 데이터가 없습니다');
          }
        } else {
          console.warn('API 응답에 groupByDateTime이 없습니다');
        }
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
        console.warn('오류');
      } finally {
        setDataLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // 시간 값 변경 핸들러
  const handleTimeValueChange = (value: number) => {
    setTimeValue(value);
  };
  
  // 시간 범위 변경 핸들러
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setTimeValue(0);
  };
  
  // 조회하기 버튼 클릭 핸들러 (데이터 요청)
  const handleFetchData = async (range: TimeRange, value: number, startDate: string, endDate: string) => {
    try {
      setDataLoading(true);
      setNoDataAvailable(false); // 로딩 시작 시 데이터 없음 상태 초기화
      
      console.log(`조회하기 버튼 클릭: ${range} 범위, ${value} 값`);
      console.log(`시작 날짜: ${startDate}, 종료 날짜: ${endDate}`);
      
      // 글로벌 데이터 업데이트
      const worldDataResponse = await fetchWorldData(startDate, endDate, range.toUpperCase() as 'HOUR');
      
      // groupByDateTime 객체가 있는지 확인
      if (worldDataResponse && worldDataResponse.groupByDateTime) {
        const timestamps = Object.keys(worldDataResponse.groupByDateTime);
        
        if (timestamps.length > 0) {
          // 타임스탬프를 날짜순으로 정렬
          timestamps.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          
          // 최신 타임스탬프 선택
          const latestTimestamp = timestamps[0];
          console.log('사용할 최신 타임스탬프:', latestTimestamp);
          
          // 최신 타임스탬프의 데이터
          const latestData = worldDataResponse.groupByDateTime[latestTimestamp];
          
          // 데이터 설정
          setWorldData(worldDataResponse);
          setGlobalData(latestData);
        } else {
          console.warn('타임스탬프 데이터가 없습니다');
        }
      } else {
        console.warn('API 응답에 groupByDateTime이 없습니다');
      }
      
      // 선택된 지역이 있는 경우 지역 데이터도 업데이트
      if (selectedRegion) {
        // 이전 데이터 초기화
        setHistoricalData({
          temperatures: [],
          co2Levels: [],
          humidity: []
        });
        
        // 지역 정보 로드 - 직접 API에 startDate와 endDate 전달
        const regionData = await fetchRegionInfo({
          region: selectedRegion,
          timeRange: range,
          timeValue: value
        });
        setRegionInfo(regionData);
        
        // 히스토리 데이터 로드 - 시간 범위와 시작/종료 날짜 전달
        const histData = await fetchHistoricalData({
          region: selectedRegion,
          timeRange: range
        });
        
        console.log('받아온 히스토리 데이터:', histData);
        
        // 데이터 유효성 검사
        const hasTemperatureData = histData.temperatures && histData.temperatures.length > 0;
        const hasHumidityData = histData.humidity && histData.humidity.length > 0;
        const hasCO2Data = histData.co2Levels && histData.co2Levels.length > 0;
        
        if (!hasTemperatureData && !hasHumidityData && !hasCO2Data) {
          console.log('데이터 없음 상태로 설정');
          setNoDataAvailable(true);
          // 빈 데이터 설정 (차트 컴포넌트에서 처리할 수 있도록)
          setHistoricalData({
            temperatures: [],
            co2Levels: [],
            humidity: []
          });
        } else {
          console.log('데이터 설정:', {
            temperatures: histData.temperatures.length,
            humidity: histData.humidity.length,
            co2Levels: histData.co2Levels.length
          });
          setHistoricalData(histData);
          setNoDataAvailable(false);
        }
      }
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      setNoDataAvailable(true);
    } finally {
      setDataLoading(false);
    }
  };
  
  // 지역 선택 핸들러
  const handleRegionSelect = async (region: string) => {  // [수정] async 추가
    console.log(`지역 선택: ${region}`);
    
    // 새 지역 선택 시 이전 데이터 초기화 (중요)
    setHistoricalData({
      temperatures: [],
      co2Levels: [],
      humidity: []
    });
    
    // 선택된 지역 설정
    setSelectedRegion(region);
    
    // 로딩 상태 시작
    setDataLoading(true);
    setNoDataAvailable(false);
    
    // 현재 설정된 날짜 계산
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'hour':
        startDate = new Date(now.getTime() - timeValue * 60 * 60 * 1000);
        break;
      case 'day':
        startDate = new Date(now.getTime() - timeValue * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - timeValue, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - timeValue, 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - timeValue * 60 * 60 * 1000);
    }
    
    // [수정] CO2 데이터를 별도로 로드하는 부분 추가
    try {
      // CO2 데이터 별도로 로드 (지역 선택 시 바로 가져오기)
      console.log(`${region} 국가의 CO2 데이터 요청 시작`);
      const co2Data = await fetchCountryCO2Data(region);
      console.log(`${region} 국가의 CO2 데이터 가져오기 완료: ${co2Data.length}개 데이터 포인트`);
      
      // 선택된 지역에 대한 데이터 자동 조회 (지역 선택 시 바로 데이터 로드)
      handleFetchData(timeRange, timeValue, startDate.toISOString(), now.toISOString());
    } catch (error) {
      console.error(`${region} 국가 CO2 데이터 로드 실패:`, error);
      // 오류 발생 시에도 기본 데이터는 로드
      handleFetchData(timeRange, timeValue, startDate.toISOString(), now.toISOString());
    }
  };
  
  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (type: DataType) => {
    setDataType(type);
  };

  // 지도 컴포넌트 구성
  const mapContent = (
    <WorldMap 
      data={worldData} 
      countriesData={globalData}
      timeRange={timeRange}
      timeValue={timeValue}
      dataType={dataType}
      onDataTypeChange={handleDataTypeChange}
      onRegionSelect={handleRegionSelect} 
    />
  );
  
  // 디버깅용 로그 추가
  useEffect(() => {
    console.log('현재 상태:', {
      selectedRegion,
      dataLoading,
      noDataAvailable,
      maxYears,
      historicalData: {
        temperatures: historicalData.temperatures.length,
        humidity: historicalData.humidity.length,
        co2Levels: historicalData.co2Levels.length
      }
    });
  }, [selectedRegion, dataLoading, noDataAvailable, maxYears, historicalData]);
  
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 기존 레이아웃 그대로 유지 */}
      <div className='absolute top-4 left-4 z-30'>
        <GoMainBtn />
      </div>
      
      <div 
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="p-4 pb-16 min-h-full">
          <div className="flex flex-col lg:flex-row items-start justify-center">
            
            <div className="w-full lg:w-2/3 h-[75vh] rounded-xl">
            <MapLayout
              mapContent={mapContent}
              historicalData={historicalData}
              selectedRegion={selectedRegion}
              loading={dataLoading}
              noData={noDataAvailable}
              data={
                regionInfo 
                  ? {
                      ...regionInfo,
                      historicalData: {
                        temperatures: regionInfo.historicalData?.temperatures || [],
                        co2Levels: historicalData.co2Levels || [], // [수정] CO2 데이터는 항상 historialData에서 가져옴
                        humidity: historicalData.humidity || []
                      }
                    }
                  : { 
                      countryCode: selectedRegion || '', 
                      name: selectedRegion || ''
                    }
              }
            />
            </div>
            
            <div className="w-full lg:w-1/3 mt-4 lg:mt-0 scale-90">
              <TimeSlider
                timeRange={timeRange}
                onChange={handleTimeValueChange}
                onRangeChange={handleTimeRangeChange}
                onFetchData={handleFetchData}
                maxYears={maxYears} // 동적으로 백엔드 데이터 최대 연수 전달
              />
            </div>

            {/* 기여도 보기 버튼 추가 */}
            <ContributionButton />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earth;