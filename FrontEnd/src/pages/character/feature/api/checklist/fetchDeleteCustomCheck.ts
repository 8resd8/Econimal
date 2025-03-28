import { checklistAPI } from '@/api/axiosConfig';

export const fetchDeleteCustomCheck = async (checklistId: number) => {
  try {
    const response = await checklistAPI.deleteCheckList(checklistId);
    return response.data;
  } catch (error) {
    console.log('커스텀 리스트 삭제 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
