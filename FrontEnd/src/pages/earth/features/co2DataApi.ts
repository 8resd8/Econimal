import axios from 'axios';

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
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
    console.log('CO2 API 응답 성공:', {
      'URL': response.config.url,
      '상태 코드': response.status,
      '데이터 유무': response.data ? '있음' : '없음'
    });
    return response;
  },
  (error) => {
    console.error('CO2 API 응답 오류:', {
      'URL': error.config?.url,
      '상태 코드': error.response?.status,
      '오류 메시지': error.message,
      '서버 응답': error.response?.data
    });
    return Promise.reject(error);
  }
);

// CO2 데이터 인터페이스
export interface CO2Data {
  year: number;
  value: number;
}

// 국가별 CO2 데이터 인터페이스
export interface CountryCO2Data {
  [countryCode: string]: CO2Data[];
}

// 연도별 CO2 데이터 인터페이스
export interface YearlyCO2Data {
  [year: number]: Record<string, number>;
}

// 캐시 인터페이스
interface CO2Cache {
  groupByCountry: CountryCO2Data;
  groupByYear: YearlyCO2Data;
  loaded: boolean;
  lastFetched: number | null;
}

// 캐시 객체 초기화
const co2Cache: CO2Cache = {
  groupByCountry: {},
  groupByYear: {},
  loaded: false,
  lastFetched: null
};

// 캐시 만료 시간 (30분 = 1800000 밀리초)
const CACHE_EXPIRY_TIME = 1800000;

// 캐시 유효성 확인 함수
const isCacheValid = (): boolean => {
  if (!co2Cache.loaded || !co2Cache.lastFetched) {
    return false;
  }
  
  const now = Date.now();
  return (now - co2Cache.lastFetched) < CACHE_EXPIRY_TIME;
};

// 모든 국가의 연도별 CO2 데이터 가져오기
export const fetchAllCountriesCO2Data = async (forceRefresh = false): Promise<{
  groupByCountry: CountryCO2Data;
  groupByYear: YearlyCO2Data;
}> => {
  // 캐시가 유효하고 강제 새로고침이 아니면 캐시된 데이터 반환
  if (isCacheValid() && !forceRefresh) {
    console.log('캐시된 CO2 데이터 사용:', 
      Object.keys(co2Cache.groupByCountry).length, '개 국가,',
      Object.keys(co2Cache.groupByYear).length, '개 연도');
    return {
      groupByCountry: co2Cache.groupByCountry,
      groupByYear: co2Cache.groupByYear
    };
  }
  
  try {
    console.log('모든 국가의 CO2 데이터 요청 시작');
    
    const response = await apiClient.get('/globe/v2/all/carbon');
    console.log('CO2 데이터 응답 성공:', response.status);
    
    const groupByCountry: CountryCO2Data = {};
    const groupByYear: YearlyCO2Data = {};
    
    // groupByCountry 구조 처리
    if (response.data && response.data.groupByCountry) {
      Object.entries(response.data.groupByCountry).forEach(([countryCode, dateData]: [string, any]) => {
        groupByCountry[countryCode] = [];
        
        // 각 날짜별 CO2 데이터 처리
        Object.entries(dateData).forEach(([dateString, data]: [string, any]) => {
          // 날짜에서 연도 추출
          const year = new Date(dateString).getFullYear();
          
          // CO2 값 추출
          if (data.co2 !== undefined) {
            const co2Value = parseFloat(data.co2);
            
            if (!isNaN(co2Value)) {
              // 이미 있는 연도인지 확인
              const existingIndex = groupByCountry[countryCode].findIndex(item => item.year === year);
              
              if (existingIndex === -1) {
                // 새 연도 추가
                groupByCountry[countryCode].push({
                  year,
                  value: co2Value
                });
                
                // groupByYear 구조에도 추가
                if (!groupByYear[year]) {
                  groupByYear[year] = {};
                }
                groupByYear[year][countryCode] = co2Value;
              }
            }
          }
        });
        
        // 연도별로 정렬
        groupByCountry[countryCode].sort((a, b) => a.year - b.year);
      });
    }
    
    console.log(`변환된 CO2 데이터: ${Object.keys(groupByCountry).length}개 국가, ${Object.keys(groupByYear).length}개 연도`);
    
    // 캐시 업데이트
    co2Cache.groupByCountry = groupByCountry;
    co2Cache.groupByYear = groupByYear;
    co2Cache.loaded = true;
    co2Cache.lastFetched = Date.now();
    
    return { groupByCountry, groupByYear };
  } catch (error) {
    console.error('CO2 데이터 가져오기 실패:', error);
    
    // 오류 발생 시에도 캐시된 데이터가 있으면 반환
    if (co2Cache.loaded) {
      console.log('오류 발생으로 캐시된 CO2 데이터 사용');
      return {
        groupByCountry: co2Cache.groupByCountry,
        groupByYear: co2Cache.groupByYear
      };
    }
    
    return { groupByCountry: {}, groupByYear: {} };
  }
};

// 캐시 초기화 함수 (필요시 사용)
export const clearCO2Cache = (): void => {
  co2Cache.groupByCountry = {};
  co2Cache.groupByYear = {};
  co2Cache.loaded = false;
  co2Cache.lastFetched = null;
  console.log('CO2 데이터 캐시 초기화됨');
};

// 데이터 로드 및 캐싱 함수
export const loadAndCacheCO2Data = async (forceRefresh = false): Promise<void> => {
  if (isCacheValid() && !forceRefresh) {
    console.log('CO2 데이터 이미 캐시됨, 재사용');
    return;
  }
  
  await fetchAllCountriesCO2Data(forceRefresh);
  console.log('CO2 데이터 캐싱 완료');
};

// 특정 국가의 CO2 데이터 가져오기
export const fetchCountryCO2Data = async (countryCode: string): Promise<CO2Data[]> => {
  try {
    console.log(`${countryCode} 국가의 CO2 데이터 요청 시작`);
    
    const { groupByCountry } = await fetchAllCountriesCO2Data();
    
    if (groupByCountry[countryCode] && groupByCountry[countryCode].length > 0) {
      console.log(`${countryCode} 국가의 CO2 데이터 가져오기 성공: ${groupByCountry[countryCode].length}개 데이터 포인트`);
      return groupByCountry[countryCode];
    } else {
      console.warn(`${countryCode} 국가의 CO2 데이터가 없습니다`);
      return [];
    }
  } catch (error) {
    console.error(`${countryCode} 국가의 CO2 데이터 가져오기 실패:`, error);
    return [];
  }
};

// 특정 연도의 모든 국가 CO2 데이터 가져오기
export const fetchCO2DataByYear = async (year: number): Promise<Record<string, number>> => {
  try {
    console.log(`${year}년 CO2 데이터 요청 시작`);
    
    const { groupByYear } = await fetchAllCountriesCO2Data();
    
    if (groupByYear[year]) {
      console.log(`${year}년 CO2 데이터 가져오기 성공: ${Object.keys(groupByYear[year]).length}개 국가`);
      return groupByYear[year];
    } else {
      console.warn(`${year}년 CO2 데이터가 없습니다`);
      return {};
    }
  } catch (error) {
    console.error(`${year}년 CO2 데이터 가져오기 실패:`, error);
    return {};
  }
};

// 가장 최근 연도의 모든 국가 CO2 데이터 가져오기
export const fetchLatestCO2Data = async (): Promise<Record<string, number>> => {
  try {
    const { groupByYear } = await fetchAllCountriesCO2Data();
    
    // 모든 연도 키를 숫자로 변환하고 내림차순 정렬
    const years = Object.keys(groupByYear)
      .map(year => parseInt(year, 10))
      .sort((a, b) => b - a);
    
    if (years.length > 0) {
      const latestYear = years[0];
      console.log(`최신 CO2 데이터 가져오기 성공: ${latestYear}년, ${Object.keys(groupByYear[latestYear]).length}개 국가`);
      return groupByYear[latestYear];
    } else {
      console.warn('CO2 데이터가 없습니다');
      return {};
    }
  } catch (error) {
    console.error('최신 CO2 데이터 가져오기 실패:', error);
    return {};
  }
};

// 연도 범위의 CO2 데이터 가져오기 (타임슬라이더 애니메이션용)
export const fetchCO2DataForYearRange = async (startYear: number, endYear: number): Promise<YearlyCO2Data> => {
  try {
    console.log(`${startYear}년부터 ${endYear}년까지 CO2 데이터 요청 시작`);
    
    const { groupByYear } = await fetchAllCountriesCO2Data();
    
    // 요청된 범위의 연도 데이터만 필터링
    const filteredYears: YearlyCO2Data = {};
    for (let year = startYear; year <= endYear; year++) {
      if (groupByYear[year]) {
        filteredYears[year] = groupByYear[year];
      }
    }
    
    console.log(`${startYear}년부터 ${endYear}년까지 CO2 데이터 가져오기 성공: ${Object.keys(filteredYears).length}개 연도`);
    return filteredYears;
  } catch (error) {
    console.error(`${startYear}년부터 ${endYear}년까지 CO2 데이터 가져오기 실패:`, error);
    return {};
  }
};

// 시간 범위에 따른 CO2 데이터 가져오기 (타임슬라이더 용)
export const fetchCO2DataForTimeRange = async (
  range: 'hour' | 'day' | 'month' | 'year', 
  value: number
): Promise<Record<string, number>> => {
  try {
    const now = new Date();
    let targetDate: Date;
    
    switch (range) {
      case 'hour':
        targetDate = new Date(now.getTime() - value * 60 * 60 * 1000);
        break;
      case 'day':
        targetDate = new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        targetDate = new Date(now.getFullYear(), now.getMonth() - value, 1);
        break;
      case 'year':
        targetDate = new Date(now.getFullYear() - value, 0, 1);
        break;
      default:
        targetDate = now;
    }
    
    const targetYear = targetDate.getFullYear();
    return fetchCO2DataByYear(targetYear);
  } catch (error) {
    console.error(`${range} 범위 CO2 데이터 가져오기 실패:`, error);
    return {};
  }
};

export default {
  fetchAllCountriesCO2Data,
  fetchCountryCO2Data,
  fetchLatestCO2Data,
  fetchCO2DataByYear,
  fetchCO2DataForYearRange,
  fetchCO2DataForTimeRange,
  loadAndCacheCO2Data,
  clearCO2Cache
};