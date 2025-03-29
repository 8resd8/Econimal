import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyChar } from '../api/fetchMyChar';

export const useShopFetchMyChar = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (characterId: number) => {
      console.log(`서버에 characterId 전송: ${characterId}`);
      return fetchMyChar(characterId); //서버에 나만의 캐릭터 정보 전달
    },
    onSuccess: () => {
      //성공했을 때
      queryClient.invalidateQueries({ queryKey: ['MyChar'] });
      queryClient.invalidateQueries({ queryKey: ['myCharInfo'] });
      queryClient.invalidateQueries({ queryKey: ['charInfo'] });
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

  // 캐릭터 선택 핸들러 => 서버에 보낼 id값을 전달할 내용
  const handleFetchShopChar = (characterId: number) => {
    mutate(characterId);
  };

  return {
    handleFetchShopChar,
    isPending,
  };
};
