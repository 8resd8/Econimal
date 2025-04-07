// src/features/feedbackApi.ts
import axios from 'axios';

// 환경 변수에서 API 도메인 가져오기
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || '';

// 기여도 데이터 타입 정의
export interface DataItem {
  correct: number;
  total: number;
}

export interface FeedbackData {
  logs: {
    GAS: DataItem;
    WATER: DataItem;
    ELECTRICITY: DataItem;
    COURT?: DataItem;  // 선택적 필드
  };
  aiResponse: {
    feedback: string;
    carbon: number;
    temperature: number;
  };
}

// 세션 스토리지에서 토큰 가져오기
const getAuthToken = (): string | null => {
  // 세션 스토리지에서 토큰 가져오기 (실제 토큰 키 이름으로 변경 필요)
  return sessionStorage.getItem('accessToken') || 
         sessionStorage.getItem('token') || 
         sessionStorage.getItem('jwt');
};

// 기여도 정보를 가져오는 함수
export const fetchFeedbackData = async (): Promise<FeedbackData> => {
  try {
    // 로그인한 사용자인지 확인 (토큰 존재 여부)
    const token = getAuthToken();
    
    if (!token) {
      console.log('인증 토큰이 없습니다. 세션 스토리지에서 토큰을 찾을 수 없습니다.');
      
      if (import.meta.env.DEV) {
        console.log('데이터가 없습니다다');
      }
    }
    
    // 전체 API URL 구성 (환경 변수 사용)
    const apiUrl = `${API_DOMAIN}/globe/feedback`;
    console.log('API 요청 URL:', apiUrl);
    console.log('토큰 존재 여부:', token ? '있음' : '없음');

    // API 요청 시 인증 토큰 포함
    const response = await axios.get(apiUrl, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // 토큰이 있을 때만 Authorization 헤더 추가
      },
      withCredentials: true, // 쿠키 기반 인증을 위해 추가
    });
    
    console.log('API 응답 상태:', response.status);
    
    // 응답 데이터 검증
    if (response.data && response.data.logs && response.data.aiResponse) {
      // logs에 필요한 필드가 있는지 확인
      const logs = response.data.logs;
      if (!logs.GAS || !logs.WATER || !logs.ELECTRICITY) {
        console.warn('API 응답의 logs 객체에 필수 필드가 누락되었습니다:', logs);
        // return dummyFeedbackData;
        return createEmptyFeedbackData(); // 빈 데이터 반환
      }
      
      // aiResponse에 필요한 필드가 있는지 확인
      const aiResponse = response.data.aiResponse;
      if (!aiResponse.feedback || 
          typeof aiResponse.carbon !== 'number' || 
          typeof aiResponse.temperature !== 'number') {
        console.warn('API 응답의 aiResponse 객체에 필수 필드가 누락되었습니다:', aiResponse);
        // return dummyFeedbackData;
        return createEmptyFeedbackData(); // 빈 데이터 반환
      }
      
      return response.data;
    } else {
      console.warn('API 응답이 예상 형식과 다릅니다:', response.data);
      // return dummyFeedbackData;
      return createEmptyFeedbackData(); // 빈 데이터 반환
    }
  } catch (error) {
    console.error('기여도 정보를 가져오는 중 오류 발생:', error);
    
    // 401 오류인 경우 로그인이 필요함을 표시할 수 있음
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log('인증이 필요합니다.');
    }
    
    // 개발 환경일 경우
    if (import.meta.env.DEV) {
      console.log('데이터가 없습니다');
    }
    
    // throw error; 대신 빈 데이터 반환
    return createEmptyFeedbackData();
  }
};

// 빈 피드백 데이터 생성 함수
function createEmptyFeedbackData(): FeedbackData {
  return {
    logs: {
      GAS: { correct: 0, total: 0 },
      WATER: { correct: 0, total: 0 },
      ELECTRICITY: { correct: 0, total: 0 }
    },
    aiResponse: {
      feedback: "",
      carbon: 0,
      temperature: 0
    }
  };
}