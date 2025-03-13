import axios from 'axios';

// API 기본 설정
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 타입 정의
interface RegionInfo {
  name: string;
  description: string;
  population?: number;
  area?: number;
  environmentalIndex?: number;
  biodiversityCount?: number;
  threatLevel?: number;
  conservationEfforts?: string[];
}

// 지역 정보 가져오기
export const fetchRegionInfo = async (regionName: string): Promise<RegionInfo> => {
  try {
    const response = await apiClient.get(`/regions/info?name=${encodeURIComponent(regionName)}`);
    return response.data;
  } catch (error) {
    console.error(`${regionName} 지역 정보 가져오기 실패:`, error);
    // 실패 시 모의 데이터 반환
    return getMockRegionInfo(regionName);
  }
};

// 지역 환경 통계 가져오기
export const fetchRegionEnvironmentalStats = async (regionName: string) => {
  try {
    const response = await apiClient.get(`/regions/environmental-stats?name=${encodeURIComponent(regionName)}`);
    return response.data;
  } catch (error) {
    console.error(`${regionName} 환경 통계 가져오기 실패:`, error);
    throw error;
  }
};

// 지역 위기종 데이터 가져오기
export const fetchRegionEndangeredSpecies = async (regionName: string) => {
  try {
    const response = await apiClient.get(`/regions/endangered-species?name=${encodeURIComponent(regionName)}`);
    return response.data;
  } catch (error) {
    console.error(`${regionName} 위기종 데이터 가져오기 실패:`, error);
    throw error;
  }
};

// 모의 데이터 (API 연동 전 테스트용)
export const getMockRegionInfo = (regionName: string): RegionInfo => {
  // 명시적인 타입 정의와 인덱스 시그니처를 사용한 객체 정의
  const mockData: { [key: string]: RegionInfo } = {
    'Asia': {
      name: '아시아',
      description: '아시아는 지구에서 가장 큰 대륙으로, 다양한 생태계와 세계 인구의 60% 이상을 보유하고 있습니다. 급속한 도시화와 산업화로 인해 환경 문제에 직면해 있지만, 다양한 보존 노력이 진행 중입니다.',
      population: 4600000000,
      area: 44580000,
      environmentalIndex: 6.2,
      biodiversityCount: 45000,
      threatLevel: 7.5,
      conservationEfforts: [
        '중국의 대기오염 감소 프로젝트',
        '인도의 태양광 에너지 확대',
        '동남아시아 산호초 보존 프로그램',
        '중앙아시아 수자원 관리 협약'
      ]
    },
    'Europe': {
      name: '유럽',
      description: '유럽은 다양한 환경 정책과 재생에너지 투자로 환경 보존에 앞장서고 있는 대륙입니다. 역사적인 산업화로 인한 환경 문제를 해결하기 위해 지속가능한 개발에 중점을 두고 있습니다.',
      population: 746400000,
      area: 10180000,
      environmentalIndex: 7.8,
      biodiversityCount: 30000,
      threatLevel: 5.2,
      conservationEfforts: [
        '유럽 연합의 탄소 중립 2050 프로젝트',
        '발트해 오염 저감 프로그램',
        'Natura 2000 보호 지역 네트워크',
        '알프스 산맥 생태계 보존 계획'
      ]
    },
    'North America': {
      name: '북아메리카',
      description: '북아메리카는 광활한 자연 경관과 다양한 생태계를 보유하고 있으며, 국립공원 시스템을 통해 자연 보존에 힘쓰고 있습니다. 그러나, 산업화와 도시 확장으로 인한 서식지 손실이 주요 환경 문제로 남아있습니다.',
      population: 592296000,
      area: 24709000,
      environmentalIndex: 7.1,
      biodiversityCount: 35000,
      threatLevel: 6.3,
      conservationEfforts: [
        '미국 국립공원 시스템 확장',
        '캐나다 북부 삼림 보존 프로그램',
        '멕시코 만 해양 보호 지역 설정',
        '그레이트 레이크스 수질 개선 프로젝트'
      ]
    }
  };
  
  // 안전한 접근: 키가 존재하는지 확인
  if (regionName in mockData) {
    return mockData[regionName];
  }
  
  // 존재하지 않는 경우 기본 데이터 반환
  return {
    name: regionName,
    description: `${regionName}은(는) 지구의 중요한 지역으로, 독특한 생태계와 문화를 보유하고 있습니다. 현재 이 지역에 대한 상세 정보는 준비 중입니다.`,
    environmentalIndex: Math.random() * 10,
    biodiversityCount: Math.floor(Math.random() * 50000) + 10000,
    threatLevel: Math.random() * 10,
  };
};