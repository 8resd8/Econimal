import { characterListAPI } from '@/api/axiosConfig';

export const fetchMyChar = async (userCharacterId) => {
  try {
    const response = await characterListAPI.patchmyChar(userCharacterId);
    return response.data;
  } catch (error) {
    console.log('캐릭터 등록 fetch 과정에서 에러');
  }
};
