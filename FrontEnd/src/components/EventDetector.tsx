import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { useGetTownEvents } from '@/pages/town/features/useTownQuery';
import { showInfraEventNotice, clearAllToasts } from './toast/toastUtil';
import { useLocation, useNavigate } from 'react-router-dom';
import { TownEvent } from '@/pages/town/features/townApi';

// 모달 상태를 전역으로 관리하기 위한 변수
export let isModalOpen = false;

// 모달 상태를 설정하는 함수
export const setModalOpen = (open: boolean) => {
  isModalOpen = open;
};

// 토스트를 표시하지 않을 페이지 경로 목록 (정확한 경로)
const TOAST_EXCLUDED_PAGES = [
  '/charsel', // 캐릭터 선택 페이지
  '/error', // 에러 페이지
  '/loading', // 로딩 페이지
  '/login', // 로그인 페이지
  '/signup', // 회원가입 페이지
  '/prolog', // 프롤로그 페이지
];

// 마지막으로 알림을 보낸 시간을 추적하는 변수
let lastNotificationTime = 0;
// 최소 알림 간격 (밀리초)
const NOTIFICATION_COOLDOWN = 2000;
// 페이지 전환 후 토스트 표시 지연 시간
const PAGE_TRANSITION_DELAY = 500;

// 이벤트 감지기 - 타이밍 개선 버전
const EventDetector = () => {
  // Zustand Store에서 active 이벤트 가져오기
  const activeEvents = useTownStore((state) => state.activeEvents);

  // 이미 알림을 보낸 이벤트 ID 추적을 위한 ref
  const notifiedEventsRef = useRef<Set<number>>(new Set());

  // 페이지 전환 상태 추적
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 페이지 경로 정확히 일치하는지 확인 (더 엄격한 검사)
  const currentPath = location.pathname;

  // 메모이제이션 사용하여 페이지 체크 성능 최적화
  const shouldShowToast = useMemo(() => {
    // 현재 경로가 제외 목록에 있는지 정확히 확인
    return !TOAST_EXCLUDED_PAGES.includes(currentPath);
  }, [currentPath]);

  // 마을 페이지 여부 확인
  const isTownPage = currentPath === '/town';

  // 마을 관련 데이터 쿼리 실행
  const { data: townEventsData } = useGetTownEvents();

  // 페이지 변경될 때 발생하는 이벤트
  useEffect(() => {
    // 페이지 변경 시작 시 전환 중임을 표시
    setIsTransitioning(true);

    // 페이지 전환 시 토스트 처리 로직
    if (!shouldShowToast) {
      // 토스트를 표시하지 않아야 하는 페이지로 이동할 때 모든 토스트 제거
      clearAllToasts();

      // 알림 기록도 초기화
      notifiedEventsRef.current.clear();
    }

    // 페이지 전환 완료 후 상태 업데이트 (지연 설정)
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, PAGE_TRANSITION_DELAY);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [currentPath, shouldShowToast]);

  // 이벤트 알림 처리 로직 - 타이밍 개선 버전
  const processNewEvents = useCallback(() => {
    // 페이지 전환 중이면 토스트 표시 지연
    if (isTransitioning) {
      return;
    }

    // 빠른 탈출 조건 확인 - 모든 조건을 한 번에 체크하여 성능 최적화
    if (
      isTownPage ||
      !shouldShowToast ||
      !activeEvents?.length ||
      !townEventsData?.townStatus ||
      isModalOpen ||
      Date.now() - lastNotificationTime < NOTIFICATION_COOLDOWN // 알림 간격 제한
    ) {
      return;
    }

    try {
      // 이미 알림을 보낸 이벤트 ID Set 생성
      const notifiedSet = new Set(notifiedEventsRef.current);

      // 새로운 이벤트 필터링 최적화 - Set 사용하여 조회 속도 향상
      const newUntouchedEvents = activeEvents.filter(
        (eventId) =>
          !notifiedSet.has(eventId) &&
          townEventsData.townStatus.some(
            (event) => event.infraEventId === eventId && event.isActive,
          ),
      );

      // 새 이벤트가 없으면 처리 중단
      if (newUntouchedEvents.length === 0) {
        return;
      }

      // 알림 보낸 시간 갱신
      lastNotificationTime = Date.now();

      const eventsToShow = newUntouchedEvents.slice(0, 4); // 한 번에 최대 4개만 표시

      eventsToShow.forEach((eventId) => {
        // 이벤트 찾기 - 성능 최적화
        const eventInfo = townEventsData.townStatus.find(
          (event: TownEvent) => event.infraEventId === eventId,
        );

        if (eventInfo) {
          // 토스트 알림 표시 - 페이지 이동해도 유지되도록 설정
          showInfraEventNotice(eventInfo.ecoType, {
            onClick: () => navigate('/town'),
            // 페이지 이동 시에도 토스트가 유지되도록 설정
            autoClose: 5000, // 5초 후 자동으로 닫힘
          });

          // 알림 보낸 이벤트 ID 추가
          notifiedEventsRef.current.add(eventId);
        }
      });
    } catch (error) {
      console.error('EventDetector 오류:', error);
    }
  }, [
    activeEvents,
    isTownPage,
    townEventsData,
    navigate,
    shouldShowToast,
    isTransitioning,
  ]);

  // 이벤트 처리 로직 실행 - 의존성 배열 최적화 및 타이밍 조정
  useEffect(() => {
    // 페이지 전환 중이 아닐 때만 이벤트 처리 (화면이 먼저 표시된 후 토스트 표시)
    if (!isTransitioning) {
      // 약간의 지연 후 처리하여 화면 렌더링 우선 처리
      const timer = setTimeout(() => {
        processNewEvents();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [processNewEvents, isTransitioning]);

  // 아무것도 렌더링하지 않음 - 로직만 실행
  return null;
};

export default EventDetector;
