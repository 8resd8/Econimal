import { checklistAPI } from '@/api/axiosConfig';

export const fetchEditCustomCheck = async (
  id: string,
  description: string,
  expId?: string,
) => {
  try {
    // expId가 있으면 함께 전송
    const payload = expId ? { id, description, expId } : { id, description };

    const response = await checklistAPI.pathEditCheckList(id, payload);
    return response.data;
  } catch (error) {
    console.log('체크리스트 수정 과정에서 에러가 발생했습니다.');
    console.log(error.message);
    console.log(error);
    throw Error;
  }
};
