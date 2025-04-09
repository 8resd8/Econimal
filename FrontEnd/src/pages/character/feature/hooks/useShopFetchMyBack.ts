import { useMutation } from '@tanstack/react-query';
import { userMyCharActions } from '@/store/useMyCharStore';
import { backgroundShopConfig } from '@/config/backgroundShopConfig';

// 기본 배경과 캐릭터 매핑
const backgroundToCharacterMap: Record<string, string> = {
  '물속 모험의 세계': '부기부기',
  '얼음나라 대탐험': '팽글링스',
  '초원의 비밀 정원': '호랭이',
};

export const useShopFetchMyBack = () => {
  const { setUserBackgroundId, setBackImg } = userMyCharActions();

  const { mutate, isPending } = useMutation({
    mutationFn: async (backgroundId: number) => {
      // 서버 API 호출
      console.log(`서버에 backgroundId 전송: ${backgroundId}`);
      return { success: true };
    },
  });

  // 배경 ID로 배경 선택
  const handleFetchShopBack = (backgroundId: number) => {
    // 1. 배경 정보 찾기 (ID로 찾기)
    const selectedBackground = backgroundShopConfig.find(
      (bg) =>
        bg.userBackgroundId === backgroundId || bg.productId === backgroundId,
    );

    if (selectedBackground) {
      // 2. Zustand 상태 업데이트
      setUserBackgroundId(backgroundId);
      setBackImg(selectedBackground.image);

      console.log(
        `'${selectedBackground.characterName}' 배경이 적용되었습니다 (ID: ${backgroundId})`,
      );
    } else {
      console.error(`배경 ID ${backgroundId}를 찾을 수 없습니다`);

      // 기본 배경 적용 (첫 번째 배경)
      if (backgroundShopConfig.length > 0) {
        const defaultBackground = backgroundShopConfig[0];
        setUserBackgroundId(defaultBackground.productId);
        setBackImg(defaultBackground.image);
        console.log(
          `기본 배경 '${defaultBackground.characterName}'이 적용되었습니다`,
        );
      }
    }

    // 서버 통신
    mutate(backgroundId);
  };

  // 배경 이름으로 배경 선택 (이름 기반 선택)
  const handleFetchShopBackByName = (backgroundName: string) => {
    // 배경 정보 찾기 (이름으로 찾기)
    const selectedBackground = backgroundShopConfig.find(
      (bg) => bg.characterName === backgroundName,
    );

    if (selectedBackground) {
      console.log(`이름으로 배경 찾음: ${backgroundName}`);
      // 찾은 배경으로 선택 처리
      handleFetchShopBack(selectedBackground.userBackgroundId);
    } else {
      console.error(
        `배경 이름 "${backgroundName}"에 해당하는 배경을 찾을 수 없습니다`,
      );
    }
  };

  return {
    handleFetchShopBack,
    handleFetchShopBackByName,
    isPending,
  };
};
