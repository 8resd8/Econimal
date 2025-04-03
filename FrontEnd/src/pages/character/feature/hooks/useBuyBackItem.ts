import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBackBuyItem } from '../api/fetchBackBuyItem';
import {
  useCharacterActions,
  useCharacterCoin,
} from '@/store/useCharStatusStore';

export const useBuyBackItem = () => {
  const queryClient = useQueryClient();
  const coin = useCharacterCoin(); // 현재 코인 상태 가져오기
  const { setCoin } = useCharacterActions(); // 코인 업데이트 함수 가져오기

  const { mutateAsync } = useMutation({
    mutationFn: (productId: number) => {
      console.log('배경 구매를 시도합니다.');
      return fetchBackBuyItem(productId);
    },
    onSuccess: (data) => {
      console.log('배경 구매에 성공했습니다.', data);

      // 서버에서 최신 코인 정보가 반환된다면 이를 직접 설정
      if (data && data.coin !== undefined) {
        setCoin(data.coin);
      }

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['backshop'] });
      queryClient.invalidateQueries({ queryKey: ['myCharInfo'] });
    },
    onError: (error) => {
      console.log('배경 구매과정에서 에러가 발생했습니다.', error.message);
      throw error; // 오류를 전파하여 상위 컴포넌트에서 처리
    },
  });

  const handleBuyBackShopItem = async (productId: number) => {
    try {
      const response = await mutateAsync(productId);
      return true;
    } catch (error) {
      console.error('구매 처리 중 오류 발생:', error);
      return false;
    }
  };

  return {
    handleBuyBackShopItem,
  };
};
