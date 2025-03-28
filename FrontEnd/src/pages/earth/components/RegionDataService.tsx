// RegionDataService.ts
import { TimeRange } from './TimeSlider';

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
export const fetchRegionData = async ({
  region,
  timeRange,
  timeValue
}: FetchRegionDataParams): Promise<RegionData> => {
  try {
    // API 엔드포인트 구성
    const baseUrl = '/api/region';
    let endpoint = `${baseUrl}/${encodeURIComponent(region)}`;
    
    // 타임라인 파라미터 구성
    const params = new URLSearchParams();
    
    if (timeRange === 'all') {
      params.append('range', 'all');
    } else {
      params.append('range', timeRange);
      params.append('value', timeValue.toString());
    }
    
    // API 호출
    const response = await fetch(`${endpoint}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('지역 데이터 가져오기 실패:', error);
    
    // 에러 발생 시 기본 데이터 반환 (실제 구현 시 적절한 에러 처리 필요)
    return {
      name: region,
      description: `${region}에 대한 정보를 가져오는 중 오류가 발생했습니다.`,
      co2Level: 0,
      temperature: 0
    };
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
    // API 엔드포인트 구성
    const endpoint = `/api/region/${encodeURIComponent(region)}/history`;
    
    // 타임라인 파라미터 구성
    const params = new URLSearchParams();
    params.append('range', timeRange);
    
    // API 호출
    const response = await fetch(`${endpoint}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('히스토리 데이터 가져오기 실패:', error);
    
    // 에러 발생 시 빈 배열 반환
    return {
      co2Levels: [],
      temperatures: []
    };
  }
};