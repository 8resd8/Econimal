import axios from 'axios';
import { TimeRange } from '../components/TimeSlider';
import { getCountryNameByCode, getCountryDescription } from '../utils/countryUtils';

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

// 지역 정보 가져오기 함수
export const fetchRegionInfo = async ({
  region,
  timeRange,
  timeValue
}: FetchRegionDataParams): Promise<RegionData> => {
  try {
    // 현재 날짜와 시작 날짜 계산
    const endDate = new Date().toISOString();
    const startDate = calculateStartDate(timeRange, timeValue);

    console.log('지역 정보 요청 파라미터:', {
      startDate,
      endDate,
      type: timeRange.toUpperCase(),
      countryCode: region
    });

    // API 요청
    const response = await apiClient.post('/globe', {
      startDate,
      endDate,
      type: timeRange.toUpperCase(),
      countryCode: region
    });

    console.log('지역 정보 API 응답 성공:', response.status);

    // 응답 데이터 변환
    return convertToRegionData(response.data, region);
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
    
    // 현재 날짜와 시작 날짜 계산 - 수정된 부분
    let endDate = new Date().toISOString();
    let startDate;
    
    // 시간 범위에 따른 시작 날짜 계산
    // 포스트맨에서 사용한 형식을 그대로 사용
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0] + 'T00:00:00';
    };
    
    switch(timeRange) {
      case 'hour':
        // 최소 24시간 데이터 요청
        const hourDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        startDate = formatDate(hourDate);
        break;
      case 'day':
        // 최소 31일치
        const dayDate = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
        startDate = formatDate(dayDate);
        break;
      case 'month':
        // 최소 6개월치
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - 6);
        startDate = formatDate(monthDate);
        break;
      case 'all':
      default:
        // 기본값 - 최소 1년치
        const yearDate = new Date();
        yearDate.setFullYear(yearDate.getFullYear() - 1);
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
      countryCode: region
    });

    // API 호출
    const response = await apiClient.post('/globe', {
      startDate,
      endDate,
      type: timeRange.toUpperCase(),
      countryCode: region
    });

    console.log('히스토리 데이터 API 응답 상태:', response.status);
    
    // 응답이 비어있거나 유효하지 않은 경우 처리
    if (!response.data) {
      console.warn('API 응답 데이터가 비어 있습니다. 더미 데이터를 사용합니다.');
      return {
        temperatures: generateDummyData('temperature', region),
        humidity: generateDummyData('humidity', region),
        co2Levels: generateDummyData('co2', region)
      };
    }
    
    // API 응답 원본 로깅 추가
    console.log('API 응답 원본 구조:', JSON.stringify(response.data, null, 2).substring(0, 300) + '...');
    
    // 응답 데이터 구조 자세히 확인
    if (response.data) {
      // 기본 구조 확인
      const hasGroupByDateTime = !!response.data.groupByDateTime;
      const hasGroupByCountry = !!response.data.groupByCountry;
      
      console.log('응답 데이터 구조:', {
        'groupByDateTime 존재': hasGroupByDateTime,
        'groupByCountry 존재': hasGroupByCountry
      });
      
      // 사용 가능한 국가 코드 목록 확인
      if (hasGroupByCountry) {
        const availableCountries = Object.keys(response.data.groupByCountry);
        console.log(`사용 가능한 국가 코드: ${availableCountries.join(', ')}`);
        console.log(`요청한 국가 코드 ${region}가 응답에 포함됨: ${availableCountries.includes(region)}`);
      }
      
      // groupByCountry 구조 확인 (지역별 시간 데이터)
      if (hasGroupByCountry && response.data.groupByCountry[region]) {
        const regionData = response.data.groupByCountry[region];
        const timestamps = Object.keys(regionData);
        console.log(`${region}의 타임스탬프 수: ${timestamps.length}`);
        
        if (timestamps.length > 0) {
          console.log('첫 번째 타임스탬프:', timestamps[0]);
          console.log('마지막 타임스탬프:', timestamps[timestamps.length - 1]);
          
          // 첫 번째 데이터 샘플 로깅
          const sampleData = regionData[timestamps[0]];
          console.log('첫 번째 데이터 샘플:', JSON.stringify(sampleData));
        }
      } else if (hasGroupByCountry) {
        console.log(`주의: ${region} 국가 데이터가 응답에 없습니다.`);
      }
    }
    
    // 응답 데이터 변환 - groupByCountry 사용 우선
    const historicalData = convertToHistoricalData(response.data, region);
    
    console.log(`변환된 히스토리 데이터: 온도 ${historicalData.temperatures.length}개, 습도 ${historicalData.humidity.length}개, CO2 ${historicalData.co2Levels.length}개`);
    
    // 변환된 데이터가 비어 있으면 더미 데이터 사용
    if (historicalData.temperatures.length === 0 && 
        historicalData.humidity.length === 0 && 
        historicalData.co2Levels.length === 0) {
      console.log('변환된 데이터가 비어 있어 더미 데이터를 사용합니다.');
      return {
        temperatures: generateDummyData('temperature', region),
        humidity: generateDummyData('humidity', region),
        co2Levels: generateDummyData('co2', region)
      };
    }
    
    // 최소 데이터 포인트 확인
    const minDataPoints = 5; // 의미 있는 차트를 위한 최소 데이터 포인트
    
    if (historicalData.temperatures.length < minDataPoints) {
      console.log(`온도 데이터 포인트가 ${minDataPoints}개 미만입니다. 더미 데이터를 사용합니다.`);
      return {
        temperatures: generateDummyData('temperature', region),
        humidity: generateDummyData('humidity', region),
        co2Levels: generateDummyData('co2', region)
      };
    }
    
    return historicalData;
  } catch (error) {
    console.error('히스토리 데이터 가져오기 실패:', error);
    
    // 오류 발생 시 더미 데이터 반환
    console.log('API 오류로 인해 더미 데이터를 사용합니다.');
    return {
      temperatures: generateDummyData('temperature', region),
      humidity: generateDummyData('humidity', region),
      co2Levels: generateDummyData('co2', region)
    };
  }
};

// 시작 날짜 계산 함수
function calculateStartDate(timeRange: TimeRange, timeValue: number): string {
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
    case 'all':
    default:
      startDate = new Date(now.getFullYear() - timeValue, 0, 1);
  }

  return startDate.toISOString();
}

// 더미 데이터 생성 함수 (지역별로 다른 값)
function generateDummyData(type: 'temperature' | 'co2' | 'humidity', region?: string, count: number = 7) {
  const now = new Date();
  const dummyData = [];
  
  // 지역별로 약간 다른 값을 생성하기 위한 시드
  const regionSeed = region ? 
    (region.charCodeAt(0) + (region.charCodeAt(1) || 0)) % 10 : 
    Math.floor(Math.random() * 10);
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // 일별 변동성 추가
    const dayVariation = Math.sin(i * 0.5) * 3;
    
    let value;
    switch (type) {
      case 'temperature':
        value = 20 + regionSeed + dayVariation; // 15~30°C
        break;
      case 'co2':
        value = 380 + (regionSeed * 5) + dayVariation; // 375~435ppm
        break;
      case 'humidity':
        value = 50 + (regionSeed * 5) + dayVariation; // 45~95%
        break;
    }
    
    dummyData.push({
      timestamp: date.toISOString(),
      value
    });
  }
  
  return dummyData.reverse(); // 날짜순 정렬
}

// API 응답 데이터를 RegionData로 변환
function convertToRegionData(apiData: any, region: string): RegionData {
  // API 응답 구조 확인 - 최신 타임스탬프 가져오기
  if (!apiData || !apiData.groupByDateTime) {
    console.warn('유효한 API 응답 데이터가 없습니다');
    return generateFallbackRegionData(region);
  }

  const timestamps = Object.keys(apiData.groupByDateTime || {}).sort();
  if (timestamps.length === 0) {
    console.warn('타임스탬프 데이터가 없습니다');
    return generateFallbackRegionData(region);
  }

  const latestTimestamp = timestamps[timestamps.length - 1];
  const countryData = apiData.groupByDateTime[latestTimestamp][region];

  if (!countryData) {
    console.warn(`${region} 국가 데이터가 없습니다`);
    return generateFallbackRegionData(region);
  }

  return {
    countryCode: region,
    name: getCountryNameByCode(region),
    temperature: countryData.temperature,
    humidity: countryData.humidity,
    co2Level: countryData.co2Level,
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
function convertToHistoricalData(apiData: any, region: string) {
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

  return { temperatures, co2Levels, humidity };
}

// 폴백 데이터 생성 함수
function generateFallbackRegionData(region: string): RegionData {
  return {
    countryCode: region,
    name: getCountryNameByCode(region),
    temperature: 20 + (region.charCodeAt(0) % 10),
    humidity: 60 + (region.charCodeAt(0) % 30),
    co2Level: 380 + (region.charCodeAt(0) % 40),
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

export default {
  fetchRegionInfo,
  fetchHistoricalData
};