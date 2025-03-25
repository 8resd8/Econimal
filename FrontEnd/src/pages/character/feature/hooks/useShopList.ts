import { useQuery } from '@tanstack/react-query';
import { fetchShopList } from '../api/fetchShopList';

export const useShopList = () => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['shop'],
    queryFn: fetchShopList,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isError,
    error,
    isLoading,
  };
};
