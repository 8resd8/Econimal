import { characterListAPI } from '@/api/axiosConfig';
import { MainCharResponse } from '../../types/MainCharRes';

export const fetchMyChar = async (
  userCharacterId: number,
): Promise<MainCharResponse<number>> => {
  try {
    const response = await characterListAPI.patchMyChar(userCharacterId);
    return response.data;
  } catch (error) {
    console.log('캐릭터 등록 fetch 과정에서 에러');
    throw Error;
  }
};
