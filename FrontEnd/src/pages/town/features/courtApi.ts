// 법원 api 요청
import { axiosInstance } from '@/api/axiosConfig';

const infraEventId = 1; // 법원에 해당하는 인프라 아이디로 변경해야함

// 법원 이벤트 상세 조회(사용자가 클릭했을 때)
const fetchCourtQuiz = async () => {
  const response = await axiosInstance.get(`/towns/events/${infraEventId}`);

  if (!response || !response.data) {
    throw new Error(response.message || '법원 퀴즈를 가져오지 못했습니다.');
  }
};
