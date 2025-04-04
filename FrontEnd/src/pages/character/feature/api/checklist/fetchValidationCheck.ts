import { checklistAPI } from '@/api/axiosConfig';

export const fetchValidationCheck = async (description: string) => {
  try {
    const response = await checklistAPI.postValidationCheckList(description);

    // 응답 데이터 전체 구조 확인
    console.log('API 응답 전체:', response);

    let data = response.data;
    console.log('응답 데이터 타입:', typeof data);

    // 데이터가 문자열인 경우 JSON 파싱
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
        console.log('문자열에서 파싱된 데이터:', data);
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
      }
    }

    // uuid 필드 확인
    if (data.uuid) {
      console.log('uuid 발견:', data.uuid);

      // 필요하다면 expId로 필드명 변경
      data.expId = data.uuid;
    }

    return data;
  } catch (error) {
    console.log('체크리스트 검증 과정에서 에러가 발생했습니다.');
    console.error(error);
    throw error;
  }
};
