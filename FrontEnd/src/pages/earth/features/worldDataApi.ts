import axios from 'axios';

// apiClient 설정에 인증 토큰 추가
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰 추가
  },
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 국가 데이터 인터페이스 수정
export interface CountryData {
  temperature: number;
  humidity: number;
  co2Level?: number;
}

// 데이터 타입 추가
export type DataType = 'temperature' | 'humidity' | 'co2';

// 세계 데이터 인터페이스 수정
export interface WorldData {
  groupByDateTime: {
    [timestamp: string]: {
      [countryCode: string]: CountryData;
    };
  };
  groupByCountry: {
    [countryCode: string]: {
      [timestamp: string]: CountryData;
    };
  };
}

// 세계 데이터 가져오기 함수
export const fetchWorldData = async (
  startDateParam: Date | string, 
  endDateParam: Date | string, 
  type: 'HOUR' | 'DAY' | 'MONTH' | 'ALL'
): Promise<WorldData> => {
  try {
    // 인증 토큰 확인
    const sessionToken = sessionStorage.getItem('accessToken');
    const localToken = localStorage.getItem('accessToken');
    const token = sessionToken || localToken;
    
    if (!token) {
      console.warn('인증 토큰이 없습니다. API 호출이 실패할 수 있습니다.');
    }

    // 날짜 형식 변환 (ISO 형식으로 통일)
    const formatDate = (date: Date | string): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toISOString();
    };

    const startDate = formatDate(startDateParam);
    const endDate = formatDate(endDateParam);
    
    // 요청 본문 구성
    const requestData = {
      startDate,
      endDate,
      type
    };
    
    console.log('API 요청 데이터:', requestData);

    // API 호출
    const response = await apiClient.post('/globe', requestData);
    
    // 응답 데이터 로깅 추가
    console.log('API 원본 응답:', response.data);
    
    // 응답 데이터 검증 및 변환
    const responseData = response.data;
    
    // 응답 데이터를 확인하여 적절한 구조로 변환
    let formattedData: WorldData = {
      groupByDateTime: {},
      groupByCountry: {}
    };
    
    // API 응답 구조에 따라 데이터 변환
    if (responseData && typeof responseData === 'object') {
      // 응답에 groupByDateTime이 있는 경우 그대로 사용
      if (responseData.groupByDateTime) {
        formattedData.groupByDateTime = responseData.groupByDateTime;
      }
      
      // 응답에 groupByCountry가 있는 경우 그대로 사용
      if (responseData.groupByCountry) {
        formattedData.groupByCountry = responseData.groupByCountry;
      }
      
      // 다른 형태의 응답일 경우 데이터 변환
      // 예: 타임스탬프가 최상위 키인 경우
      else if (Object.keys(responseData).some(key => key.match(/^\d{4}-\d{2}-\d{2}/))) {
        const tempGroupByDateTime: {[key: string]: any} = {};
        
        // 각 타임스탬프에 대해 처리
        Object.entries(responseData).forEach(([timestamp, countryData]) => {
          if (typeof countryData === 'object') {
            tempGroupByDateTime[timestamp] = countryData;
          }
        });
        
        formattedData.groupByDateTime = tempGroupByDateTime;
        
        // groupByCountry 구조 생성
        const tempGroupByCountry: {[key: string]: any} = {};
        
        Object.entries(tempGroupByDateTime).forEach(([timestamp, countries]) => {
          Object.entries(countries as object).forEach(([countryCode, data]) => {
            if (!tempGroupByCountry[countryCode]) {
              tempGroupByCountry[countryCode] = {};
            }
            tempGroupByCountry[countryCode][timestamp] = data;
          });
        });
        
        formattedData.groupByCountry = tempGroupByCountry;
      }
    }
    
    console.log('API 응답 변환 결과:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('세계 데이터 가져오기 실패:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('응답 상태 코드:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    
    // 오류 시 빈 데이터 반환
    return {
      groupByDateTime: {},
      groupByCountry: {}
    };
  }
};

// 특정 국가 데이터 가져오기 함수
export const fetchCountryData = async (
  countryCode: string,
  startDate: string, 
  endDate: string, 
  type: 'HOUR' | 'DAY' | 'MONTH' | 'ALL'
): Promise<CountryData[]> => {
  try {
    const response = await apiClient.post('/globe', {
      startDate,
      endDate,
      type,
      countryCode
    });
    
    // 응답 데이터 형식에 따라 변환
    let resultData: CountryData[] = [];
    
    if (response.data && response.data.groupByDateTime) {
      // 타임스탬프별로 데이터를 배열로 변환
      Object.entries(response.data.groupByDateTime).forEach(([timestamp, countries]: [string, any]) => {
        if (countries[countryCode]) {
          resultData.push({
            ...countries[countryCode],
            timestamp: timestamp
          });
        }
      });
    }
    
    return resultData;
  } catch (error) {
    console.error(`${countryCode} 국가 데이터 가져오기 실패:`, error);
    return [];
  }
};

// 모든 국가 코드 가져오기 함수
export const fetchAllCountryCodes = async (): Promise<string[]> => {
  try {
    // 샘플 요청으로 사용 가능한 국가 코드 확인
    const currentDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const response = await apiClient.post('/globe', {
      startDate,
      endDate: currentDate,
      type: 'HOUR'
    });
    
    const countryCodes = new Set<string>();
    
    // 응답에서 모든 국가 코드 추출
    if (response.data && response.data.groupByDateTime) {
      const latestTimestamp = Object.keys(response.data.groupByDateTime).pop();
      
      if (latestTimestamp) {
        const countries = response.data.groupByDateTime[latestTimestamp];
        Object.keys(countries).forEach(code => countryCodes.add(code));
      }
    }
    
    return Array.from(countryCodes);
  } catch (error) {
    console.error('국가 코드 가져오기 실패:', error);
    return [];
  }
};

export default {
  fetchWorldData,
  fetchCountryData,
  fetchAllCountryCodes
};
// 추가 API 함수들...
// 필요한 경우 확장