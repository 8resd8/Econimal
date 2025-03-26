import { checklistAPI } from '@/api/axiosConfig';

export const fetchAddCustomCheck = async () => {
  try {
    const response = await checklistAPI.postAddCheckList();
    return response.data;
  } catch (error) {
    console.log('커스텀 체크리스트 등록 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
