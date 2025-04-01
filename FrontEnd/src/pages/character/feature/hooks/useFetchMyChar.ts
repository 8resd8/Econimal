import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyChar } from '../api/fetchMyChar';
import useCharStore from '@/store/useCharStore';
import { useEffectiveId } from './reuse/useEffectiveId';
import { useMyCharacterId } from '@/store/useMyCharStore';

export const useFetchMyChar = () => {
  // const { myChar } = useCharStore();
  const myCharacterId = useMyCharacterId();

  const { effectiveId } = useEffectiveId(myCharacterId);
  const queryClient = useQueryClient();

  //메인 캐릭터 패칭
  const { mutate, isPending } = useMutation({
    mutationFn: (userCharacterId: number) => {
      console.log(`서버에 characterId 전송: ${userCharacterId}`);
      return fetchMyChar(userCharacterId); //서버에 나만의 캐릭터 정보 전달
    },
    onSuccess: () => {
      //성공했을 때
      queryClient.invalidateQueries({ queryKey: ['MyChar'] });
      queryClient.invalidateQueries({ queryKey: ['myCharInformation'] });
      console.log('서버에 내 캐릭터 전송, 내가 고른 캐릭터 선택 완료');
    },
    onError: (error) => {
      console.error(
        '캐릭터 등록 실패, 서버에 캐릭터 등록과 관련된 전달이 실패했습니다.:',
        error,
      );
      throw Error;
    },
  });

  // 캐릭터 선택 핸들러 => 서버에 보낼 id값을 전달할 내용
  const handleFetchMyChar = () => {
    mutate(effectiveId as number);
  };

  return {
    handleFetchMyChar,
    isPending,
  };
};
