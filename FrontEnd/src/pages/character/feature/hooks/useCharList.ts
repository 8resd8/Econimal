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

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
