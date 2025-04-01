// 마을에서 사용하는 api를 탠스택쿼리로 관리
import { patchTownName, getTownEvents, TownEventsResponse } from './townApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTownStore } from '@/store/useTownStore';
import { useEffect } from 'react';
// import {showTownNameChangeNotice} from '@/components/toast/toastUtil'

// 마을 이름 변경 쿼리
export const usePatchTownName = () => {
  const queryClient = useQueryClient();
  const setTownName = useTownStore((state) => state.setTownName); // Zustand

  // townData : mutate(townData) 호출 시 넘긴 입력 데이터. API 요청을 보낼 때 사용한 값
  const { mutateAsync } = useMutation({
    mutationFn: patchTownName,
    // onSuccess 콜백은 (data, variables, context) => void 형태의 파라미터를 가짐
    onSuccess: (_, townData) => {
      // setTownName(townData.townName)  // 성공 시 스토어 업데이트
      // showTownNameChangeNotice(townData.townName) // 토스트 알림 표시

      queryClient.invalidateQueries({ queryKey: ['town-events'] }); // 필요한 쿼리 무효화
      setTownName(townData.townName); // 성공시 store 업데이트
    },
    onError: (error) => {
      console.log('마을 이름 변경 중 오류 발생', error);
    },
  });
  return mutateAsync;
};

// 마을 상황 조회 쿼리
export const useGetTownEvents = () => {
  const { setTownName, setActiveEvents, setInfraStatus } = useTownStore();

  const result = useQuery<TownEventsResponse>({
    queryKey: ['town-events'],
    queryFn: () => getTownEvents(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // useEffect를 사용하여 데이터 변경 시 상태 업데이트
  useEffect(() => {
    if (result.data) {
      // 마을 이름 업데이트
      if (result.data.townName) {
        setTownName(result.data.townName);
      }

      // 활성화된 이벤트ID 필터링 및 업데이트
      if (result.data.townStatus) {
        const activeEventIds = result.data.townStatus
          .filter((event) => event.isActive)
          .map((event) => event.infraEventId);

        setActiveEvents(activeEventIds);

        // 각 인프라 상태(clean/polluted) 설정
        result.data.townStatus.forEach((event) => {
          setInfraStatus(event.ecoType, event.isClean);
        });
      }
    }
  }, [result.data, setTownName, setActiveEvents, setInfraStatus]);

  return result;
};
