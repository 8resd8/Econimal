// get -> useQuery였는데 보내는 것 => patch

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyChar } from '../api/fetchMyChar';
import useCharStore from '@/store/useCharStore';
const { myChar } = useCharStore();
export const useFetchMyChar = () => {
  const queryClient = useQueryClient();
  // const { data, isError, error, isPending } = useMutation({
  const { mutate } = useMutation({
    mutationFn: (userCharacterId) => fetchMyChar(userCharacterId), //요청 => 근데 여기 myChar..?
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['MyChar'] }); //이거 기능이 정확하게 무엇인지?
      console.log('useFetchMyChar내부, 서버에 useCharacterId 전달');
    },
  });

  //mutation 외적으로 사용
  const handleFetchMyChar = () => {
    mutate(myChar.id); //type
  };

  return {
    handleFetchMyChar,
  };
};
