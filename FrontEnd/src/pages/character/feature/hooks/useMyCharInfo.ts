import { useQuery } from '@tanstack/react-query';
import { MyCharInfoResponse } from '../../types/MyCharInfoRes';
import { fetchMyCharInfo } from '../api/fetchMyCharInfo';
// data자체가
export const useMyCharInfo = () => {
  const { data, isError, isLoading, error } = useQuery<MyCharInfoResponse>({
    queryKey: ['myCharInfo'],
    queryFn: fetchMyCharInfo,
  });

  return {
    data,
    isError,
    isLoading,
    error,
  };
};
