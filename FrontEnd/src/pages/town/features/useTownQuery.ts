// 마을에서 사용하는 api를 탠스택쿼리로 관리
import { patchTownName, getTownEvents, TownEventsResponse } from './townApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTownStore } from '@/store/useTownStore';
import { useEffect, useRef } from 'react';

// 마을 이름 변경 쿼리
export const usePatchTownName = () => {
  const queryClient = useQueryClient();
  const setTownName = useTownStore((state) => state.setTownName); // Zustand

  // townData : mutate(townData) 호출 시 넘긴 입력 데이터. API 요청을 보낼 때 사용한 값
  const { mutateAsync } = useMutation({
    mutationFn: patchTownName,
    // onSuccess 콜백은 (data, variables, context) => void 형태의 파라미터를 가짐
    onSuccess: (_, townData) => {
      setTownName(townData.townName); // 성공시 store 업데이트
      queryClient.invalidateQueries({ queryKey: ['town-events'] }); // 필요한 쿼리 무효화
    },
    onError: (error) => {
      console.log('마을 이름 변경 중 오류 발생', error);
    },
  });
  return mutateAsync;
};

// 마을 상황 조회 쿼리
export const useGetTownEvents = () => {
  // 필요한 함수만 선택적으로 가져오기
  const { updateValues } = useTownStore();
  // 이전 데이터 비교를 위한 ref 추가
  const prevDataRef = useRef<TownEventsResponse | null>(null);

  const result = useQuery<TownEventsResponse>({
    queryKey: ['town-events'],
    queryFn: () => getTownEvents(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 50000, // 항상 50초마다 갱신
    // staleTime: 20000, // 20초 동안 캐시 데이터 사용
  });

  // useEffect를 사용하여 데이터 변경 시 상태 업데이트 최적화
  useEffect(() => {
    if (!result.data) return;

    // 이전 데이터와 동일하면 불필요한 업데이트 건너뛰기
    if (JSON.stringify(result.data) === JSON.stringify(prevDataRef.current)) {
      return;
    }

    prevDataRef.current = result.data;

    // 모든 상태 업데이트를 일괄 처리하기 위한 변경사항 객체 -> 이게 필요해?
    const updates: Partial<any> = {};

    // 마을 이름 변경된 경우
    if (result.data.townName) {
      updates.townName = result.data.townName;
    }

    // 인프라 상태 및 활성 이벤트 처리
    if (result.data.townStatus && result.data.townStatus.length > 0) {
      // 활성화된 이벤트ID 필터링
      const activeEventIds = result.data.townStatus
        .filter((event) => event.isActive)
        .map((event) => event.infraEventId);

      updates.activeEvents = activeEventIds;

      // 인프라 상태 처리
      const infraStatusUpdates: Record<string, boolean> = {};
      result.data.townStatus.forEach((event) => {
        infraStatusUpdates[event.ecoType] = event.isClean;
      });

      // 모든 상태를 한 번에 업데이트
      updateValues({
        ...updates,
        infraStatus: {
          ...useTownStore.getState().infraStatus,
          ...infraStatusUpdates,
        },
      });
    } else {
      updateValues(updates); // 인프라 상태가 없는 경우는 이름만 업데이트
    }
  }, [result.data, updateValues]);

  // const { setTownName, setActiveEvents, setInfraStatus } = useTownStore();

  // const result = useQuery<TownEventsResponse>({
  //   queryKey: ['town-events'],
  //   queryFn: () => getTownEvents(),
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: true,
  // });

  // // useEffect를 사용하여 데이터 변경 시 상태 업데이트
  // useEffect(() => {
  //   if (result.data) {
  //     // 마을 이름 업데이트
  //     if (result.data.townName) {
  //       setTownName(result.data.townName);
  //     }

  //     // 활성화된 이벤트ID 필터링 및 업데이트
  //     if (result.data.townStatus) {
  //       const activeEventIds = result.data.townStatus
  //         .filter((event) => event.isActive)
  //         .map((event) => event.infraEventId);

  //       setActiveEvents(activeEventIds);

  //       // 각 인프라 상태(clean/polluted) 설정
  //       result.data.townStatus.forEach((event) => {
  //         setInfraStatus(event.ecoType, event.isClean);
  //       });
  //     }
  //   }
  // }, [result.data, setTownName, setActiveEvents, setInfraStatus]);

  return result;
};
