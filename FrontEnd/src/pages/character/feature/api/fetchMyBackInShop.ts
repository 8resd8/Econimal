import { shopAPI } from '@/api/axiosConfig';

export const fetchMyBackInShop = async (userCharacterId: number) => {
  try {
    const response = await shopAPI.postShopBackItem(userCharacterId);
    return response.data;
  } catch (error) {
    console.log('상점 배경 등록 fetch 과정에서 에러');
    throw Error;
  }
};
