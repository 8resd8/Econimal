// 인프라 api 요청
import { axiosInstance } from '@/api/axiosConfig';

// 퀴즈/선택지 항목
interface EcoAnswer {
  ecoQuizId: number;
  description: string;
}

// 퀴즈/선택지 2 ~ 4지선다
export interface InfraEventResponse {
  ecoQuiz: {
    quizDescription: string;
  };
  ecoAnswer: EcoAnswer[];
  message?: string;
}

// 인프라 이벤트 선택지 제출 응답 확인
export interface InfraSubmitResponse {
  carbon: number; // 탄소 변화량 (+) 증가 (-) 감소
  exp: number; // 경험치
  coin: number; // 경험치하고 동일값, 재화
  expression: 'JOY' | 'SADNESS' | 'NEUTRAL'; // 캐릭터 표정
  isOptimal: boolean; // 최적 답안 여부
  answerId: number; // 정답 선지 ID
  message?: string;
}

// 인프라 이벤트 상세 조회(사용자가 클릭했을 때 모달 open)
export const getInfraEvent = async (infraEventId: number) => {
  const response = await axiosInstance.get<InfraEventResponse>(
    `/towns/events/${infraEventId}`,
  );

  if (!response || !response.data) {
    throw new Error(response?.data?.message || '정보를 가져오지 못했습니다.');
  }
  return response.data;
};

// 인프라 이벤트 선택지 제출
export const submitInfraResult = async (ecoAnswerId: number) => {
  const response = await axiosInstance.post<InfraSubmitResponse>(
    `/towns/events`, // 요청 URL
    null, // body
    { params: { ecoAnswerId } }, // 쿼리파라미터
  );

  if (!response || !response.data) {
    throw new Error(
      response?.data?.message || '결과 수신 중 오류가 발생했습니다.',
    );
  }
  return response.data;
};
