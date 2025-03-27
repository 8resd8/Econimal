import { useEffect, useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { useGetTownEvents } from '@/pages/town/features/useTownQuery';
// import { toast, ToastContainer } from 'react-toastify';
import { showInfraEventNotice } from './toast/toastUtil';
// 이벤트 감지기
const EventDetector = () => {
  const activeEvents = useTownStore((state) => state.activeEvents); // 스토어에서 활성화된 이벤트 ID 목록 가져오기
  const { data: townEventsData } = useGetTownEvents();
  const [previousActiveEvents, setPreviousActiveEvents] = useState<number[]>(
    [],
  );

  useEffect(() => {
    // 이전 activeEvents와 현재 activeEvents 비교
    if (townEventsData?.townStatus && townEventsData.townStatus.length > 0) {
      // 새로 활성화된 이벤트만 필터링
      const newActiveEvents = activeEvents.filter(
        (eventId) => !previousActiveEvents.includes(eventId),
      );

      // 새로 활성화된 이벤트가 있으면 토스트 표시
      if (newActiveEvents.length > 0) {
        // 해당 이벤트에 대한 ecoType 찾기
        newActiveEvents.forEach((eventId) => {
          const eventInfo = townEventsData.townStatus.find(
            (event) => event.infraEventId === eventId && event.isActive,
          );

          if (eventInfo) {
            showInfraEventNotice(eventInfo.ecoType);
          }
        });
      }

      // 현재 activeEvents를 이전 상태로 저장
      setPreviousActiveEvents([...activeEvents]);
    }
  }, [activeEvents, townEventsData]);

  return null; // ToastContainer는 상위 컴포넌트에서 한 번만 렌더링하므로 여기서는 제거
};
// ToastContainer는 상위 컴포넌트(App.tsx)에서 한 번만 렌더링하는 것이 좋음.
// 여기서는 독립적인 컴포넌트로 사용할 수 있도록 구현하였으나, 전역에서 토스트를 사용할 것이라면 return 없어도 될듯(->EventDetector가 알림로직만 처리하게 됨)

export default EventDetector;

// 1. useTownQurey.ts의 useGetTownEvents에서 데이터 가져옴
// 1-1. useGetTownEvents는 Town.tsx에서 사용하는 쿼리임
// 2. 이때의 response에서 isActive가 하나라도 true이면 이벤트 감지
// 3. 주스탄드에 저장해야한다면 저장(꼭 저장해야함? 다른 페이지여서?)
// 4. Town.tsx이 아닌 MyCharacter.tsx에서 이벤트 발생 여부를 토스트창으로 알 수 있어야함.

// useSubmitInfraResult 쿼리의 response에서 exp, coin은 Town.tsx에서 토스트창 띄울거야

// 최적화된 코드와 컴포넌트 분리 어떻게 하지
