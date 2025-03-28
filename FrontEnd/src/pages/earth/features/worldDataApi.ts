import axios from 'axios';

// API 기본 설정 - 환경 변수 대신 하드코딩된 URL 사용
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // 실제 API URL로 변경 필요
  headers: {
    'Content-Type': 'application/json',
  },
});

// 전역 국가 데이터 인터페이스
export interface CountryData {
  co2Level: number;
  temperature: number;
  environmentalIndex?: number;
  biodiversityCount?: number;
  threatLevel?: number;
}

// 세계 데이터 인터페이스
export interface WorldData {
  timestamp: string;
  countries: Record<string, CountryData>;
}

// 임시 국가 목록 - 실제 구현 시 확장 필요
const COUNTRIES = [
  "United States", "Canada", "Mexico", "Brazil", "Argentina", 
  "United Kingdom", "France", "Germany", "Spain", "Italy", 
  "Russia", "China", "Japan", "India", "South Korea", 
  "Australia", "New Zealand", "South Africa", "Egypt", "Nigeria", 
  "Saudi Arabia", "Israel", "Turkey", "Indonesia", "Thailand", 
  "Vietnam", "Malaysia", "Singapore", "Philippines", "Pakistan",
  "Colombia", "Chile", "Peru", "Venezuela", "Bolivia",
  "Morocco", "Kenya", "Ethiopia", "Ghana", "Tanzania",
  "Iran", "Iraq", "Kazakhstan", "Mongolia", "Afghanistan"
];

// 세계 데이터 가져오기
export const fetchWorldData = async (): Promise<WorldData> => {
  try {
    // 실제 API 연동 시 아래 주석을 해제
    // const response = await apiClient.get('/world-data');
    // return response.data;
    
    // 임시로 모의 데이터 반환
    return generateMockWorldData();
  } catch (error) {
    console.error('세계 데이터 가져오기 실패:', error);
    // 오류 발생 시에도 모의 데이터 반환
    return generateMockWorldData();
  }
};

// 모의 세계 데이터 생성
const generateMockWorldData = (): WorldData => {
  const countries: Record<string, CountryData> = {};
  
  // 각 국가에 대한 모의 데이터 생성
  COUNTRIES.forEach(country => {
    // 랜덤 값이지만 국가 이름 길이를 기반으로 하여 일관성 부여
    const countryFactor = country.length % 10;
    
    // CO2 농도: 350ppm ~ 450ppm 사이
    const co2Level = 380 + countryFactor * 5 + Math.random() * 20;
    
    // 온도: 5°C ~ 30°C 사이
    const temperature = 5 + countryFactor * 2 + Math.random() * 10;
    
    // 환경 지수: 1 ~ 10 사이
    const environmentalIndex = 3 + (countryFactor / 10) * 7 + Math.random() * 2;
    
    // 생물다양성: 10,000 ~ 60,000
    const biodiversityCount = 10000 + countryFactor * 3000 + Math.floor(Math.random() * 20000);
    
    // 위협 수준: 1 ~ 10 사이
    const threatLevel = 3 + (countryFactor / 10) * 6 + Math.random() * 2;
    
    countries[country] = {
      co2Level,
      temperature,
      environmentalIndex,
      biodiversityCount,
      threatLevel
    };
  });
  
  return {
    timestamp: new Date().toISOString(),
    countries
  };
};

// 특정 시간대의 세계 데이터 가져오기
export const fetchWorldDataByTime = async (
  timeRange: 'hour' | 'day' | 'month' | 'all',
  timeValue: number
): Promise<WorldData> => {
  try {
    // 실제 API 연동 시 아래 주석을 해제
    // const response = await apiClient.get(`/world-data?range=${timeRange}&value=${timeValue}`);
    // return response.data;
    
    // 임시로 모의 데이터 반환 (시간에 따라 변화)
    return generateMockWorldDataByTime(timeRange, timeValue);
  } catch (error) {
    console.error('세계 데이터 가져오기 실패:', error);
    // 오류 발생 시에도 모의 데이터 반환
    return generateMockWorldDataByTime(timeRange, timeValue);
  }
};

// 시간에 따른 모의 세계 데이터 생성
const generateMockWorldDataByTime = (
  timeRange: 'hour' | 'day' | 'month' | 'all',
  timeValue: number
): WorldData => {
  const countries: Record<string, CountryData> = {};
  
  // 시간 추세 계산 (0 = 현재, 1 = 과거)
  // 범위에 따라 시간 값 정규화
  const maxTime = timeRange === 'hour' ? 72 : timeRange === 'day' ? 90 : 12;
  const timeFactor = timeValue / maxTime;
  
  // 각 국가에 대한 모의 데이터 생성
  COUNTRIES.forEach(country => {
    const countryFactor = country.length % 10;
    
    // 시간에 따라 CO2 감소 (과거로 갈수록 낮은 CO2 농도)
    const co2Trend = 30 * timeFactor; // 최대 30ppm 차이
    const co2Level = 380 + countryFactor * 5 + Math.random() * 20 - co2Trend;
    
    // 시간에 따라 온도 감소 (과거로 갈수록 낮은 온도)
    const tempTrend = 3 * timeFactor; // 최대 3도 차이
    const temperature = 5 + countryFactor * 2 + Math.random() * 10 - tempTrend;
    
    // 환경 지수 증가 (과거로 갈수록 좋은 환경)
    const envTrend = 2 * timeFactor; // 최대 2포인트 차이
    const environmentalIndex = Math.min(10, 3 + (countryFactor / 10) * 7 + Math.random() * 2 + envTrend);
    
    // 생물다양성 증가 (과거로 갈수록 더 높은 생물다양성)
    const bioTrend = 10000 * timeFactor; // 최대 10,000 차이
    const biodiversityCount = 10000 + countryFactor * 3000 + Math.floor(Math.random() * 20000) + bioTrend;
    
    // 위협 수준 감소 (과거로 갈수록 낮은 위협)
    const threatTrend = 4 * timeFactor; // 최대 4포인트 차이
    const threatLevel = Math.max(1, 3 + (countryFactor / 10) * 6 + Math.random() * 2 - threatTrend);
    
    countries[country] = {
      co2Level,
      temperature,
      environmentalIndex,
      biodiversityCount,
      threatLevel
    };
  });
  
  // 과거 날짜 계산
  const date = new Date();
  if (timeRange === 'hour') {
    date.setHours(date.getHours() - timeValue);
  } else if (timeRange === 'day') {
    date.setDate(date.getDate() - timeValue);
  } else if (timeRange === 'month') {
    date.setMonth(date.getMonth() - timeValue);
  }
  
  return {
    timestamp: date.toISOString(),
    countries
  };
};

// 추가 API 함수들...
// 필요한 경우 확장