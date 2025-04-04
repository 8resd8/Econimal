import { checklistAPI } from '@/api/axiosConfig';

export const fetchAddCustomCheck = async (payload) => {
  try {
    console.log('체크리스트 추가 요청 데이터:', payload);
    const response = await checklistAPI.postAddCheckList(payload);
    return response.data;
  } catch (error) {
    console.log('커스텀 체크리스트 등록 과정에서 에러가 발생했습니다.');
    console.log(error.message);
    console.log(error);
    throw Error;
  }
};