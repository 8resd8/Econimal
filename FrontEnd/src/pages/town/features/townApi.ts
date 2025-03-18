// 마을 전체 api
import { axiosInstance, ApiResponse } from '@/api/axiosConfig';

export interface TownNameData {
  townId: number;
  townName: string;
}

interface TownNameResponse {
  message?: string;
}

// 각 장소에 대한 이벤트
export interface TownEvent {
  infraId: number;
  ecoType: 'ELECTRICITY' | 'WATER' | 'GAS' | 'COURT';
  isClean: string;
  infraEventId: number;
  isActive: boolean; // 이벤트 발생 여부
}

// 마을 전체 데이터
export interface TownEventsResponse {
  events: TownEvent[];
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

// 마을 전체 이벤트 발생(마을 화면 진입 시 호출)
export const getTownEvents = async (townId: string) => {
  const response = await axiosInstance.get<TownEventsResponse>(
    '/towns/events',
    { params: { townId } },
  );

  if (!response || !response.data) {
    throw new Error(
      response?.data?.message ||
        '마을 전체 이벤트 조회 중 요류가 발생했습니다.',
    );
  }
  return response.data; // 꼭 있어야?
};
