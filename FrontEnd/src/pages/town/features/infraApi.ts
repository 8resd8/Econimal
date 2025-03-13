// 인프라 api 요청
import { axiosInstance } from '@/api/axiosConfig';

interface InfraResponse {
  // 아직 어떻게 응답오는지 모름
  // 인프라 별로 다르게 오면 분리해야될듯
  message?: string;
}

const infraEventId = 1; // 각 인프라라에 해당하는 인프라 아이디로 변경해야함

// 인프라 이벤트 상세 조회(사용자가 클릭했을 때 모달 open)
export const getInfraEvent = async () => {
  const response = await axiosInstance.get<InfraResponse>(
    `/towns/events/${infraEventId}`,
  );

  if (!response || !response.data) {
    throw new Error(response?.data?.message || '정보를 가져오지 못했습니다.');
  }
};

// 인프라 이벤트 선택지 제출
export const submitInfraResult = async () => {
  const response = await axiosInstance.post(`/towns/events/${infraEventId}`);

  if (!response || !response.data) {
    throw new Error(
      response?.data?.message || '결과 수신 중 오류가 발생했습니다.',
    );
  }
};
