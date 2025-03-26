import { checklistAPI } from '@/api/axiosConfig';

export const fetchChecklist = async () => {
  try {
    const response = await checklistAPI.getCheckList();
    return response.data;
  } catch (error) {
    console.log('체크리스트 목록을 가져오는 과정에서 에러가 발생했습니다.');
    throw Error;
  }
};
