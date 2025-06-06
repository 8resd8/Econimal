import { characterListAPI } from '@/api/axiosConfig';

export const fetchMyChar = async (userCharacterId: number) => {
  try {
    //최초등록
    const response = await characterListAPI.patchMyChar(userCharacterId);
    return response.data;
  } catch (error) {
    console.log('캐릭터 등록 fetch 과정에서 에러');
    throw Error;
  }
};
