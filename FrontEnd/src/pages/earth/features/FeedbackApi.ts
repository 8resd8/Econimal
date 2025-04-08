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
  return sessionStorage.getItem('accessToken') || 
         sessionStorage.getItem('token') || 
         sessionStorage.getItem('jwt');
};

// 기여도 정보를 가져오는 함수
export const fetchFeedbackData = async (): Promise<FeedbackData> => {
  // 타임아웃 증가 및 재시도 로직 추가
  const maxRetries = 2;
  const timeout = 10000; // 10초로 증가
  let currentRetry = 0;
  
  // 재시도 함수
  const attemptFetch = async (): Promise<FeedbackData> => {
    try {
      // 토큰 가져오기
      const token = getAuthToken();
      
      if (!token) {
        console.log('인증 토큰이 없습니다.');
      }
      
      // API URL
      const apiUrl = `${API_DOMAIN}/globe/feedback`;
      
      // API 요청 
      const response = await axios.get(apiUrl, {
        timeout,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        withCredentials: true,
      });
      
      // 응답 데이터 검증
      if (response.data && response.data.logs && response.data.aiResponse) {
        return response.data;
      } else {
        console.warn('API 응답 형식이 예상과 다릅니다:', response.data);
        return getDummyData();
      }
    } catch (error) {
      currentRetry++;
      
      if (currentRetry <= maxRetries) {
        console.log(`API 요청 실패, 재시도 중... (${currentRetry}/${maxRetries})`);
        // 재시도 전 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 1500));
        return attemptFetch();
      }
      
      console.error('최대 재시도 횟수 초과:', error);
      return getDummyData();
    }
  };
  
  return attemptFetch();
};

// 더미 데이터 생성 함수
function getDummyData(): FeedbackData {
  // 개발 환경인 경우 실제 데이터 형태와 유사한 더미 데이터 반환
  if (import.meta.env.DEV) {
    return {
      logs: {
        GAS: { correct: 7, total: 10 },
        WATER: { correct: 5, total: 10 },
        ELECTRICITY: { correct: 9, total: 10 }
      },
      aiResponse: {
        feedback: "환경 보호에 힘써주셔서 감사합니다. 당신의 활동은 지구 환경에 긍정적인 영향을 미치고 있습니다.",
        carbon: -2.5,
        temperature: -0.00015
      }
    };
  }
  
  // 프로덕션 환경에서는 기본값 반환
  return {
    logs: {
      GAS: { correct: 0, total: 0 },
      WATER: { correct: 0, total: 0 },
      ELECTRICITY: { correct: 0, total: 0 }
    },
    aiResponse: {
      feedback: "환경 퀴즈에 참여하고 지구를 지켜주세요!",
      carbon: 0,
      temperature: 0
    }
  };
}