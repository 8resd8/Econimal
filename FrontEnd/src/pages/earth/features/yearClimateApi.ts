import axios from 'axios';

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가 (세션스토리지와 로컬스토리지 모두 체크)
apiClient.interceptors.request.use(
  (config) => {
    // 먼저 세션스토리지에서 토큰 확인
    let token = sessionStorage.getItem('accessToken');
    
    // 없으면 로컬스토리지에서 확인
    if (!token) {
      token = localStorage.getItem('accessToken');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    console.log('기후 API 응답 성공:', {
      'URL': response.config.url,
      '상태 코드': response.status,
      '데이터 유무': response.data ? '있음' : '없음'
    });
    return response;
  },
  (error) => {
    console.error('기후 API 응답 오류:', {
      'URL': error.config?.url,
      '상태 코드': error.response?.status,
      '오류 메시지': error.message,
      '서버 응답': error.response?.data
    });
    return Promise.reject(error);
  }
);

// 기후 데이터 인터페이스 정의
export interface ClimateData {
  temperature: string;
  humidity: string;
}

// 연도별 기후 데이터 응답 인터페이스
export interface YearlyClimateResponse {
  groupByCountry: {
    [countryCode: string]: {
      [timestamp: string]: ClimateData;
    }
  };
  groupByDateTime: {
    [timestamp: string]: {
      [countryCode: string]: ClimateData;
    }
  };
}

/**
 * 전체 연도별 기후 데이터 가져오기 함수
 * 모든 국가의 연도별 온도, 습도 데이터를 가져옵니다.
 */
export const fetchAllYearlyClimateData = async (): Promise<YearlyClimateResponse> => {
  try {
    console.log('연도별 기후 데이터 가져오기 시작');
    
    // 인증 토큰 확인
    const sessionToken = sessionStorage.getItem('accessToken');
    const localToken = localStorage.getItem('accessToken');
    const token = sessionToken || localToken;
    
    if (!token) {
      console.warn('인증 토큰이 없습니다. API 호출이 실패할 수 있습니다.');
    }
    
    // API 호출 - GET 방식 사용
    const response = await apiClient.get('/globe/v2/all/climate');
    
    console.log('연도별 기후 데이터 응답:', response.status);
    
    if (!response.data) {
      console.warn('연도별 기후 데이터 응답이 비어있습니다.');
      return { groupByCountry: {}, groupByDateTime: {} };
    }
    
    // 응답 데이터 구조 확인
    const hasGroupByCountry = !!response.data.groupByCountry;
    const hasGroupByDateTime = !!response.data.groupByDateTime;
    
    console.log('연도별 기후 데이터 구조:', {
      'groupByCountry 존재': hasGroupByCountry,
      'groupByDateTime 존재': hasGroupByDateTime,
      '국가 수': hasGroupByCountry ? Object.keys(response.data.groupByCountry).length : 0,
      '타임스탬프 수': hasGroupByDateTime ? Object.keys(response.data.groupByDateTime).length : 0
    });
    
    return response.data;
  } catch (error) {
    console.error('연도별 기후 데이터 가져오기 실패:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('응답 상태 코드:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    
    // 오류 시 빈 데이터 반환
    return {
      groupByCountry: {},
      groupByDateTime: {}
    };
  }
};

/**
 * 특정 연도의 기후 데이터 가져오기
 * 주어진 연도에 대한 모든 국가의 기후 데이터를 가져옵니다.
 */
export const fetchYearlyClimateDataByYear = async (year: number): Promise<{
  [countryCode: string]: ClimateData
}> => {
  try {
    console.log(`${year}년도 기후 데이터 가져오기 시작`);
    
    // 전체 데이터 가져오기
    const allData = await fetchAllYearlyClimateData();
    
    // 해당 연도 데이터 찾기
    const yearTimestamp = Object.keys(allData.groupByDateTime).find(timestamp => 
      timestamp.startsWith(`${year}`)
    );
    
    if (!yearTimestamp) {
      console.warn(`${year}년도에 해당하는 타임스탬프를 찾을 수 없습니다.`);
      return {};
    }
    
    console.log(`${year}년도 데이터 타임스탬프 찾음:`, yearTimestamp);
    return allData.groupByDateTime[yearTimestamp];
    
  } catch (error) {
    console.error(`${year}년도 기후 데이터 가져오기 실패:`, error);
    return {};
  }
};

/**
 * 특정 국가의 연도별 기후 데이터 가져오기
 * 특정 국가의 모든 연도 기후 데이터를 가져옵니다.
 */
export const fetchCountryYearlyClimateData = async (countryCode: string): Promise<{
  [timestamp: string]: ClimateData
}> => {
  try {
    console.log(`${countryCode} 국가의 연도별 기후 데이터 가져오기 시작`);
    
    // 전체 데이터 가져오기
    const allData = await fetchAllYearlyClimateData();
    
    // 특정 국가 데이터 확인
    if (!allData.groupByCountry[countryCode]) {
      console.warn(`${countryCode} 국가의 연도별 데이터가 없습니다.`);
      return {};
    }
    
    console.log(`${countryCode} 국가의 연도별 데이터 찾음:`, 
      Object.keys(allData.groupByCountry[countryCode]).length, '개 시점');
    
    return allData.groupByCountry[countryCode];
    
  } catch (error) {
    console.error(`${countryCode} 국가의 연도별 기후 데이터 가져오기 실패:`, error);
    return {};
  }
};

/**
 * 타임스탬프 문자열을 정규화하는 함수
 * 'YYYY-MM-DD HH:MM:SS' 형식을 'YYYY-MM-DDTHH:MM:SSZ' ISO 형식으로 변환
 */
export const normalizeTimestamp = (timestamp: string): string => {
  return timestamp.trim().replace(' ', 'T') + 'Z';
};

/**
 * 타임스탬프에서 연도를 추출하는 함수
 */
export const extractYearFromTimestamp = (timestamp: string): number => {
  return parseInt(timestamp.substring(0, 4), 10);
};

/**
 * 특정 연도에 대한 히스토리 데이터 생성
 * 특정 국가의 연도별 온습도 데이터를 히스토리 형식으로 변환합니다.
 */
export const createHistoricalDataFromYearly = async (
  countryCode: string
): Promise<{
  temperatures: { timestamp: string; value: number }[];
  humidity: { timestamp: string; value: number }[];
}> => {
  try {
    // 특정 국가의 연도별 데이터 가져오기
    const countryData = await fetchCountryYearlyClimateData(countryCode);
    
    // 히스토리 데이터 구조 초기화
    const temperatures: { timestamp: string; value: number }[] = [];
    const humidity: { timestamp: string; value: number }[] = [];
    
    // 타임스탬프 정렬 (시간순)
    const timestamps = Object.keys(countryData).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    
    // 각 타임스탬프에 대한 데이터 추가
    timestamps.forEach(timestamp => {
      const data = countryData[timestamp];
      const normalizedTimestamp = normalizeTimestamp(timestamp);
      
      // 온도 데이터 추가
      if (data.temperature) {
        temperatures.push({
          timestamp: normalizedTimestamp,
          value: parseFloat(data.temperature)
        });
      }
      
      // 습도 데이터 추가
      if (data.humidity) {
        humidity.push({
          timestamp: normalizedTimestamp,
          value: parseFloat(data.humidity)
        });
      }
    });
    
    return { temperatures, humidity };
  } catch (error) {
    console.error(`${countryCode} 국가의 히스토리 데이터 생성 실패:`, error);
    return { temperatures: [], humidity: [] };
  }
};

export default {
  fetchAllYearlyClimateData,
  fetchYearlyClimateDataByYear,
  fetchCountryYearlyClimateData,
  createHistoricalDataFromYearly
};