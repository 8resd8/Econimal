import { shopAPI } from '@/api/axiosConfig';

export const fetchShopList = async () => {
  try {
    const response = await shopAPI.getShopList();
    return response.data;
  } catch (error) {
    console.log('상점 리스트를 가져오는 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
