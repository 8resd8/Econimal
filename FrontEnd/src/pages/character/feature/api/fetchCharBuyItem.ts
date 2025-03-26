import { shopAPI } from '@/api/axiosConfig';

export const fetchCharBuyItem = async (productId: number) => {
  try {
    const response = await shopAPI.postShopCharItem(productId);
    return response.data;
  } catch (error) {
    console.log('상품을 구매하는 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
