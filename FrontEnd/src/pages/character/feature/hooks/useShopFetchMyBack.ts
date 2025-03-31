import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userMyCharActions } from '@/store/useMyCharStore';
import { backgroundShopConfig } from '@/config/backgroundShopConfig';

export const useShopFetchMyBack = () => {
  const { setUserBackgroundId, setBackImg } = userMyCharActions();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (backgroundId: number) => {
      console.log(`서버에 backgroundId 전송: ${backgroundId}`);

      // 서버 API 호출 없이 성공으로 처리
      return { success: true };
    },
    onSuccess: (_, backgroundId) => {
      // 성공 시 캐싱 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['myCharInformation'] });
      queryClient.invalidateQueries({ queryKey: ['backshop'] });
      console.log('배경 선택 완료:', backgroundId);
    },
    onError: (error) => {
      console.error('배경 선택 실패:', error);
      console.log(error);
    },
  });

  // 배경 선택 핸들러
  const handleFetchShopBack = (backgroundId: number) => {
    // 배경 ID 저장
    setUserBackgroundId(backgroundId);

    // 배경 이미지 직접 저장
    const selectedBackground = backgroundShopConfig.find(
      (bg) => bg.productId === backgroundId,
    );

    if (selectedBackground) {
      console.log('선택된 배경:', selectedBackground.characterName);
      console.log('이미지 경로:', selectedBackground.image);
      setBackImg(selectedBackground.image);
    }

    // 뮤테이션 실행 (서버에 보내는 척)
    mutate(backgroundId);
  };

  return {
    handleFetchShopBack,
    isPending,
  };
};
