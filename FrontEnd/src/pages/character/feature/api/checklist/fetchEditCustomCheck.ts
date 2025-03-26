import { checklistAPI } from '@/api/axiosConfig';

export const fetchEditCustomCheck = async (checklistId: number) => {
  try {
    const response = await checklistAPI.pathEditCheckList(checklistId);
    return response.data;
  } catch (error) {
    console.log('커스텀 체크리스트 수정 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
