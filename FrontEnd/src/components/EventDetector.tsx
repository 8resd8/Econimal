import { useEffect, useRef, useCallback } from 'react';
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
  const notifiedEventsRef = useRef<Set<number>>(new Set()); // 이미 알림을 보낸 이벤트 ID 추적

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

  // 페이지 변경 시 알림 초기화 및 메모리 초기화
  useEffect(() => {
    notifiedEventsRef.current.clear();
  }, [location.pathname]);

  // 이벤트 알림 처리 로직 개선
  const processNewEvents = useCallback(() => {
    // 마을 페이지이거나 활성 이벤트가 없는 경우 처리 중단
    if (
      isTownPage || // 마을 페이지에서는 알림 표시 안함
      !activeEvents?.length ||
      !townEventsData?.townStatus
    ) {
      return;
    }

    try {
      // 완전히 새로운 이벤트만 필터링
      // 1. 아직 알림을 보내지 않은 이벤트
      // 2. 현재 활성 상태인 이벤트만 선택
      const newUntouchedEvents = activeEvents.filter(
        (eventId) =>
          !notifiedEventsRef.current.has(eventId) &&
          townEventsData.townStatus.some(
            (event) => event.infraEventId === eventId && event.isActive,
          ),
      );

      // 모달이 열려있지 않을 때만 알림 표시
      if (newUntouchedEvents.length > 0 && !isModalOpen) {
        newUntouchedEvents.forEach((eventId) => {
          const eventInfo = townEventsData.townStatus.find(
            (event: TownEvent) => event.infraEventId === eventId,
          );

          if (eventInfo) {
            // [여기] 토스트 알림 표시
            showInfraEventNotice(eventInfo.ecoType, {
              onClick: () => navigate('/town'),
              draggable: false,
              pauseOnHover: false,
            });

            // 알림 보낸 이벤트 ID 추가
            notifiedEventsRef.current.add(eventId);
          }
        });
      }
    } catch (error) {
      console.error('EventDetector 오류:', error);
    }
  }, [activeEvents, isTownPage, townEventsData, navigate, isModalOpen]);

  // 이벤트 처리 로직 실행
  useEffect(() => {
    processNewEvents();
  }, [processNewEvents]);

  return null;
};

export default EventDetector;
