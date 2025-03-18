// 마을 전체 api
import { axiosInstance } from '@/api/axiosConfig';

export interface TownNameData {
  townId: number; // 명세에서 사라짐!?
  townName: string;
}

interface TownNameResponse {
  message?: string;
}

// 각 장소에 대한 이벤트
export interface TownEvent {
  infraId: number;
  ecoType: 'ELECTRICITY' | 'WATER' | 'GAS' | 'COURT';
  isClean: boolean;
  infraEventId: number;
  isActive: boolean; // 이벤트 발생 여부
}

// 마을 전체 데이터
export interface TownEventsResponse {
  townStatus: TownEvent[];
  message?: string;
}

// 마을 이름 수정
export const patchTownName = async (townData: TownNameData) => {
  // TownData : townId,townName 담긴 객체
  const response = await axiosInstance.patch<TownNameResponse>(
    '/towns',
    townData,
  );

  if (!response || !response.data) {
    throw new Error(
      response?.data?.message || '마을 이름 수정 중 오류가 발생했습니다.',
    );
  }
  return response.data;
};

// 마을 상황 조회
export const getTownEvents = async (townId: number) => {
  const response = await axiosInstance.get<TownEventsResponse>(
    '/towns/events',
    { params: { townId } },
  );

  if (!response || !response.data) {
    throw new Error(
      response?.data?.message ||
        '마을 상황 조회 중 요류가 발생했습니다.',
    );
  }
  return response.data; // 꼭 있어야 함?
};
