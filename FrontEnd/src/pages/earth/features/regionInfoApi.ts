import axios from 'axios';
import { TimeRange } from '../components/TimeSlider';
import { getCountryNameByCode, getCountryDescription } from '../utils/countryUtils';
import { fetchCountryCO2Data, CO2Data } from './co2DataApi';

// 지역 데이터 인터페이스 정의
export interface RegionData {
  countryCode: string;
  name: string;
  temperature?: number;
  humidity?: number;
  co2Level?: number;
  description?: string;
  environmentalIndex?: number;
  biodiversityCount?: number;
  population?: number;
  area?: number;
  conservationEfforts?: string[];
  threatLevel?: number;
  historicalData?: {
    temperatures: { timestamp: string; value: number }[];
    co2Levels: { timestamp: string; value: number }[];
    humidity: { timestamp: string; value: number }[];
  };
}

// API 호출 파라미터 인터페이스
interface FetchRegionDataParams {
  region: string;
  timeRange: TimeRange;
  timeValue: number;
}

// regionInfoApi.ts에 인증 인터셉터 추가
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    // 토큰 확인 및 로깅
    const sessionToken = sessionStorage.getItem('accessToken');
    const localToken = localStorage.getItem('accessToken');
    
    console.log('지역 API 호출 인증 상태:', {
      '요청 URL': config.url,
      'sessionToken': sessionToken ? '존재함' : '없음',
      'localToken': localToken ? '존재함' : '없음'
    });
    
    // 먼저 세션스토리지에서 토큰 확인
    let token = sessionToken;
    
    // 없으면 로컬스토리지에서 확인
    if (!token) {
      token = localToken;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('요청에 토큰 적용됨');
    } else {
      console.warn('토큰이 없어 인증 헤더가 설정되지 않음');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', {
      'URL': response.config.url,
      '상태 코드': response.status,
      '데이터 유무': response.data ? '있음' : '없음'
    });
    return response;
  },
  (error) => {
    console.error('API 응답 오류:', {
      'URL': error.config?.url,
      '상태 코드': error.response?.status,
      '오류 메시지': error.message,
      '서버 응답': error.response?.data
    });
    return Promise.reject(error);
  }
);

function roundToHour(dateStr: string): string {
  const date = new Date(dateStr);
  date.setMinutes(0, 0, 0); // 분, 초, 밀리초를 0으로 설정
  return date.toISOString();
}

// 지역 정보 가져오기 함수
export const fetchRegionInfo = async ({
  region,
  timeRange,
  timeValue
}: FetchRegionDataParams): Promise<RegionData> => {
  try {
    // 현재 날짜와 시작 날짜 계산
    const now = new Date();
    now.setMinutes(0, 0, 0); // 정각으로 설정
    const endDate = now.toISOString();
    const startDate = calculateStartDate(timeRange, timeValue, true); // 정각 변환 플래그 추가

    console.log('지역 정보 요청 파라미터:', {
      startDate,
      endDate,
      type: timeRange.toUpperCase(),
    });

    // API 요청
    const response = await apiClient.post('/globe', {
      startDate,
      endDate,
      type: timeRange.toUpperCase(),
    });

    console.log('지역 정보 API 응답 성공:', response.status);

    // [수정] CO2 데이터 요청
    let co2Data: CO2Data[] = [];
    try {
      co2Data = await fetchCountryCO2Data(region);
      console.log(`${region} 국가의 CO2 데이터 가져오기 성공:`, co2Data.length > 0 ? '데이터 있음' : '데이터 없음');
    } catch (error) {
      console.error(`${region} 국가의 CO2 데이터 가져오기 실패:`, error);
    }

    // 응답 데이터 변환 (CO2 데이터 포함)
    return convertToRegionData(response.data, region, co2Data);
  } catch (error) {
    console.error('지역 데이터 가져오기 실패:', error);
    return generateFallbackRegionData(region);
  }
};

// 히스토리 데이터 가져오기 함수
export const fetchHistoricalData = async ({
  region,
  timeRange
}: {
  region: string;
  timeRange: TimeRange;
}): Promise<{
  temperatures: { timestamp: string; value: number }[];
  co2Levels: { timestamp: string; value: number }[];
  humidity: { timestamp: string; value: number }[];
}> => {
  console.log(`fetchHistoricalData 함수 시작 - 지역: ${region}, 시간 범위: ${timeRange}`);
  try {
    console.log(`${region} 지역의 히스토리 데이터 요청 시작, 시간 범위: ${timeRange}`);
    
    // 현재 날짜와 시작 날짜 계산
    let endDate = new Date().toISOString();
    
    // 날짜 형식 변환 (ISO 형식으로 통일) - 항상 정각으로 설정
    const formatDate = (date: Date | string): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      d.setMinutes(0, 0, 0); // 분, 초, 밀리초를 0으로 설정
      return d.toISOString().split('.')[0];
    };
    
    // 충분한 데이터 포인트를 얻기 위해 기간 확장
    let startDate;
    
    switch(timeRange) {
      case 'hour':
        // 최소 7일치 데이터 요청 (시간 단위 데이터 더 많이 필요)
        const hourDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        startDate = formatDate(hourDate);
        break;
      case 'day':
        // 최소 31일치
        const dayDate = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
        startDate = formatDate(dayDate);
        break;
      case 'month':
        // 최소 12개월치
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - 12);
        startDate = formatDate(monthDate);
        break;
      case 'year':
      default:
        // 기본값 - 최소 2년치
        const yearDate = new Date();
        yearDate.setFullYear(yearDate.getFullYear() - 2);
        startDate = formatDate(yearDate);
    }
    
    // 종료 날짜도 같은 형식으로 변환
    endDate = formatDate(new Date());
    
    // 계산된 시작 날짜 로깅
    console.log('계산된 시작 날짜:', startDate);
    
    // API 요청 파라미터 로깅
    console.log('히스토리 데이터 요청 파라미터:', {
      startDate,
      endDate,
      type: timeRange.toUpperCase(),
    });

    // API 호출
    const response = await apiClient.post('/globe', {
      startDate,
      endDate,
      type: timeRange.toUpperCase(),
    });

    console.log('히스토리 데이터 API 응답 상태:', response.status);
    
    // [수정] CO2 데이터 가져오기 (별도 API)
    let co2Data: CO2Data[] = [];
    try {
      co2Data = await fetchCountryCO2Data(region);
      console.log(`${region} 국가의 CO2 데이터 가져오기 성공:`, 
        co2Data.length > 0 ? `${co2Data.length}개 데이터 포인트` : '데이터 없음');
    } catch (error) {
      console.error(`${region} 국가의 CO2 데이터 가져오기 실패:`, error);
    }
    
    // 응답이 비어있거나 유효하지 않은 경우 처리
    if (!response.data) {
      console.warn('API 응답 데이터가 비어 있습니다.');
    }
    
    // API 응답 구조 자세히 확인
    if (response.data) {
      // 기본 구조 확인
      const hasGroupByDateTime = !!response.data.groupByDateTime;
      const hasGroupByCountry = !!response.data.groupByCountry;
      
      console.log('응답 데이터 구조:', {
        'groupByDateTime 존재': hasGroupByDateTime,
        'groupByCountry 존재': hasGroupByCountry
      });
      
      // 사용 가능한 국가 코드 목록 확인
      const availableCountries = hasGroupByCountry 
        ? Object.keys(response.data.groupByCountry) 
        : [];
        
      console.log(`사용 가능한 국가 코드: ${availableCountries.join(', ')}`);
      console.log(`요청한 국가 코드 ${region}가 응답에 포함됨: ${availableCountries.includes(region)}`);
      
      // [수정] 응답 데이터 변환 - co2Data 전달
      const historicalData = convertToHistoricalData(response.data, region, co2Data);
      
      // 변환된 데이터 로깅
      console.log(`변환된 히스토리 데이터: 온도 ${historicalData.temperatures.length}개, 습도 ${historicalData.humidity.length}개, CO2 ${historicalData.co2Levels.length}개`);
      
      const MIN_DATA_POINTS = 7; // 최소 필요 데이터 포인트 수
      
      // 반환할 최종 데이터
      const finalData = {
        temperatures: historicalData.temperatures,
        humidity: historicalData.humidity,
        co2Levels: historicalData.co2Levels
      };
      
      // 데이터 포인트 수 검증 및 부족한 경우 보완 처리
      if (finalData.temperatures.length < MIN_DATA_POINTS) {
        console.log(`온도 데이터가 부족합니다 (${finalData.temperatures.length}/${MIN_DATA_POINTS}). 필요시 보완합니다.`);
        
        if (finalData.temperatures.length > 0) {
          // 데이터가 있지만 부족한 경우 - 있는 데이터를 기반으로 보완
          finalData.temperatures = complementDataPoints(finalData.temperatures, MIN_DATA_POINTS);
        } else {
          console.log('데이터가 전혀 없습니다')
        }
      }
      
      if (finalData.humidity.length < MIN_DATA_POINTS) {
        console.log(`습도 데이터가 부족합니다 (${finalData.humidity.length}/${MIN_DATA_POINTS}). 필요시 보완합니다.`);
        
        if (finalData.humidity.length > 0) {
          // 데이터가 있지만 부족한 경우 - 있는 데이터를 기반으로 보완
          finalData.humidity = complementDataPoints(finalData.humidity, MIN_DATA_POINTS);
        } else {
          console.log('데이터가 전혀 없습니다')
        }
      }
      
      if (finalData.co2Levels.length < MIN_DATA_POINTS) {
        console.log(`CO2 데이터가 부족합니다 (${finalData.co2Levels.length}/${MIN_DATA_POINTS}). 필요시 보완합니다.`);
        
        if (finalData.co2Levels.length > 0) {
          // 데이터가 있지만 부족한 경우 - 있는 데이터를 기반으로 보완
          finalData.co2Levels = complementDataPoints(finalData.co2Levels, MIN_DATA_POINTS);
        } else {
          console.log('데이터가 전혀 없습니다')
        }
      }
      
      return finalData;
    }
    
    // 응답 데이터가 유효하지 않은 경우
    console.warn('유효한 응답 데이터 구조가 아닙니다.');
    // 대신 빈 데이터 반환
    return {
      temperatures: [],
      co2Levels: [],
      humidity: []
    };
  } catch (error) {
    console.error('히스토리 데이터 가져오기 실패:', error);
    // 대신 빈 데이터 반환
    return {
      temperatures: [],
      co2Levels: [],
      humidity: []
    };
  }
};

// 데이터 포인트를 보완하는 함수 (최소 필요 포인트 수 만큼 채움)
function complementDataPoints(
  data: { timestamp: string; value: number }[], 
  minPoints: number
): { timestamp: string; value: number }[] {
  if (data.length >= minPoints) return data;
  
  // 기존 데이터 복사
  const result = [...data];
  
  // 데이터를 시간순으로 정렬
  result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // 마지막 데이터 포인트와 첫 데이터 포인트
  const lastPoint = result[result.length - 1];
  const firstPoint = result[0];
  
  // 보완이 필요한 데이터 포인트 수
  const neededPoints = minPoints - result.length;
  
  // 데이터 포인트 간 시간 간격 계산 (밀리초)
  const lastDate = new Date(lastPoint.timestamp).getTime();
  const firstDate = new Date(firstPoint.timestamp).getTime();
  
  let interval;
  
  if (result.length > 1) {
    // 데이터가 2개 이상이면 실제 간격 계산
    interval = (lastDate - firstDate) / (result.length - 1);
  } else {
    // 데이터가 1개면 임의 간격 (1일)
    interval = 24 * 60 * 60 * 1000;
  }
  
  // 값 변동 계산 (추세 반영)
  let valueChange = 0;
  if (result.length > 1) {
    valueChange = (lastPoint.value - firstPoint.value) / (result.length - 1);
  }
  
  // 미래 포인트 추가
  for (let i = 1; i <= neededPoints; i++) {
    const newDate = new Date(lastDate + interval * i);
    const newValue = lastPoint.value + valueChange * i;
    
    result.push({
      timestamp: newDate.toISOString(),
      value: newValue
    });
  }
  
  return result;
}

// 시작 날짜 계산 함수
function calculateStartDate(timeRange: TimeRange, timeValue: number, roundToFullHour: boolean = true): string {
  const now = new Date();
  if (roundToFullHour) {
    now.setMinutes(0, 0, 0); // 정각으로 설정
  }
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
    default:
      startDate = new Date(now.getFullYear() - timeValue, 0, 1);
  }

  if (roundToFullHour) {
    startDate.setMinutes(0, 0, 0); // 시작 시간도 정각으로 설정
  }

  return startDate.toISOString();
}

// API 응답 데이터를 RegionData로 변환
function convertToRegionData(apiData: any, region: string, co2Data: CO2Data[] = []): RegionData {
  // API 응답 구조 확인
  if (!apiData) {
    console.warn('유효한 API 응답 데이터가 없습니다');
    return generateFallbackRegionData(region);
  }
  
  // 직접 날짜 키가 있는지 확인 (최상위 키가 날짜인 경우)
  const directDateKeys = Object.keys(apiData).filter(key => key.match(/^\d{4}-\d{2}-\d{2}/));
  
  // 날짜 키가 직접 있는 경우 데이터 구조 변환
  if (directDateKeys.length > 0 && !apiData.groupByDateTime) {
    console.log('날짜 키가 직접 있는 구조 발견, 변환 중...');
    const tempData = {
      groupByDateTime: {} as Record<string, Record<string, any>>,
      groupByCountry: {} as Record<string, Record<string, any>>
    };
    
    directDateKeys.forEach(dateKey => {
      // 정각으로 날짜 변환
      const normalizedDate = roundToHour(dateKey);
      tempData.groupByDateTime[normalizedDate] = apiData[dateKey];
    });
    
    // 국가별 구조 생성
    Object.entries(tempData.groupByDateTime).forEach(([timestamp, countries]) => {
      if (typeof countries === 'object' && countries !== null) {
        Object.entries(countries as Record<string, any>).forEach(([countryCode, data]) => {
          if (!tempData.groupByCountry[countryCode]) {
            tempData.groupByCountry[countryCode] = {};
          }
          tempData.groupByCountry[countryCode][timestamp] = data;
        });
      }
    });
    
    // 원본 데이터 업데이트
    apiData = tempData;
  }
  
  // groupByDateTime이 존재하지 않거나 객체가 아닌 경우
  if (!apiData.groupByDateTime || typeof apiData.groupByDateTime !== 'object') {
    console.warn('변환 후에도 groupByDateTime 데이터가 없습니다');
    return generateFallbackRegionData(region);
  }

  // 타임스탬프 목록 추출 및 정렬
  const timestamps = Object.keys(apiData.groupByDateTime).sort();
  
  if (timestamps.length === 0) {
    console.warn('타임스탬프 데이터가 없습니다');
    return generateFallbackRegionData(region);
  }

  // 최신 타임스탬프와 해당 데이터 추출
  const latestTimestamp = timestamps[timestamps.length - 1];
  
  // 해당 타임스탬프의 데이터가 없는 경우
  if (!apiData.groupByDateTime[latestTimestamp] || 
      typeof apiData.groupByDateTime[latestTimestamp] !== 'object') {
    console.warn(`${latestTimestamp} 타임스탬프에 대한 데이터가 없습니다`);
    return generateFallbackRegionData(region);
  }
  
  // 타입 안전하게 데이터 접근
  const timeData = apiData.groupByDateTime[latestTimestamp] as Record<string, any>;
  
  // 해당 국가 데이터가 없는 경우
  if (!timeData[region]) {
    console.warn(`${region} 국가 데이터가 없습니다`);
    return generateFallbackRegionData(region);
  }

  const countryData = timeData[region];
  
  // [수정] CO2 데이터 추가 (가장 최신 데이터 사용)
  let co2Level = countryData.co2Level;
  if (co2Data && co2Data.length > 0) {
    // 연도순으로 정렬하여 가장 최신 데이터 사용
    const sortedCO2Data = [...co2Data].sort((a, b) => b.year - a.year);
    co2Level = sortedCO2Data[0].value;
  }
  
  // 데이터 변환 및 반환
  return {
    countryCode: region,
    name: getCountryNameByCode(region),
    temperature: countryData.temperature,
    humidity: countryData.humidity,
    co2Level: co2Level,
    description: getCountryDescription(region),
    environmentalIndex: 5,
    biodiversityCount: 10000,
    population: 50000000,
    area: 100000,
    conservationEfforts: [
      `${getCountryNameByCode(region)} 환경 보존 프로그램`,
      `${getCountryNameByCode(region)} 지속 가능한 개발 이니셔티브`
    ],
    threatLevel: 3
  };
}

// 히스토리 데이터 변환 함수
function convertToHistoricalData(apiData: any, region: string, co2Data: CO2Data[] = []) {
  const temperatures: { timestamp: string; value: number }[] = [];
  const co2Levels: { timestamp: string; value: number }[] = [];
  const humidity: { timestamp: string; value: number }[] = [];

  try {
    // API 응답 구조 로깅
    console.log('API 응답 구조 확인:', 
      apiData ? 'apiData 있음' : 'apiData 없음',
      apiData?.groupByDateTime ? 'groupByDateTime 있음' : 'groupByDateTime 없음',
      apiData?.groupByCountry ? 'groupByCountry 있음' : 'groupByCountry 없음'
    );
    
    // 중요: groupByCountry 데이터 우선 사용하도록 순서 변경
    
    // 1. 먼저 groupByCountry 구조에서 데이터 추출 시도 (다중 시점 데이터)
    if (apiData?.groupByCountry?.[region]) {
      const countryData = apiData.groupByCountry[region];
      
      // 타임스탬프 정렬
      const timestamps = Object.keys(countryData).sort();
      console.log(`groupByCountry의 ${region} 타임스탬프 개수: ${timestamps.length}`);
      
      timestamps.forEach(timestamp => {
        const data = countryData[timestamp];
        
        // 온도 데이터 추출 (문자열이면 숫자로 변환)
        if (data.temperature !== undefined) {
          const tempValue = typeof data.temperature === 'string' 
            ? parseFloat(data.temperature) 
            : data.temperature;
            
          if (!isNaN(tempValue)) {
            temperatures.push({
              timestamp,
              value: tempValue
            });
          }
        }
        
        // 습도 데이터 추출 (문자열이면 숫자로 변환)
        if (data.humidity !== undefined) {
          const humValue = typeof data.humidity === 'string' 
            ? parseFloat(data.humidity) 
            : data.humidity;
            
          if (!isNaN(humValue)) {
            humidity.push({
              timestamp,
              value: humValue
            });
          }
        }
        
        // CO2 데이터 추출 (문자열이면 숫자로 변환)
        if (data.co2Level !== undefined) {
          const co2Value = typeof data.co2Level === 'string' 
            ? parseFloat(data.co2Level) 
            : data.co2Level;
            
          if (!isNaN(co2Value)) {
            co2Levels.push({
              timestamp,
              value: co2Value
            });
          }
        }
      });
    } 
    // 2. groupByDateTime에서 데이터 추출 시도 (단일 시점 데이터)
    else if (apiData?.groupByDateTime) {
      // 타임스탬프 정렬
      const timestamps = Object.keys(apiData.groupByDateTime).sort();
      console.log(`groupByDateTime 타임스탬프 개수: ${timestamps.length}`);
      
      if (timestamps.length > 0) {
        const sampleTimestamp = timestamps[0];
        const countries = Object.keys(apiData.groupByDateTime[sampleTimestamp] || {});
        console.log(`첫 타임스탬프의 국가 목록: ${countries.join(', ')}`);
        console.log(`찾는 지역 코드: ${region}`);
        console.log(`해당 지역 데이터 존재 여부: ${countries.includes(region)}`);
        
        if (countries.includes(region)) {
          const sampleData = apiData.groupByDateTime[sampleTimestamp][region];
          console.log('샘플 데이터:', sampleData);
        }
      }
      
      timestamps.forEach(timestamp => {
        const dateTimeData = apiData.groupByDateTime[timestamp];
        
        // 해당 타임스탬프에 region 데이터가 있는지 확인
        if (dateTimeData && dateTimeData[region]) {
          const countryData = dateTimeData[region];
          
          // 온도 데이터 추출 (문자열이면 숫자로 변환)
          if (countryData.temperature !== undefined) {
            const tempValue = typeof countryData.temperature === 'string' 
              ? parseFloat(countryData.temperature) 
              : countryData.temperature;
              
            if (!isNaN(tempValue)) {
              temperatures.push({
                timestamp,
                value: tempValue
              });
            }
          }
          
          // 습도 데이터 추출 (문자열이면 숫자로 변환)
          if (countryData.humidity !== undefined) {
            const humValue = typeof countryData.humidity === 'string' 
              ? parseFloat(countryData.humidity) 
              : countryData.humidity;
              
            if (!isNaN(humValue)) {
              humidity.push({
                timestamp,
                value: humValue
              });
            }
          }
          
          // CO2 데이터 추출 (문자열이면 숫자로 변환)
          if (countryData.co2Level !== undefined) {
            const co2Value = typeof countryData.co2Level === 'string' 
              ? parseFloat(countryData.co2Level) 
              : countryData.co2Level;
              
            if (!isNaN(co2Value)) {
              co2Levels.push({
                timestamp,
                value: co2Value
              });
            }
          }
        }
      });
    }
    
    // 추출된 데이터 로깅
    console.log('추출된 히스토리 데이터:', {
      temperatures: temperatures.length, 
      humidity: humidity.length, 
      co2Levels: co2Levels.length
    });
    
    // 데이터 샘플 확인
    if (temperatures.length > 0) {
      console.log('온도 데이터 샘플:', temperatures[0], temperatures[temperatures.length-1]);
    }
    if (humidity.length > 0) {
      console.log('습도 데이터 샘플:', humidity[0], humidity[humidity.length-1]);
    }
    if (co2Levels.length > 0) {
      console.log('CO2 데이터 샘플:', co2Levels[0], co2Levels[co2Levels.length-1]);
    }
    
    // 데이터 정렬 (날짜순)
    temperatures.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    humidity.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    co2Levels.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // 정렬 후 데이터 포인트 개수 확인
    console.log('정렬 후 데이터 포인트 개수:', {
      temperatures: temperatures.length, 
      humidity: humidity.length, 
      co2Levels: co2Levels.length
    });
  } catch (e) {
    console.error('히스토리 데이터 변환 중 오류:', e);
  }

  // [수정] CO2 데이터 추가 (연도별 데이터)
  if (co2Data && co2Data.length > 0) {
    // 연도별 데이터를 타임스탬프 형식으로 변환
    co2Data.forEach(data => {
      if (data.year && data.value) {
        // 각 연도의 1월 1일 기준으로 타임스탬프 생성
        const timestamp = new Date(data.year, 0, 1).toISOString();
        co2Levels.push({
          timestamp,
          value: data.value
        });
      }
    });
    
    console.log(`${co2Levels.length}개의 CO2 데이터 포인트 추가됨`);
    
    // 날짜순 정렬
    co2Levels.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  return { temperatures, co2Levels, humidity };
}

// 폴백 데이터 생성 함수
function generateFallbackRegionData(region: string): RegionData {
  // 가상의 CO2 데이터 생성 (국가 코드 기반)
  const co2Level = 380 + (region.charCodeAt(0) % 40);
  
  return {
    countryCode: region,
    name: getCountryNameByCode(region),
    temperature: 20 + (region.charCodeAt(0) % 10),
    humidity: 60 + (region.charCodeAt(0) % 30),
    co2Level: co2Level,
    description: getCountryDescription(region),
    environmentalIndex: 5,
    biodiversityCount: 10000,
    population: 50000000,
    area: 100000,
    conservationEfforts: [
      `${getCountryNameByCode(region)} 환경 보존 프로그램`,
      `${getCountryNameByCode(region)} 지속 가능한 개발 이니셔티브`
    ],
    threatLevel: 3,
    historicalData: {
      temperatures: generateMockTimeSeriesData(20 + (region.charCodeAt(0) % 10), 7),
      co2Levels: generateMockTimeSeriesData(co2Level, 7),
      humidity: generateMockTimeSeriesData(60 + (region.charCodeAt(0) % 30), 7)
    }
  };
}

// [추가] 가상의 타임시리즈 데이터 생성 함수
function generateMockTimeSeriesData(baseValue: number, count: number): { timestamp: string; value: number }[] {
  const result: { timestamp: string; value: number }[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // 최근 날짜부터 과거로 이동
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // 값에 약간의 랜덤 변동 추가
    const variance = (Math.random() - 0.5) * 5;
    const value = baseValue + variance;
    
    result.push({
      timestamp: date.toISOString(),
      value: Number(value.toFixed(1))
    });
  }
  
  // 과거->현재 순으로 정렬
  return result.reverse();
}

export default {
  fetchRegionInfo,
  fetchHistoricalData
};