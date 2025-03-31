import { shopAPI } from '@/api/axiosConfig';

export const fetchMyCharInShop = async (userCharacterId: number) => {
  try {
    const response = await shopAPI.patchShopMyChar(userCharacterId);
    return response.data;
  } catch (error) {
    console.log('캐릭터 등록 fetch 과정에서 에러');
    throw Error;
  }
};
