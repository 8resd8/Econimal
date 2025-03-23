// 마을에서 사용하는 api를 탠스택쿼리로 관리
import { patchTownName, getTownEvents } from './townApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTownStore } from '@/store/useTownStore';

// 마을 이름 변경 쿼리
export const usePatchTownName = () => {
  const queryClient = useQueryClient();
  const setTownName = useTownStore((state) => state.setTownName); // Zustand

  // data	: mutation 함수(patchTownName)의 응답 데이터.  API 응답 값
  // townData : mutate(townData) 호출 시 넘긴 입력 데이터. API 요청을 보낼 때 사용한 값
  const { mutateAsync } = useMutation({
    // mutate? mutateAysnc?
    mutationFn: patchTownName,

    // onSuccess 콜백은 (data, variables, context) => void 형태의 파라미터를 가짐
    onSuccess: (_,townData) => {
      // 필요한 쿼리 무효화?(마을 이름 표시 되는 곳?)
      queryClient.invalidateQueries({ queryKey: ['town-info'] });
      // 성공시 store 업데이트
      setTownName(townData.townName);
    },
    onError: (error) => {
      console.log('마을 이름 변경 중 오류 발생', error);
    },
  });
  return mutateAsync;
};

// 마을 상황 조회 쿼리
export const useGetTownEvents = () => {
  // return 해야하는가
  return useQuery({
    queryKey: ['town-events'],
    queryFn: () => getTownEvents(),
    // staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });
};
