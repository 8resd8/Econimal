import axios from 'axios';
import { TimeRange } from '../components/TimeSlider';

// API 기본 설정 - 환경 변수 대신 하드코딩된 URL 사용
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // 실제 API URL로 변경 필요
  headers: {
    'Content-Type': 'application/json',
  },
});

// 지역 데이터 인터페이스
export interface RegionData {
  name: string;
  description: string;
  co2Level?: number;
  temperature?: number;
  population?: number;
  area?: number;
  environmentalIndex?: number;
  biodiversityCount?: number;
  threatLevel?: number;
  conservationEfforts?: string[];
  historicalData?: {
    co2Levels: { timestamp: string; value: number }[];
    temperatures: { timestamp: string; value: number }[];
  };
}

// API 호출 파라미터 인터페이스
interface FetchRegionDataParams {
  region: string;
  timeRange: TimeRange;
  timeValue: number;
}

// 지역 데이터 가져오기 함수
export const fetchRegionInfo = async ({
  region,
  timeRange,
  timeValue
}: FetchRegionDataParams): Promise<RegionData> => {
  try {
    // 실제 API 호출 (주석 처리)
    // const endpoint = `/region/${encodeURIComponent(region)}`;
    // const params = new URLSearchParams();
    // params.append('range', timeRange);
    // params.append('value', timeValue.toString());
    // const response = await apiClient.get(`${endpoint}?${params.toString()}`);
    // return response.data;
    
    // 임시 데이터 반환
    return generateMockRegionData(region, timeRange, timeValue);
  } catch (error) {
    console.error('지역 데이터 가져오기 실패:', error);
    
    // 에러 발생 시 기본 데이터 반환
    return generateMockRegionData(region, timeRange, timeValue);
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
  co2Levels: { timestamp: string; value: number }[];
  temperatures: { timestamp: string; value: number }[];
}> => {
  try {
    // 실제 API 호출 (주석 처리)
    // const endpoint = `/region/${encodeURIComponent(region)}/history`;
    // const params = new URLSearchParams();
    // params.append('range', timeRange);
    // const response = await apiClient.get(`${endpoint}?${params.toString()}`);
    // return response.data;
    
    // 임시 히스토리 데이터 생성
    return generateMockHistoricalData(region, timeRange);
  } catch (error) {
    console.error('히스토리 데이터 가져오기 실패:', error);
    
    // 에러 발생 시 빈 배열 반환
    return generateMockHistoricalData(region, timeRange);
  }
};

// 모의 지역 데이터 생성
const generateMockRegionData = (
  region: string,
  timeRange: TimeRange,
  timeValue: number
): RegionData => {
  // 지역 이름을 기반으로 일관된 값 생성
  const regionFactor = region.length % 10;
  
  // 시간 추세 계산 (0 = 현재, 1 = 과거)
  // 범위에 따라 시간 값 정규화
  const maxTime = timeRange === 'hour' ? 72 : timeRange === 'day' ? 90 : 12;
  const timeFactor = timeValue / (maxTime || 1); // 0으로 나누기 방지
  
  // 시간에 따라 CO2 감소 (과거로 갈수록 낮은 CO2 농도)
  const co2Trend = 30 * timeFactor; // 최대 30ppm 차이
  const co2Level = 380 + regionFactor * 5 + Math.random() * 20 - co2Trend;
  
  // 시간에 따라 온도 감소 (과거로 갈수록 낮은 온도)
  const tempTrend = 3 * timeFactor; // 최대 3도 차이
  const temperature = 10 + regionFactor * 1.5 + Math.random() * 10 - tempTrend;
  
  // 환경 지수 증가 (과거로 갈수록 좋은 환경)
  const envTrend = 2 * timeFactor; // 최대 2포인트 차이
  const environmentalIndex = Math.min(10, 3 + (regionFactor / 10) * 7 + Math.random() * 2 + envTrend);
  
  // 생물다양성 증가 (과거로 갈수록 더 높은 생물다양성)
  const bioTrend = 5000 * timeFactor; // 최대 5,000 차이
  const biodiversityCount = 5000 + regionFactor * 2000 + Math.floor(Math.random() * 10000) + bioTrend;
  
  // 위협 수준 감소 (과거로 갈수록 낮은 위협)
  const threatTrend = 3 * timeFactor; // 최대 3포인트 차이
  const threatLevel = Math.max(1, 3 + (regionFactor / 10) * 6 + Math.random() * 2 - threatTrend);
  
  // 인구
  const population = 5000000 + regionFactor * 10000000 + Math.floor(Math.random() * 50000000);
  
  // 면적
  const area = 100000 + regionFactor * 500000 + Math.floor(Math.random() * 1000000);
  
  // 보존 노력 예시
  const conservationEfforts = [
    `${region}의 탄소 배출 감소 프로그램`,
    `${region} 지역의 재생 에너지 전환 프로젝트`,
    `${region}의 생물다양성 보존 이니셔티브`,
    `${region} 해안 보호 및 복원 활동`
  ];
  
  // 지역별 고유한 설명
  const descriptions = {
    "United States": "미국은 다양한 기후와 지형을 가진 나라로, 현재 탄소 중립을 향한 에너지 전환에 중점을 두고 있습니다. 국립공원 시스템을 통해 자연 보존에도 큰 노력을 기울이고 있습니다.",
    "China": "중국은 세계에서 가장 인구가 많은 나라로, 급속한 산업화로 인한 환경 문제에 직면해 있지만 최근 녹색 에너지와 오염 저감에 적극적으로 투자하고 있습니다.",
    "Germany": "독일은 에너지 전환(Energiewende)을 통해 재생에너지 사용을 크게 확대하고 있으며, 환경 정책 분야에서 세계적인 리더로 자리 잡고 있습니다.",
    "Brazil": "브라질은 세계에서 가장 큰 열대우림인 아마존을 보유한 생물다양성의 보고로, 삼림 보존과 지속 가능한 발전 사이의 균형을 맞추기 위해 노력하고 있습니다.",
    "India": "인도는 급속한 경제 성장과 도시화를 겪으며 환경 문제에 직면해 있지만, 태양광 에너지와 같은 재생에너지 분야에서 큰 발전을 이루고 있습니다.",
    "Japan": "일본은 자연재해에 취약한 지리적 위치에 있으며, 에너지 안보와 환경 보존 사이의 균형을 맞추기 위한 혁신적인 기술에 투자하고 있습니다.",
    "Australia": "호주는 독특한 생태계와 다양한 야생동물로 유명하지만, 기후 변화로 인한 산불과 산호초 백화현상과 같은 도전에 직면해 있습니다.",
    "South Africa": "남아프리카공화국은 풍부한 생물다양성과 광물 자원을 보유하고 있으며, 지속 가능한 개발과 자연 보존 사이의 균형을 찾기 위해 노력하고 있습니다.",
    "France": "프랑스는 원자력 발전을 통해 낮은 탄소 배출을 달성하고 있으며, 파리협정의 본거지로서 국제 기후 정책에서 중요한 역할을 하고 있습니다.",
    "Russia": "러시아는 세계에서 가장 넓은 국토와 방대한 자연 자원을 보유하고 있으며, 시베리아의 영구동토층 해동과 관련된 환경 문제에 주목하고 있습니다."
  };
  
  // 기본 설명 생성
  let description = `${region}은(는) 세계에서 중요한 지역으로, 현재 환경 변화와 지속 가능한 발전의 과제에 직면해 있습니다. 이 지역의 이산화탄소 농도와 기온 데이터는 전 세계적인 기후 변화 추세를 보여줍니다.`;
  
  // 지역별 고유 설명이 있으면 사용
  if (region in descriptions) {
    description = descriptions[region as keyof typeof descriptions];
  }
  
  return {
    name: region,
    description,
    co2Level,
    temperature,
    population,
    area,
    environmentalIndex,
    biodiversityCount,
    threatLevel,
    conservationEfforts
  };
};

// 모의 히스토리 데이터 생성
const generateMockHistoricalData = (
  region: string,
  timeRange: TimeRange
): {
  co2Levels: { timestamp: string; value: number }[];
  temperatures: { timestamp: string; value: number }[];
} => {
  // 데이터 포인트 수 결정
  let pointCount = 0;
  let intervalHours = 0;
  
  switch (timeRange) {
    case 'hour':
      pointCount = 72; // 72시간 (3일) 데이터
      intervalHours = 1; // 1시간 간격
      break;
    case 'day':
      pointCount = 90; // 90일 (3개월) 데이터
      intervalHours = 24; // 1일 간격
      break;
    case 'month':
      pointCount = 12; // 12개월 (1년) 데이터
      intervalHours = 24 * 30; // 약 1개월 간격
      break;
    case 'all':
      pointCount = 20; // 전체 기록 (20년)
      intervalHours = 24 * 365; // 약 1년 간격
      break;
  }
  
  // 지역 이름을 기반으로 일관된 값 생성
  const regionFactor = region.length % 10;
  
  // 현재 시간
  const now = new Date();
  
  // CO2 및 온도 데이터 초기화
  const co2Levels: { timestamp: string; value: number }[] = [];
  const temperatures: { timestamp: string; value: number }[] = [];
  
  // 과거부터 현재까지의 데이터 생성
  for (let i = pointCount - 1; i >= 0; i--) {
    // 타임스탬프 계산
    const timestamp = new Date(now.getTime() - i * intervalHours * 60 * 60 * 1000);
    
    // 시간이 지남에 따라 CO2 증가 (과거에 낮음)
    const co2Progress = i / pointCount; // 1 = 과거, 0 = 현재
    const co2Base = 380 + regionFactor * 5;
    const co2Increase = 30 * (1 - co2Progress); // 최대 30ppm 증가
    const co2Value = co2Base + co2Increase + (Math.random() - 0.5) * 10; // 약간의 변동성 추가
    
    // 시간이 지남에 따라 온도 증가 (과거에 낮음)
    const tempProgress = i / pointCount; // 1 = 과거, 0 = 현재
    const tempBase = 10 + regionFactor * 1.5;
    const tempIncrease = 3 * (1 - tempProgress); // 최대 3도 증가
    const tempValue = tempBase + tempIncrease + (Math.random() - 0.5) * 2; // 약간의 변동성 추가
    
    co2Levels.push({
      timestamp: timestamp.toISOString(),
      value: co2Value
    });
    
    temperatures.push({
      timestamp: timestamp.toISOString(),
      value: tempValue
    });
  }
  
  return {
    co2Levels,
    temperatures
  };
};

export default {
  fetchRegionInfo,
  fetchHistoricalData
};