import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userMyCharActions } from '@/store/useMyCharStore';
import { fetchMyCharInShop } from '../api/fetchMyCharInShop';

// 캐릭터와 기본 배경 매핑
const characterToBackgroundMap = {
  부기부기: '물속 모험의 세계',
  팽글링스: '얼음나라 대탐험',
  호랭이: '초원의 비밀 정원',
};

// 캐릭터 ID와 이름 매핑
const characterIdToNameMap = {
  835: '부기부기',
  836: '팽글링스',
  837: '호랭이',
};

export const useShopFetchMyChar = () => {
  const { setUserCharacterId, setName, setBackImg } = userMyCharActions();
  const queryClient = useQueryClient();

  // 배경 정보를 가져오기 위한 직접 참조
  const backgroundShopConfig = [
    {
      userBackgroundId: 101,
      characterName: '물속 모험의 세계',
      image: '/path/to/bg1.jpg',
    },
    {
      userBackgroundId: 102,
      characterName: '얼음나라 대탐험',
      image: '/path/to/bg2.jpg',
    },
    {
      userBackgroundId: 103,
      characterName: '초원의 비밀 정원',
      image: '/path/to/bg3.jpg',
    },
    // 공통 배경들
    {
      userBackgroundId: 104,
      characterName: '자연의 숨결',
      image: '/path/to/common1.jpg',
    },
    {
      userBackgroundId: 105,
      characterName: '끝없는 바다 여행',
      image: '/path/to/common2.jpg',
    },
    {
      userBackgroundId: 106,
      characterName: '거대한 얼음 왕국',
      image: '/path/to/common3.jpg',
    },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: (characterId: number) => {
      console.log(`서버에 characterId 전송: ${characterId}`);
      return fetchMyCharInShop(characterId); //서버에 나만의 캐릭터 정보 전달
    },
    onSuccess: (data) => {
      //성공했을 때
      queryClient.invalidateQueries({ queryKey: ['MyChar'] });
      queryClient.invalidateQueries({ queryKey: ['myCharInfo'] });
      queryClient.invalidateQueries({ queryKey: ['charInfo'] });
      queryClient.invalidateQueries({ queryKey: ['myCharInformation'] });
      queryClient.invalidateQueries({ queryKey: ['charshop'] });
      console.log('서버에 내 캐릭터 전송, 내가 고른 캐릭터 선택 완료');
    },
    onError: (error) => {
      console.error(
        '캐릭터 등록 실패, 서버에 캐릭터 등록과 관련된 전달이 실패했습니다.:',
        error,
      );
      console.log(error);
      throw Error;
    },
  });

  // 캐릭터 선택 핸들러
  const handleFetchShopChar = (characterId: number) => {
    // 캐릭터 ID 설정
    setUserCharacterId(characterId);

    // ID 기반으로 캐릭터 이름 직접 설정
    const characterName = characterIdToNameMap[characterId];
    if (characterName) {
      setName(characterName);
      console.log(`캐릭터 선택: ${characterName} (ID: ${characterId})`);

      // 해당 캐릭터의 기본 배경 찾기
      const defaultBgName = characterToBackgroundMap[characterName];
      if (defaultBgName) {
        // 기본 배경에 맞는 이미지 찾기
        const bgConfig = backgroundShopConfig.find(
          (bg) => bg.characterName === defaultBgName,
        );
        if (bgConfig) {
          // 기본 배경 이미지 설정
          setBackImg(bgConfig.image);
          console.log(
            `캐릭터 '${characterName}'의 기본 배경 '${defaultBgName}' 설정 완료`,
          );
        }
      }
    }

    // 서버 요청 보내기
    mutate(characterId);
  };

  return {
    handleFetchShopChar,
    isPending,
  };
};
