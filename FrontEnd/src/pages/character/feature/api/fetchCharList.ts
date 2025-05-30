import { characterListAPI } from '@/api/axiosConfig';
import { CharacterListResponse } from '../../types/CharacterListRes';

const fetchCharList = async (): Promise<CharacterListResponse<number>> => {
  //반환값 명시 모두 설정
  try {
    const response = await characterListAPI.getCharList();
    return response.data; //비동기로 fetching받는 데이터 반환 값에 대한 Type설정
  } catch (error) {
    console.log('캐릭터 리스트 패칭 오류');
    throw error; // 예외를 던지는 것
  }
};

export default fetchCharList;
