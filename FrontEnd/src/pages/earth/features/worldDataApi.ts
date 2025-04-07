import axios from 'axios';
import { fetchLatestCO2Data } from './co2DataApi';

// API 클라이언트 생성 - 토큰 관리 개선
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

// 국가 데이터 인터페이스
export interface CountryData {
  temperature?: number;
  humidity?: number;
  co2Level?: number;
}

// 세계 데이터 인터페이스
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

// 시간 문자열 정각화 함수 (추가)
function roundToHour(dateStr: string): string {
  const date = new Date(dateStr);
  date.setMinutes(0, 0, 0); // 분, 초, 밀리초를 0으로 설정
  return date.toISOString();
}

// 세계 데이터 가져오기 함수
export const fetchWorldData = async (
  startDateParam: Date | string, 
  endDateParam: Date | string, 
  type: 'HOUR' | 'DAY' | 'MONTH' | 'YEAR'
): Promise<WorldData> => {
  try {
    // 인증 토큰 확인
    const sessionToken = sessionStorage.getItem('accessToken');
    const localToken = localStorage.getItem('accessToken');
    const token = sessionToken || localToken;
    
    if (!token) {
      console.warn('인증 토큰이 없습니다. API 호출이 실패할 수 있습니다.');
    }

    // 날짜 형식 변환 (ISO 형식으로 통일) - 항상 정각으로 설정
    const formatDate = (date: Date | string): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      d.setMinutes(0, 0, 0); // 분, 초, 밀리초를 0으로 설정
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
      
      // 응답 객체가 비어있는지 확인
      const isEmptyObject = (
        Object.keys(formattedData.groupByDateTime).length === 0 && 
        Object.keys(formattedData.groupByCountry).length === 0
      );
      
      // groupByDateTime과 groupByCountry가 비어있지만 응답이 있는 경우
      if (isEmptyObject && Object.keys(responseData).length > 0) {
        // 다른 형태의 응답인지 확인 (타임스탬프가 최상위 키인 경우)
        if (Object.keys(responseData).some(key => key.match(/^\d{4}-\d{2}-\d{2}/))) {
          const tempGroupByDateTime: {[key: string]: any} = {};
          
          // 각 타임스탬프에 대해 처리
          Object.entries(responseData).forEach(([timestamp, countryData]) => {
            if (typeof countryData === 'object') {
              // 타임스탬프를 정각으로 정규화
              const normalizedTimestamp = roundToHour(timestamp);
              tempGroupByDateTime[normalizedTimestamp] = countryData;
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
      
      // 최종 데이터가 비어있는 경우 로그 출력
      if (
        Object.keys(formattedData.groupByDateTime).length === 0 && 
        Object.keys(formattedData.groupByCountry).length === 0
      ) {
        console.warn("API 응답에서 데이터를 찾을 수 없음:", responseData);
      }
    }
    
    // CO2 데이터 추가 - 별도 엔드포인트에서 가져오기
    try {
      console.log('CO2 데이터 가져오기 시작');
      
      // 수정: 올바른 엔드포인트에서 CO2 데이터 가져오기
      const co2Response = await apiClient.get('/globe/v2/all/carbon');
      
      if (co2Response.data && typeof co2Response.data === 'object') {
        console.log(`CO2 데이터 가져오기 완료: ${Object.keys(co2Response.data).length}개 국가`);
        
        // CO2 데이터를 기존 데이터에 통합
        const co2Data = co2Response.data;
        
        if (Object.keys(co2Data).length > 0) {
          // groupByDateTime의 각 타임스탬프에 CO2 데이터 추가
          Object.keys(formattedData.groupByDateTime).forEach(timestamp => {
            const countriesAtTime = formattedData.groupByDateTime[timestamp];
            
            Object.keys(countriesAtTime).forEach(countryCode => {
              if (co2Data[countryCode]) {
                // 해당 국가의 CO2 데이터 가져오기 (첫 번째 항목 사용)
                const countryCO2 = Array.isArray(co2Data[countryCode]) && co2Data[countryCode].length > 0
                  ? co2Data[countryCode][0].value
                  : null;
                
                if (countryCO2 !== null) {
                  // 기존 데이터에 CO2 데이터 추가
                  countriesAtTime[countryCode].co2Level = countryCO2;
                }
              }
            });
          });
          
          // groupByCountry에도 CO2 데이터 추가
          Object.keys(formattedData.groupByCountry).forEach(countryCode => {
            if (co2Data[countryCode]) {
              // 해당 국가의 CO2 데이터 가져오기 (첫 번째 항목 사용)
              const countryCO2 = Array.isArray(co2Data[countryCode]) && co2Data[countryCode].length > 0
                ? co2Data[countryCode][0].value
                : null;
              
              if (countryCO2 !== null) {
                const countryTimestamps = formattedData.groupByCountry[countryCode];
                
                Object.keys(countryTimestamps).forEach(timestamp => {
                  // 각 타임스탬프 데이터에 CO2 추가
                  countryTimestamps[timestamp].co2Level = countryCO2;
                });
              }
            }
          });
          
          console.log('CO2 데이터 통합 완료');
        }
      } else {
        console.warn('유효한 CO2 데이터가 없습니다');
      }
    } catch (error) {
      console.error('CO2 데이터 통합 실패:', error);
    }
    
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
  type: 'HOUR' | 'DAY' | 'MONTH' | 'YEAR'
): Promise<CountryData[]> => {
  try {
    // 날짜를 정각으로 변환
    const formattedStartDate = roundToHour(startDate);
    const formattedEndDate = roundToHour(endDate);
    
    const response = await apiClient.post('/globe', {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
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
    
    // CO2 데이터 추가
    try {
      const co2Data = await fetchLatestCO2Data();
      if (co2Data[countryCode] !== undefined) {
        // 모든 시점의 데이터에 동일한 CO2 값 추가
        resultData = resultData.map(data => ({
          ...data,
          co2Level: co2Data[countryCode]
        }));
      }
    } catch (error) {
      console.error(`${countryCode} 국가의 CO2 데이터 추가 실패:`, error);
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
    const now = new Date();
    now.setMinutes(0, 0, 0); // 정각으로 설정
    const currentDate = now.toISOString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setMinutes(0, 0, 0); // 정각으로 설정
    const startDate = yesterday.toISOString();
    
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