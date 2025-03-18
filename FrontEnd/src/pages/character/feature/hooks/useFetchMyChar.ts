// get -> useQuery였는데 보내는 것 => patch

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyChar } from '../api/fetchMyChar';
import useCharStore from '@/store/useCharStore';
export const useFetchMyChar = () => {
  const { myChar } = useCharStore();
  const queryClient = useQueryClient();
  // const { data, isError, error, isPending } = useMutation({

  const { mutate } = useMutation({
    //매개변수 자체에 넣음 -> 객체는 여러 속성을 다룰 수 있음
    mutationFn: (userCharacterId: number) => fetchMyChar(userCharacterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['MyChar'] }); //이거 기능이 정확하게 무엇인지?
      console.log('useFetchMyChar내부, 서버에 useCharacterId 전달');
    },
    onError: (error) => {
      console.error('캐릭터 등록 실패:', error);
    },
  });

  //mutation 외적으로 사용
  const handleFetchMyChar = () => {
    //undefined => 따라서 유효성 로직 하나 더 추가
    if (myChar?.userCharacterId) {
      mutate(myChar.userCharacterId); // 올바른 ID 전달
    } else {
      console.log('myChar.id === undefined');
    }
  };

  return {
    handleFetchMyChar,
  };
};
