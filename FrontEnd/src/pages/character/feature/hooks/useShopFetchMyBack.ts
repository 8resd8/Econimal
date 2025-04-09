import { useMutation } from '@tanstack/react-query';
import { userMyCharActions } from '@/store/useMyCharStore';
import { backgroundShopConfig } from '@/config/backgroundShopConfig';

// 기본 배경과 캐릭터 매핑
const backgroundToCharacterMap = {
  '물속 모험의 세계': '부기부기',
  '얼음나라 대탐험': '팽글링스',
  '초원의 비밀 정원': '호랭이',
};

// 캐릭터별 ID 매핑
const characterNameToIdMap = {
  부기부기: 835,
  팽글링스: 836,
  호랭이: 837,
};

// 모든 캐릭터가 선택 가능한 공통 배경
const commonBackgrounds = [
  '자연의 숨결',
  '끝없는 바다 여행',
  '거대한 얼음 왕국',
];

export const useShopFetchMyBack = () => {
  const { setUserBackgroundId, setBackImg, setUserCharacterId, setName } =
    userMyCharActions();

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

      // 3. 이 배경이 특정 캐릭터의 기본 배경인지 확인
      const bgName = selectedBackground.characterName;
      const matchedCharName = backgroundToCharacterMap[bgName];

      if (matchedCharName) {
        console.log(
          `배경 '${bgName}'에 매핑된 캐릭터 '${matchedCharName}' 자동 선택`,
        );

        // 4. 매핑된 캐릭터 ID 가져오기
        const charId = characterNameToIdMap[matchedCharName];

        if (charId) {
          // 직접 캐릭터 상태 업데이트
          setName(matchedCharName);
          setUserCharacterId(charId);
          console.log(
            `배경에 맞춰 캐릭터 '${matchedCharName}' (ID: ${charId}) 설정됨`,
          );
        }
      }
    } else {
      console.error(`배경 ID ${backgroundId}를 찾을 수 없습니다`);

      // 기본 배경 적용 (첫 번째 배경)
      if (backgroundShopConfig.length > 0) {
        const defaultBackground = backgroundShopConfig[0];
        setUserBackgroundId(defaultBackground.productId);
        setBackImg(defaultBackground.image);
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

  // 배경 선택 가능 여부 확인 함수
  const isBackgroundSelectable = (
    backgroundName: string,
    currentCharName: string | undefined,
  ): boolean => {
    if (!currentCharName) return true; // 캐릭터 선택 안 된 경우 모두 선택 가능

    // 이 배경이 기본 배경인지 확인
    const isBasicBackground =
      backgroundToCharacterMap[backgroundName] !== undefined;

    // 기본 배경인 경우: 현재 캐릭터에 매핑된 기본 배경인지 확인
    if (isBasicBackground) {
      return backgroundToCharacterMap[backgroundName] === currentCharName;
    }

    // 공통 배경인 경우 항상 선택 가능
    return commonBackgrounds.includes(backgroundName);
  };

  return {
    handleFetchShopBack,
    handleFetchShopBackByName,
    isBackgroundSelectable,
    isPending,
  };
};
