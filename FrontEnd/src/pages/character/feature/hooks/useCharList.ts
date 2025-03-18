import { useQuery } from '@tanstack/react-query';
import fetchCharList from '../api/fetchCharList';
import { CharacterListResponse } from '../../types/CharacterListRes';

export const useCharList = () => {
  const { data, isLoading, error, isError } = useQuery<
    CharacterListResponse<number>
  >({
    queryKey: ['charList'], //캐릭터리스트 조회
    queryFn: fetchCharList,
    staleTime: 1000 * 60 * 5,
  });

  if (data) {
    console.log(data); //data는 잘 들어옴
    //charList 데이터 검증 로직직
  }

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
