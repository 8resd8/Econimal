import { shopAPI } from '@/api/axiosConfig';

export const fetchBackBuyItem = async (productId: number) => {
  try {
    const response = await shopAPI.postShopBackItem(productId);
    return response.data;
  } catch (error) {
    console.log('배경 리스트를 가져오는 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
