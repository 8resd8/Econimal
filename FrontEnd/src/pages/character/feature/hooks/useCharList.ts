import { useQuery } from '@tanstack/react-query';
import fetchCharList from '../api/fetchCharList';

export const useCharList = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['charList'], //캐릭터리스트 조회
    queryFn: fetchCharList,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
