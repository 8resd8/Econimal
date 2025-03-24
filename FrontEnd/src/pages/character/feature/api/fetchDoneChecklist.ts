import { checklistAPI } from '@/api/axiosConfig';

export const fetchDoneChecklist = async (checklistId: string, type: string) => {
  try {
    const response = await checklistAPI.postCheckList(checklistId, type);
    return response.data;
  } catch (error) {
    console.log('체크리스트를 완료하는 과정에서 에러가 발생했습니다.');
    throw error;
  }
};
