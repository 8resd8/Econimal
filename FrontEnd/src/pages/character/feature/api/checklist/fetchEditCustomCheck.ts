import { checklistAPI } from '@/api/axiosConfig';

export const fetchEditCustomCheck = async (
  id: string,
  description: string,
  expId?: string,
) => {
  try {
    console.log('체크리스트 수정 요청 시작:', { id, description, expId });

    // 요청 payload 구성 - id는 URL에 포함되므로 제외
    const payload = expId ? { description, expId } : { description };

    console.log('최종 요청 payload:', payload);

    const response = await checklistAPI.pathEditCheckList(id, payload);

    console.log('체크리스트 수정 응답:', response.data);
    return response.data;
  } catch (error) {
    console.log('체크리스트 수정 과정에서 에러가 발생했습니다.');
    console.log(error.message);
    console.log(error);
    throw Error;
  }
};
