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

// CO2 데이터 인터페이스
export interface CO2Data {
  year: number;
  value: number;
}

// 국가별 CO2 데이터 인터페이스
export interface CountryCO2Data {
  [countryCode: string]: CO2Data[];
}

// 모든 국가의 연도별 CO2 데이터 가져오기
export const fetchAllCountriesCO2Data = async (): Promise<CountryCO2Data> => {
  try {
    console.log('모든 국가의 CO2 데이터 요청 시작');
    
    const response = await apiClient.get('/globe/v2/all/carbon');
    console.log('CO2 데이터 응답 성공:', response.status);
    
    const result: CountryCO2Data = {};
    
    // groupByCountry 구조 처리
    if (response.data && response.data.groupByCountry) {
      Object.entries(response.data.groupByCountry).forEach(([countryCode, dateData]: [string, any]) => {
        result[countryCode] = [];
        
        // 각 날짜별 CO2 데이터 처리
        Object.entries(dateData).forEach(([dateString, data]: [string, any]) => {
          // 날짜에서 연도 추출
          const year = new Date(dateString).getFullYear();
          
          // CO2 값 추출
          if (data.co2 !== undefined) {
            const co2Value = parseFloat(data.co2);
            
            if (!isNaN(co2Value)) {
              // 이미 있는 연도인지 확인
              const existingIndex = result[countryCode].findIndex(item => item.year === year);
              
              if (existingIndex === -1) {
                // 새 연도 추가
                result[countryCode].push({
                  year,
                  value: co2Value
                });
              }
            }
          }
        });
        
        // 연도별로 정렬
        result[countryCode].sort((a, b) => a.year - b.year);
      });
    }
    
    console.log(`변환된 CO2 데이터: ${Object.keys(result).length}개 국가`);
    
    // 일부 샘플 로깅
    if (Object.keys(result).length > 0) {
      const sampleCountry = Object.keys(result)[0];
      console.log(`샘플 국가 (${sampleCountry}) 데이터:`, result[sampleCountry]);
    }
    
    return result;
  } catch (error) {
    console.error('CO2 데이터 가져오기 실패:', error);
    return {};
  }
};

// 특정 국가의 CO2 데이터 가져오기
export const fetchCountryCO2Data = async (countryCode: string): Promise<CO2Data[]> => {
  try {
    console.log(`${countryCode} 국가의 CO2 데이터 요청 시작`);
    
    const allData = await fetchAllCountriesCO2Data();
    
    if (allData[countryCode] && allData[countryCode].length > 0) {
      console.log(`${countryCode} 국가의 CO2 데이터 가져오기 성공: ${allData[countryCode].length}개 데이터 포인트`);
      return allData[countryCode];
    } else {
      console.warn(`${countryCode} 국가의 CO2 데이터가 없습니다`);
      return [];
    }
  } catch (error) {
    console.error(`${countryCode} 국가의 CO2 데이터 가져오기 실패:`, error);
    return [];
  }
};

// 가장 최근 연도의 모든 국가 CO2 데이터 가져오기
export const fetchLatestCO2Data = async (): Promise<Record<string, number>> => {
  try {
    const allData = await fetchAllCountriesCO2Data();
    const latestData: Record<string, number> = {};
    
    // 각 국가별로 가장 최근 연도의 데이터 추출
    Object.entries(allData).forEach(([countryCode, dataPoints]) => {
      if (dataPoints.length > 0) {
        // 연도별로 정렬
        const sortedData = [...dataPoints].sort((a, b) => b.year - a.year);
        // 가장 최신 데이터 사용
        latestData[countryCode] = sortedData[0].value;
      }
    });
    
    console.log(`최신 CO2 데이터 가져오기 성공: ${Object.keys(latestData).length}개 국가`);
    return latestData;
  } catch (error) {
    console.error('최신 CO2 데이터 가져오기 실패:', error);
    return {};
  }
};

export default {
  fetchAllCountriesCO2Data,
  fetchCountryCO2Data,
  fetchLatestCO2Data
};