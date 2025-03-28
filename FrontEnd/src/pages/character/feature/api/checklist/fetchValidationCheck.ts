import { checklistAPI } from '@/api/axiosConfig';

export const fetchValidationCheck = async (description : string) => {
  try {
    const response = await checklistAPI.postValidationCheckList(description);
    return response.data;
  } catch (error) {
    console.log('체크리스트 검증 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
