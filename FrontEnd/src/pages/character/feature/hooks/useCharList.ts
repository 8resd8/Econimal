import { useQuery } from '@tanstack/react-query';
import fetchCharList from '../api/fetchCharList';
import { CharacterListResponse } from '../../types/CharacterListRes';

export const useCharList = () => {
  const { data, isLoading, error, isError } = useQuery<
    CharacterListResponse<number>
  >({
    queryKey: ['charList'],
    queryFn: fetchCharList, //캐릭터 전체 리스트 조회, 캐릭터 선택을 위함
    staleTime: 1000 * 60 * 5,
    retry: 3, // 재시도 요청 3번
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
