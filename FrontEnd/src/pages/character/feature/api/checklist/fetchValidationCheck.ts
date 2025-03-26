import { checklistAPI } from '@/api/axiosConfig';

export const fetchValidationCheck = async () => {
  try {
    const response = await checklistAPI.postValidationCheckList();
    return response.data;
  } catch (error) {
    console.log('체크리스트 검증 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
