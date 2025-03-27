import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCharBuyItem } from '../api/fetchCharBuyItem';
import { error } from 'console';

export const useBuyItem = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (productId: number) => {
      console.log('서버에 구매할 아이템을 요청합니다', productId);
      return fetchCharBuyItem(productId);
    },
    onSuccess: () => {
      console.log('아이템을 성공적으로 구매했습니다.');
      queryClient.invalidateQueries({ queryKey: ['charshop'] });
      queryClient.invalidateQueries({ queryKey: ['myCharInfo'] });
    },
    onError: (error) => {
      console.log('구매 과정에서 에러가 발생했습니다.');
      console.log(error.message);
      throw Error;
    },
  });

  const handleBuyShopItem = async (productId: number) => {
    try {
      mutateAsync(productId);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    handleBuyShopItem,
  };
};
