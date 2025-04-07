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

// API 오류 케이스를 대비한 기본 더미 데이터
const dummyFeedbackData: FeedbackData = {
  logs: {
    GAS: {
      correct: 5,
      total: 6
    },
    WATER: {
      correct: 5,
      total: 5
    },
    ELECTRICITY: {
      correct: 4,
      total: 4
    },
    COURT: {
      correct: 2,
      total: 4
    }
  },
  aiResponse: {
    feedback: "너의 환경 관련 퀴즈 정답률을 보면 전기와 수도는 완벽해! 전기 4/4, 수도 5/5로 정말 잘했어. 가스는 5문제 중 6문제로 조금 아쉬운 점이 있는데, 약간의 개선이 필요할 것 같아. 법원 부분은 정답률이 낮은 2/4로, 여기에 대한 이해도가 더 필요해 보여. 환경 문제는 우리가 살고 있는 지구와 직접 연결되어 있으니까, 법원과 같은 법적 이슈도 중요하단 걸 잊지 말자. 마지막으로 너가 제출한 탄소변화량이 -1402라는 건, 100만 명 기준으로 보면 탄소가 많이 줄어든 거야. 이건 정말 긍정적인 변화야! 하지만 여전히 온도 상승 문제는 심각하니까, 더 많은 사람들이 환경을 생각하고 행동해야 해. 앞으로도 지속적으로 공부하고 실천해보자!",
    carbon: -1402.0,
    temperature: -0.2
  }
};

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
        console.log('개발 환경에서 더미 데이터를 사용합니다.');
        return dummyFeedbackData;
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
        return dummyFeedbackData;
      }
      
      // aiResponse에 필요한 필드가 있는지 확인
      const aiResponse = response.data.aiResponse;
      if (!aiResponse.feedback || 
          typeof aiResponse.carbon !== 'number' || 
          typeof aiResponse.temperature !== 'number') {
        console.warn('API 응답의 aiResponse 객체에 필수 필드가 누락되었습니다:', aiResponse);
        return dummyFeedbackData;
      }
      
      return response.data;
    } else {
      console.warn('API 응답이 예상 형식과 다릅니다:', response.data);
      return dummyFeedbackData;
    }
  } catch (error) {
    console.error('기여도 정보를 가져오는 중 오류 발생:', error);
    
    // 401 오류인 경우 로그인이 필요함을 표시할 수 있음
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log('인증이 필요합니다. 로그인 후 다시 시도하세요.');
      // 필요하다면 여기서 로그인 페이지로 리다이렉트하는 로직 추가
      // window.location.href = '/login';
    }
    
    // 개발 환경일 경우 더미 데이터 사용
    if (import.meta.env.DEV) {
      console.log('개발 환경에서 더미 데이터를 사용합니다.');
      return dummyFeedbackData;
    }
    
    throw error;
  }
};