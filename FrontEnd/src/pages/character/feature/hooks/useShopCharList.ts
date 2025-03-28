import { useQuery } from '@tanstack/react-query';
import { fetchCharShopList } from '../api/fetchCharShopList';

export const useShopList = () => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['charshop'],
    queryFn: fetchCharShopList,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isError,
    error,
    isLoading,
  };
};
