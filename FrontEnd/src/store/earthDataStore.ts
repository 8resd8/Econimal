import { create } from 'zustand';
import { TimeRange } from '../pages/earth/components/TimeSlider';

// 기본 인터페이스 정의
interface CountryData {
  temperature?: number;
  humidity?: number;
  co2Level?: number;
  [key: string]: any;
}

// 타임라인별 데이터 저장 구조
interface TimelineData {
  groupByDateTime?: Record<string, Record<string, CountryData>>;
  countriesData?: Record<string, CountryData>;
  timestamp?: string;
}

interface EarthDataState {
  // 캐시된 데이터 저장소
  cachedData: {
    [range: string]: {
      [value: number]: TimelineData;
    };
  };
  
  // 현재 활성 데이터
  currentData: {
    countriesData: Record<string, CountryData>;
    timeRange: TimeRange;
    timeValue: number;
  };
  
  // 기능
  setData: (range: TimeRange, value: number, data: any) => void;
  getData: (range: TimeRange, value: number) => TimelineData | null;
  setCurrentData: (countriesData: Record<string, CountryData>, range: TimeRange, value: number) => void;
  updateMapWithCachedData: (range: TimeRange, value: number) => Record<string, CountryData> | null;
}

export const useEarthDataStore = create<EarthDataState>((set, get) => ({
  cachedData: {},
  
  currentData: {
    countriesData: {},
    timeRange: 'hour',
    timeValue: 0
  },
  
  // earthDataStore.ts - setData 함수 수정
setData: (range: TimeRange, value: number, data: any) => {
    // 데이터 전처리
    let processedData: TimelineData = {};
    
    // 응답이 undefined 또는 null인 경우 처리
    if (!data) {
      console.warn(`[EarthDataStore] 데이터가 없습니다. range: ${range}, value: ${value}`);
      return;
    }
    
    // 데이터 타입 로깅
    console.log(`[EarthDataStore] 데이터 타입: ${typeof data}`);
    
    try {
      // API 응답 구조에 따라 처리
      if (data.groupByDateTime) {
        // 전체 API 응답 저장
        processedData = { 
          groupByDateTime: data.groupByDateTime,
          timestamp: Object.keys(data.groupByDateTime).sort().pop() || ''
        };
        
        // 현재 데이터도 추출해서 저장 (최신 타임스탬프)
        const timestamps = Object.keys(data.groupByDateTime).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
        
        if (timestamps.length > 0) {
          const latestTimestamp = timestamps[0];
          const latestData = data.groupByDateTime[latestTimestamp];
          
          // 현재 데이터 업데이트
          set((state) => ({
            currentData: {
              ...state.currentData,
              countriesData: latestData,
              timeRange: range,
              timeValue: value
            }
          }));
          
          // countriesData 필드 추가
          processedData.countriesData = latestData;
        }
      } else if (data.countriesData) {
        // 이미 국가 데이터만 포함된 형태
        processedData = { countriesData: data.countriesData };
        
        // 현재 데이터 업데이트
        set((state) => ({
          currentData: {
            ...state.currentData,
            countriesData: data.countriesData,
            timeRange: range,
            timeValue: value
          }
        }));
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        // 국가 코드를 키로 가진 객체 형태로 가정
        processedData = { countriesData: data };
        
        // 현재 데이터 업데이트
        set((state) => ({
          currentData: {
            ...state.currentData,
            countriesData: data,
            timeRange: range,
            timeValue: value
          }
        }));
      }
      
      // 캐시 구조가 없으면 초기화
      set((state) => {
        const updated = { ...state.cachedData };
        if (!updated[range]) {
          updated[range] = {};
        }
        updated[range][value] = processedData;
        return { cachedData: updated };
      });
      
      console.log(`[EarthDataStore] 데이터 캐싱 완료: ${range} 타입, ${value} 값`, 
        processedData.countriesData ? `${Object.keys(processedData.countriesData).length}개 국가` : '국가 데이터 없음'
      );
    } catch (error) {
      console.error(`[EarthDataStore] 데이터 처리 중 오류: ${error}`, data);
    }
  },
  
  getData: (range: TimeRange, value: number): TimelineData | null => {
    const state = get();
    if (state.cachedData[range] && state.cachedData[range][value]) {
      console.log(`[EarthDataStore] 캐시 데이터 검색: ${range} 타입, ${value} 값 - 데이터 있음`);
      return state.cachedData[range][value];
    }
    console.log(`[EarthDataStore] 캐시 데이터 검색: ${range} 타입, ${value} 값 - 데이터 없음`);
    return null;
  },
  
  setCurrentData: (countriesData: Record<string, CountryData>, range: TimeRange, value: number) => {
    set({
      currentData: {
        countriesData,
        timeRange: range,
        timeValue: value
      }
    });
    console.log(`[EarthDataStore] 현재 데이터 업데이트: ${range} 타입, ${value} 값, ${Object.keys(countriesData).length}개 국가`);
  },
  
  updateMapWithCachedData: (range: TimeRange, value: number): Record<string, CountryData> | null => {
    const state = get();
    const cachedData = state.getData(range, value);
    
    if (cachedData) {
      // countriesData가 직접 있는 경우
      if (cachedData.countriesData) {
        console.log(`[EarthDataStore] 캐시 데이터로 지도 업데이트: ${range} 타입, ${value} 값`);
        
        // 현재 데이터 업데이트
        state.setCurrentData(cachedData.countriesData, range, value);
        return cachedData.countriesData;
      }
      
      // groupByDateTime이 있는 경우
      if (cachedData.groupByDateTime) {
        const timestamps = Object.keys(cachedData.groupByDateTime).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
        
        if (timestamps.length > 0) {
          const latestTimestamp = timestamps[0];
          const latestData = cachedData.groupByDateTime[latestTimestamp];
          
          console.log(`[EarthDataStore] API 응답에서 데이터 추출: ${range} 타입, ${value} 값`);
          
          // 현재 데이터 업데이트
          state.setCurrentData(latestData, range, value);
          return latestData;
        }
      }
    }
    
    // 캐시된 데이터가 없는 경우 현재 데이터 사용
    if (Object.keys(state.currentData.countriesData).length > 0) {
      console.log(`[EarthDataStore] 현재 데이터로 대체: ${range} 타입, ${value} 값`);
      return state.currentData.countriesData;
    }
    
    // 데이터가 없는 경우
    console.log(`[EarthDataStore] 업데이트할 데이터 없음: ${range} 타입, ${value} 값`);
    return null;
  }
}));