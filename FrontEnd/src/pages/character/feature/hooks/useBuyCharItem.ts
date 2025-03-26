import { useMutation } from '@tanstack/react-query';
import { fetchCharBuyItem } from '../api/fetchCharBuyItem';
import { error } from 'console';

export const useBuyItem = () => {
  const { mutate } = useMutation({
    mutationFn: (productId: number) => {
      console.log('서버에 구매할 아이템을 요청합니다', productId);
      return fetchCharBuyItem(productId);
    },
    onSuccess: () => {
      console.log('아이템을 성공적으로 구매했습니다.');
    },
    onError: (error) => {
      console.log('구매 과정에서 에러가 발생했습니다.');
      console.log(error.message);
    },
  });

  const handleBuyShopItem = (productId: number) => {
    mutate(productId);
  };

  return {
    handleBuyShopItem,
  };
};
