import { useQuery } from '@tanstack/react-query';
import { fetchBackShopList } from '../api/fetchBackShopList';

export const useShopBackList = () => {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['backshop'],
    queryFn: fetchBackShopList,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isError,
    isLoading,
    error,
  };
};
