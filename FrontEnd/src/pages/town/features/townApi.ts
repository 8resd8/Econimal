// 마을 전체 api
import { axiosInstance, ApiResponse } from '@/api/axiosConfig';

interface TownNameData {
  townId: string;
  townName: string;
}

interface TownNameResponse {
  // name: string;
  message?: string;
}

// 각 장소에 대한 이벤트
interface TownEvent {
  id: string;
  title: string;
}

// 마을 전체 데이터
interface TownEventsData {
  events: TownEvent[]; // 배열일까 문자일까 숫자일까
  message?: string;
}

// 마을 이름 수정
const patchTownName = async (name: TownNameData) => {
  const response = await axiosInstance.patch<TownNameResponse>('/towns');

  if (!response || !response.data) {
    throw new Error(
      response?.data?.message || '마을 이름 수정 중 오류가 발생했습니다.',
    );
  }
};

// 마을 전체 시점에서 바라봤을 때의 이벤트 발생(마을 이벤트 조회)
const getTownEvents = async () => {
  const response = await axiosInstance.get<TownEventsData>('/towns/events');

  if (!response || !response.data) {
    throw new Error(
      response?.data?.message ||
        '마을 전체 이벤트 조회 중 요류가 발생했습니다.',
    );
  }
};
