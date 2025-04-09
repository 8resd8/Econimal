import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userMyCharActions } from '@/store/useMyCharStore';
import { fetchMyCharInShop } from '../api/fetchMyCharInShop';
import { useShopFetchMyBack } from './useShopFetchMyBack';

// 캐릭터와 기본 배경 매핑
const characterToBackgroundMap: Record<string, string> = {
  부기부기: '물속 모험의 세계',
  팽글링스: '얼음나라 대탐험',
  호랭이: '초원의 비밀 정원',
};

// 캐릭터 ID와 이름 매핑 (서버에서 ID가 변경될 수 있으므로 일치하지 않을 수 있음)
const characterIdToNameMap: Record<number, string> = {
  835: '부기부기',
  836: '팽글링스',
  837: '호랭이',
};

export const useShopFetchMyChar = () => {
  const { setUserCharacterId, setName } = userMyCharActions();
  const queryClient = useQueryClient();
  const { handleFetchShopBackByName } = useShopFetchMyBack();

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

      // 서버 응답에서 캐릭터 이름을 가져올 수 있다면 (data가 캐릭터 정보를 포함한다면)
      if (data && data.characterName) {
        console.log(`서버 응답에서 캐릭터 이름 확인: ${data.characterName}`);
        const characterName = data.characterName;
        setName(characterName);

        // 캐릭터에 매핑된 기본 배경도 함께 설정
        const defaultBgName = characterToBackgroundMap[characterName];
        if (defaultBgName) {
          setTimeout(() => {
            handleFetchShopBackByName(defaultBgName);
          }, 300);
        }
      }
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

  // 캐릭터 선택 핸들러 => 서버에 보낼 id값을 전달할 내용
  const handleFetchShopChar = (characterId: number) => {
    // 캐릭터 ID 설정
    setUserCharacterId(characterId);

    // ID 기반으로 캐릭터 이름 직접 설정 (서버 응답이 오기 전에도 UI가 변경되도록)
    const characterName = characterIdToNameMap[characterId];
    if (characterName) {
      setName(characterName);
      console.log(`캐릭터 선택: ${characterName} (ID: ${characterId})`);
    }

    // 서버 요청 보내기
    mutate(characterId);
  };

  return {
    handleFetchShopChar,
    isPending,
  };
};
