import axios from 'axios';
import { TimeRange } from '../components/TimeSlider';

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

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

    // API 요청
    const response = await apiClient.post('/globe', {
      startDate,
      endDate,
      type: timeRange.toUpperCase(),
      countryCode: region
    });

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
}> => {
  try {
    const response = await apiClient.post('/globe', {
      type: timeRange.toUpperCase(),
      countryCode: region
    });

    return convertHistoricalData(response.data);
  } catch (error) {
    console.error('히스토리 데이터 가져오기 실패:', error);
    return {
      temperatures: [],
      co2Levels: []
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

// API 응답 데이터를 RegionData로 변환
function convertToRegionData(apiData: any, region: string): RegionData {
  // API 응답의 첫 번째 타임스탬프 데이터 사용
  const timestamps = Object.keys(apiData.groupByDateTime || {});
  const latestTimestamp = timestamps[timestamps.length - 1];
  const countryData = latestTimestamp 
    ? apiData.groupByDateTime[latestTimestamp][region] 
    : {};

  return {
    countryCode: region,
    name: region,
    temperature: countryData.temperature,
    humidity: countryData.humidity,
    // 다른 필드들은 더미 데이터나 기본값으로 채우기
    description: getCountryDescription(region),
    environmentalIndex: 5, // 예시 값
    biodiversityCount: 10000, // 예시 값
    population: 50000000, // 예시 값
    area: 100000, // 예시 값
    conservationEfforts: [
      `${region} 환경 보존 프로그램`,
      `${region} 지속 가능한 개발 이니셔티브`
    ],
    threatLevel: 3 // 예시 값
  };
}

// 히스토리 데이터 변환 함수
function convertHistoricalData(apiData: any) {
  const temperatures: { timestamp: string; value: number }[] = [];
  const co2Levels: { timestamp: string; value: number }[] = [];

  // API 응답에서 온도 데이터 추출
  Object.entries(apiData.groupByDateTime || {}).forEach(([timestamp, countries]) => {
    Object.entries(countries as Record<string, any>).forEach(([countryCode, countryData]) => {
      if (countryData && typeof countryData.temperature === 'number') {
        temperatures.push({
          timestamp,
          value: countryData.temperature
        });
      }
    });
  });

  return { temperatures, co2Levels };
}

// 국가별 설명 생성 함수
function getCountryDescription(region: string): string {
  const descriptions: { [key: string]: string } = {
    "KR": "대한민국은 동아시아의 기술 혁신과 문화 강국으로, 지속 가능한 발전을 위해 노력하고 있습니다.",
    "JP": "일본은 첨단 기술과 전통이 공존하는 국가로, 환경 보호와 혁신에 큰 관심을 기울이고 있습니다.",
    // 다른 국가들의 설명 추가 가능
  };

  return descriptions[region] || `${region} 국가의 환경과 기후 현황`;
}

// 폴백 데이터 생성 함수
function generateFallbackRegionData(region: string): RegionData {
  return {
    countryCode: region,
    name: region,
    temperature: 20,
    humidity: 60,
    description: getCountryDescription(region),
    environmentalIndex: 5,
    biodiversityCount: 10000,
    population: 50000000,
    area: 100000,
    conservationEfforts: [
      `${region} 환경 보존 프로그램`,
      `${region} 지속 가능한 개발 이니셔티브`
    ],
    threatLevel: 3
  };
}

export default {
  fetchRegionInfo,
  fetchHistoricalData
};