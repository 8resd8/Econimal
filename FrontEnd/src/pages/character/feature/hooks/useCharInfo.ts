import { useQuery } from '@tanstack/react-query';
import { fetchCharInfo } from '../api/fetchCharInfo';
import useCharStore from '@/store/useCharStore';
import { CharInfoResponse } from '../../types/CharInfoRes';

export const useCharInfo = () => {
  const { myChar } = useCharStore();
  const { data, isLoading, isError, error } = useQuery<
    CharInfoResponse<number>
  >({
    queryKey: ['charInfo', myChar.id], //키 값으로 전달해서 -> function..?
    queryFn: ({ queryKey }) => {
      const userCharacterId = queryKey[1] as number; //unkown 추론 대비 type 명시
      return fetchCharInfo(userCharacterId);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!myChar.id, //!!를 통해서 명확한 불리언 값을 전달한다.
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
