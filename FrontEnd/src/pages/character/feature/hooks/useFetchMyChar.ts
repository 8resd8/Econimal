// get -> useQuery였는데 보내는 것 => patch

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyChar } from '../api/fetchMyChar';
import useCharStore from '@/store/useCharStore';
export const useFetchMyChar = () => {
  const { myChar } = useCharStore();
  const queryClient = useQueryClient();
  // const { data, isError, error, isPending } = useMutation({

  const { mutate, isPending, isError, error } = useMutation({
    //매개변수 자체에 넣음 -> 객체는 여러 속성을 다룰 수 있음
    mutationFn: (userCharacterId: number) => {
      console.log(`Sending ID to server: ${userCharacterId}`);
      return fetchMyChar(userCharacterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['MyChar'] }); //이거 기능이 정확하게 무엇인지?
      console.log('캐릭터 선택 완료, 캐시 갱신');

      console.log('useFetchMyChar내부, 서버에 useCharacterId 전달');
    },
    onError: (error) => {
      console.error('캐릭터 등록 실패:', error);
    },
  });

  // 캐릭터 선택 핸들러
  const handleFetchMyChar = () => {
    // Get the effective ID for the API call
    // Always prioritize userCharacterId if available
    const effectiveId = myChar?.userCharacterId || myChar?.id;

    if (effectiveId && effectiveId > 0) {
      console.log(`handleFetchMyChar: ID=${effectiveId} 선택 요청`);
      mutate(effectiveId);
    } else {
      console.error('유효한 캐릭터 ID가 없습니다:', myChar);
    }
  };

  return {
    handleFetchMyChar,
    isPending,
  };
};
