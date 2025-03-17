import { characterListAPI } from '@/api/axiosConfig';
import { CharacterListResponse } from '../../types/CharacterListRes';
//근데 이부분들은 zustand를 사용하지 않아도 되지 않을까?
//그냥 있는 데이터만 뿌릴 것 => 가공X

// const fetchCarList = async () => {
//   // 주소값 => 요청할 파라미터는 없긴 함
//   try {
//     const response = await axios.get('https://econimal.com/characters');
//     return response.data
//   } catch (error) {
//     console.log('캐릭터 리스트 fetching 오류')
//   }
// }

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
