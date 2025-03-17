// 마을에서 사용하는 api를 탠스택쿼리로 관리
import { patchTownName, getTownEvents } from './townApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// // mutate겠지?
export const usePatchTownName = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: patchTownName,
    onSuccess: () => {
      // 필요한 쿼리 무효화?(마을 이름 표시 되는 곳?)
      queryClient.invalidateQueries({ queryKey: ['town-info'] });
    },
    onError: () => {},
  });
  return mutate;
};

// 마을 전체 이벤트 조회 쿼리
export const useGetTownEvents = (townId: string) => {
  useQuery({
    queryKey: ['town-events', townId],
    queryFn: () => getTownEvents(townId),
    // staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });
};
