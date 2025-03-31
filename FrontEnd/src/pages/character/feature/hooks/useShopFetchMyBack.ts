import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userMyCharActions } from '@/store/useMyCharStore';
import { fetchMyCharInShop } from '../api/fetchMyCharInShop';

export const useShopFetchMyBack = () => {
  const { setUserBackgroundId } = userMyCharActions();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (backgroundId: number) => {
      console.log(`서버에 backgroundId 전송: ${backgroundId}`);
      return fetchMyCharInShop(backgroundId); //서버에 나만의 캐릭터 정보 전달
    },
    onSuccess: () => {
      //성공했을 때
      queryClient.invalidateQueries({ queryKey: ['myCharInformation'] });
      queryClient.invalidateQueries({ queryKey: ['backshop'] });
      console.log('서버에 내 배경 전송, 내가 고른 배경 선택 완료');

      //서버 zustand에 영향
    },
    onError: (error) => {
      console.error(
        '배경 등록 실패, 서버에 배경 등록과 관련된 전달이 실패했습니다.:',
        error,
      );
      console.log(error);
      throw Error;
    },
  });

  // 배경 선택 핸들러 => 서버에 보낼 id값을 전달할 내용
  // 같이 zustand에 값 저장..
  const handleFetchShopBack = (backgroundId: number) => {
    mutate(backgroundId);
    setUserBackgroundId(backgroundId);
  };

  return {
    handleFetchShopBack,
    isPending,
  };
};
