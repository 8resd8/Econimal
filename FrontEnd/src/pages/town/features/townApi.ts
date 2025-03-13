// 마을 전체 api
import { axiosInstance } from '@/api/axiosConfig';

interface TownName {
  name: string;
  message?: string;
}

// 마을 이름 수정
const patchTownName = async () => {
  const response = await axiosInstance.patch<TownName>('/towns');

  if (!response || !response.data) {
    throw new Error(
      response?.data?.message || '마을 이름 수정 중 오류가 발생했습니다.',
    );
  }
};

// 마을 전체 시점에서 바라봤을 때의 이벤트 발생(마을 이벤트 조회)
const getTownEvents = async () => {
  const response = await axiosInstance.get('/towns/events');

  if (!response || !response.data) {
    throw new Error(
      response?.data?.messgae ||
        '마을 전체 이벤트 조회 중 요류가 발생했습니다.',
    );
  }
};

// -> 사용자가 클릭한다.
