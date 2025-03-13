import axios from 'axios';

// API 기본 설정
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 세계 데이터 가져오기
export const fetchWorldData = async () => {
  try {
    const response = await apiClient.get('/world-data');
    return response.data;
  } catch (error) {
    console.error('세계 데이터 가져오기 실패:', error);
    throw error;
  }
};

// 특정 지역 데이터 가져오기
export const fetchRegionData = async (regionId: string) => {
  try {
    const response = await apiClient.get(`/regions/${regionId}`);
    return response.data;
  } catch (error) {
    console.error(`${regionId} 지역 데이터 가져오기 실패:`, error);
    throw error;
  }
};

// 환경 데이터 가져오기
export const fetchEnvironmentalData = async (regionId: string) => {
  try {
    const response = await apiClient.get(`/regions/${regionId}/environmental`);
    return response.data;
  } catch (error) {
    console.error(`${regionId} 환경 데이터 가져오기 실패:`, error);
    throw error;
  }
};

// 지역 검색
export const searchRegions = async (query: string) => {
  try {
    const response = await apiClient.get(`/regions/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('지역 검색 실패:', error);
    throw error;
  }
};

// 모의 데이터 (API 연동 전 테스트용)
export const getMockWorldData = () => {
  return {
    regions: [
      {
        id: 'asia',
        name: '아시아',
        environmentalIndex: 6.2,
        biodiversityCount: 45000,
        threatLevel: 7.5,
      },
      {
        id: 'europe',
        name: '유럽',
        environmentalIndex: 7.8,
        biodiversityCount: 30000,
        threatLevel: 5.2,
      },
      {
        id: 'north_america',
        name: '북아메리카',
        environmentalIndex: 7.1,
        biodiversityCount: 35000,
        threatLevel: 6.3,
      },
      {
        id: 'south_america',
        name: '남아메리카',
        environmentalIndex: 8.2,
        biodiversityCount: 50000,
        threatLevel: 6.8,
      },
      {
        id: 'africa',
        name: '아프리카',
        environmentalIndex: 6.7,
        biodiversityCount: 55000,
        threatLevel: 7.9,
      },
      {
        id: 'oceania',
        name: '오세아니아',
        environmentalIndex: 7.5,
        biodiversityCount: 25000,
        threatLevel: 6.1,
      },
    ],
  };
};