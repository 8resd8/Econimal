import { useQuery } from '@tanstack/react-query';
import { fetchCharInfo } from '../api/fetchCharInfo';
import useCharStore from '@/store/useCharStore';
import { CharInfoResponse } from '../../types/CharInfoRes';

export const useCharInfo = () => {
  const { myChar } = useCharStore();

  // ID를 가져올 때 userCharacterId 또는 id 중 하나를 사용 (0이 아닌 값)
  const effectiveId = myChar.userCharacterId || myChar.id || 0;

  console.log('useCharInfo 훅 - 현재 ID:', effectiveId, 'myChar:', myChar);

  const { data, isLoading, isError, error } = useQuery<
    CharInfoResponse<number>
  >({
    queryKey: ['charInfo', effectiveId],
    queryFn: ({ queryKey }) => {
      const id = queryKey[1] as number;
      console.log('useCharInfo 쿼리 함수 실행 - ID:', id);
      return fetchCharInfo(id);
    },
    staleTime: 1000 * 60 * 5,
    enabled: effectiveId > 0, // ID가 유효한 경우에만 쿼리 실행
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
