import { characterListAPI } from '@/api/axiosConfig';
import { CharInfoResponse } from '../../types/CharInfoRes';
// 받아오는 response 자체가

export const fetchCharInfo = async (
  userCharacterId: number,
): Promise<CharInfoResponse<number>> => {
  try {
    console.log(`fetchCharInfo 호출 - ID: ${userCharacterId}`);
    const response = await characterListAPI.getCharInfo(userCharacterId);
    return response.data;
  } catch (error) {
    console.log('캐릭터 상세 정보 조회에서 오류가 발생했습니다.');
    throw Error;
    // return throw Error//unreachable code
  }
};
