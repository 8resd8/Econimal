import { useEffect, useRef } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { useGetTownEvents } from '@/pages/town/features/useTownQuery';
// import { toast, ToastContainer } from 'react-toastify';
import { showInfraEventNotice } from './toast/toastUtil';
import { useLocation, useNavigate } from 'react-router-dom';
import { TownEvent } from '@/pages/town/features/townApi';

// 모달 상태를 전역으로 관리하기 위한 store 생성 또는 활용
// 모달 상태를 관리하는 전역 변수
export let isModalOpen = false;

// 모달 상태를 설정하는 함수
export const setModalOpen = (open: boolean) => {
  isModalOpen = open;
};

// 이벤트 감지기
const EventDetector = () => {
  const activeEvents = useTownStore((state) => state.activeEvents); // 스토어에서 활성화된 이벤트 ID 목록 가져오기
  const previousEventsRef = useRef<number[]>([]);
  // const [previousActiveEvents, setPreviousActiveEvents] = useState<number[]>(
  //   [],
  // );

  // 페이지 이동을 위한 navigate 훅
  const navigate = useNavigate();

  /* useLocation이란?
  React Router에서 제공하는 훅으로, 현재 URL에 대한 정보를 담고 있는 객체를 반환한다.
  이를 통해 현재 경로(pathname), 쿼리 문자열(search), 해시(hash), 그리고 이전 페이지에서 전달된 상태(state) 등의 정보를 얻을 수 있다.
   */

  // 현재 경로 확인
  const location = useLocation();
  const isTownPage = location.pathname.includes('/town');

  // 마을 관련 데이터 쿼리 실행
  const { data: townEventsData } = useGetTownEvents();

  useEffect(() => {
    // activeEvents가 없거나 배열이 아니면 처리하지 않음
    if (
      !activeEvents ||
      !Array.isArray(activeEvents) ||
      activeEvents.length === 0 ||
      !townEventsData ||
      !townEventsData.townStatus
    ) {
      return;
    }

    // Town 페이지에서는 토스트를 표시하지 않음
    if (isTownPage) {
      // 그냥 이전 이벤트 배열을 업데이트만 함
      previousEventsRef.current = [...activeEvents];
      return;
    }

    try {
      // 새로 활성화된 이벤트만 필터링
      const newActiveEvents = activeEvents.filter(
        (eventId) => !previousEventsRef.current.includes(eventId),
      );

      // 새로운 이벤트가 있고, 모달이 열려있지 않을 때만 토스트 메시지 표시
      if (newActiveEvents.length > 0 && !isModalOpen) {
        // 각 이벤트 ID에 대해 해당 ecoType 찾기
        newActiveEvents.forEach((eventId) => {
          // townEventsData에서 해당 이벤트 ID에 맞는 이벤트 정보 찾기
          const eventInfo = townEventsData.townStatus.find(
            (event: TownEvent) => event.infraEventId === eventId,
          );

          // 이벤트 정보가 있을 때만 해당 ecoType으로 토스트 알림 표시
          if (eventInfo) {
            // 토스트 클릭 시 마을 페이지로 이동하는 핸들러 추가
            showInfraEventNotice(eventInfo.ecoType, {
              onClick: () => navigate('/town'),
              // 토스트가 사라지지 않는 문제 해결을 위한 옵션
              draggable: false,
              pauseOnHover: false,
            });
          }
          // 이벤트 정보가 없으면 토스트창을 표시하지 않음
        });
      }

      // 현재 activeEvents를 참조로 저장
      previousEventsRef.current = [...activeEvents];
    } catch (error) {
      console.error('EventDetector 오류:', error);
    }
  }, [activeEvents, isTownPage]);

  return null;
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
