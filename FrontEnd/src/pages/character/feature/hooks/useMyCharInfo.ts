import { useQuery } from '@tanstack/react-query';
import { MyCharInfoResponse } from '../../types/MyCharInfoRes';
import { fetchMyCharInfo } from '../api/fetchMyCharInfo';
// data자체가
export const useMyCharInfo = () => {
  const { data, isError, isLoading, error } = useQuery<MyCharInfoResponse>({
    queryKey: ['myCharInfo'],
    queryFn: fetchMyCharInfo,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data: data?.useCharacterMain, //이제 내부 속성값만 사용하는 것
    isError,
    isLoading,
    error,
  };
};
