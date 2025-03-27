import { shopAPI } from '@/api/axiosConfig';

export const fetchBackShopList = async () => {
  try {
    const response = await shopAPI.getShopBackList();
    return response.data;
  } catch (error) {
    console.log('배경 상점 리스트 받아오는 과정에서 에러 발생');
    throw Error;
  }
};
