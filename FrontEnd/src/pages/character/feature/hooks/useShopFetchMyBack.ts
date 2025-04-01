import { useMutation } from '@tanstack/react-query';
import { userMyCharActions } from '@/store/useMyCharStore';
import { backgroundShopConfig } from '@/config/backgroundShopConfig';

// 서버 ID와 로컬 ID 매핑 (항상 최신 서버 ID에 맞게 업데이트)
const serverToLocalIdMap = {
  45: 1774, // 물속 모험의 세계
  46: 1775, // 얼음나라 대탐험
  47: 1776, // 초원의 비밀 정원
  48: 1777, // 자연의 숨결
  49: 1778, // 끝없는 바다 여행
  50: 1779, // 거대한 얼음 왕국
};

export const useShopFetchMyBack = () => {
  const { setUserBackgroundId, setBackImg } = userMyCharActions();

  const { mutate, isPending } = useMutation({
    mutationFn: async (backgroundId: number) => {
      // 서버 API 호출은 생략하고 성공 처리
      return { success: true };
    },
  });

  // 배경 선택 핸들러
  const handleFetchShopBack = (backgroundId: number) => {
    // 1. 올바른 배경 ID 찾기 (서버 ID를 로컬 ID로 변환)
    const mappedId = serverToLocalIdMap[backgroundId] || backgroundId;

    // 2. 배경 이미지 찾기
    const selectedBackground = backgroundShopConfig.find(
      (bg) => bg.productId === mappedId,
    );

    if (selectedBackground) {
      // 3. Zustand 상태 업데이트
      setUserBackgroundId(mappedId);
      setBackImg(selectedBackground.image);

      console.log(
        `'${selectedBackground.characterName}' 배경이 적용되었습니다`,
      );
    } else {
      console.error(
        `배경 ID ${backgroundId}(매핑: ${mappedId})를 찾을 수 없습니다`,
      );

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

    // 형식상 서버 통신 (실제로는 처리하지 않음)
    mutate(backgroundId);
  };

  return { handleFetchShopBack, isPending };
};
