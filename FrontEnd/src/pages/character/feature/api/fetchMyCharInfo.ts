import { characterListAPI } from '@/api/axiosConfig';
import { MyCharInfoResponse } from '../../types/MyCharInfoRes';

// 반환 타입에 대한 설정
export const fetchMyCharInfo = async (): Promise<MyCharInfoResponse> => {
  try {
    const response = await characterListAPI.getMyCharInfo();
    return response.data;
  } catch (error) {
    console.log('내 캐릭터 정보 : 경험치/코인/레벨 등 가져오는 과정 에러');
    throw Error;
  }
};
