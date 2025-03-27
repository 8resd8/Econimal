import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBackBuyItem } from '../api/fetchBackBuyItem';

export const useBuyBackItem = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (productId: number) => {
      console.log('배경 구매를 시도합니다.');
      return fetchBackBuyItem(productId);
    },
    onSuccess: () => {
      console.log('배경 구매에 성공했습니다.');
      queryClient.invalidateQueries({ queryKey: ['backshop'] });
      queryClient.invalidateQueries({ queryKey: ['myCharInfo'] });
    },
    onError: (error) => {
      console.log('배경 구매과정에서 에러가 발생했습니다.', error.message);
      throw Error;
    },
  });

  const handleBuyBackShopItem = async (productId: number) => {
    try {
      await mutateAsync(productId);
      return true;
    } catch (error) {
      false;
    }
  };

  return {
    handleBuyBackShopItem,
  };
};
