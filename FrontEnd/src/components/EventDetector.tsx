import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useTownStore } from '@/store/useTownStore';
import { useGetTownEvents } from '@/pages/town/features/useTownQuery';
import { showTownEventNotice, clearAllToasts } from './toast/toastUtil';
import { useLocation, useNavigate } from 'react-router-dom';
import { useErrorStore } from '@/store/errorStore';

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
  '/town',
  '/edit-profile',
];

// 마지막으로 알림을 보낸 시간을 추적하는 변수
let lastNotificationTime = 0;
// 최소 알림 간격 (밀리초)
const NOTIFICATION_COOLDOWN = 2000;
// 페이지 전환 후 토스트 표시 지연 시간
const PAGE_TRANSITION_DELAY = 500;

// [최적화] 이벤트 감지기 - 단일 토스트 알림 표시 적용
const EventDetector = () => {
  // Zustand Store에서 active 이벤트 가져오기
  const activeEvents = useTownStore((state) => state.activeEvents);

  // 에러 스토어에서 에러 상태 가져오기
  const isError = useErrorStore((state) => state.isError);

  // 이미 알림을 보낸 이벤트 ID 추적을 위한 ref
  // const notifiedEventsRef = useRef<Set<number>>(new Set());

  // [최적화] 토스트 알림 상태 추적을 위한 ref
  const hasShownNotificationRef = useRef(false);

  // 페이지 전환 상태 추적
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 페이지 경로 정확히 일치하는지 확인 (더 엄격한 검사)
  const currentPath = location.pathname;

  // 404 페이지인지 확인
  const is404Page = useMemo(() => {
    // 알려진 기본 경로 패턴들
    const knownPaths = [
      '/',
      '/town',
      '/charsel',
      '/my',
      '/earth',
      '/animation',
      '/edit-profile',
      '/shop',
      '/store',
      '/prolog',
      '/login',
      '/signup',
      '/loading',
      '/error',
    ];

    // 현재 경로가 알려진 경로 중 하나에 매칭되는지 확인
    const isKnownPath = knownPaths.some((path) => {
      if (path === '/') {
        return currentPath === '/';
      }
      return currentPath.startsWith(path);
    });

    // 알려진 경로가 아니면 404페이지로 간주
    return !isKnownPath;
  }, [currentPath]);

  // 메모이제이션 사용하여 페이지 체크 성능 최적화
  const shouldShowToast = useMemo(() => {
    // 에러 상태일 때나 404 페이지일 때는 토스트 표시하지 않음
    if (isError || is404Page) return false;

    // 현재 경로가 제외 목록에 있는지 정확히 확인
    return !TOAST_EXCLUDED_PAGES.includes(currentPath);
  }, [currentPath, isError, is404Page]);

  // -------------------------------------------------------------
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
      // notifiedEventsRef.current.clear();
      // [최적화] 알림 상태 초기화
      hasShownNotificationRef.current = false;
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

  // 에러 상태 변경 시 토스트 및 이벤트 처리
  useEffect(() => {
    if (isError) {
      // 에러 발생 시 모든 토스트 제거
      clearAllToasts();

      // 에러 발생 시 알림 기록 초기화
      // notifiedEventsRef.current.clear();
      // [최적화화] 알림 상태 초기화
      hasShownNotificationRef.current = false;
    }
  }, [isError]);

  // 404 페이지가 감지되면 토스트 제거
  useEffect(() => {
    if (is404Page) {
      clearAllToasts();
      // notifiedEventsRef.current.clear();
      hasShownNotificationRef.current = false;
    }
  }, [is404Page]);

  // [최적화] 이벤트 알림 처리 로직 - 단일 토스트 알림 적용
  const processEvents = useCallback(() => {
    // 에러 상태일 때는 이벤트 처리하지 않음
    if (isError || is404Page) {
      return;
    }

    // 페이지 전환 중이면 토스트 표시 지연
    if (isTransitioning) {
      return;
    }

    // 빠른 탈출 조건 확인
    if (
      !shouldShowToast ||
      !activeEvents?.length ||
      !townEventsData?.townStatus ||
      isModalOpen ||
      Date.now() - lastNotificationTime < NOTIFICATION_COOLDOWN || // 알림 간격 제한
      hasShownNotificationRef.current // 이미 토스트를 표시했으면 중단
    ) {
      return;
    }

    try {
      // 활성화된 이벤트가 하나라도 있으면 단일 토스트 표시
      if (activeEvents.length > 0) {
        // 알림 보낸 시간 갱신
        lastNotificationTime = Date.now();

        // 단일 토스트 메시지 표시
        showTownEventNotice({
          onClick: () => navigate('/town'),
          autoClose: 5000, // 5초 후 자동으로 닫힘
        });

        // 알림 표시 상태 업데이트
        hasShownNotificationRef.current = true;
      }
    } catch (error) {
      console.error('EventDetector 오류:', error);
    }
  }, [
    activeEvents,
    townEventsData,
    navigate,
    shouldShowToast,
    isTransitioning,
    isError,
    is404Page,
  ]);

  // 이벤트 처리 로직 실행 - 의존성 배열 최적화 및 타이밍 조정
  useEffect(() => {
    // 에러 상태나 404 페이지 확인
    if (isError || is404Page) {
      return;
    }

    // 페이지 전환 중이 아닐 때만 이벤트 처리 (화면이 먼저 표시된 후 토스트 표시)
    if (!isTransitioning) {
      // 약간의 지연 후 처리하여 화면 렌더링 우선 처리
      const timer = setTimeout(() => {
        processEvents();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [processEvents, isTransitioning, isError, is404Page]);

  // activeEvents 변경 시 알림 상태 초기화 (새로운 이벤트 발생 시 다시 알림 표시)
  useEffect(() => {
    // 이벤트가 없으면 알림 상태 초기화
    if (!activeEvents || activeEvents.length === 0) {
      hasShownNotificationRef.current = false;
    }
  }, [activeEvents]);

  //   try {
  //     // 이미 알림을 보낸 이벤트 ID Set 생성
  //     const notifiedSet = new Set(notifiedEventsRef.current);

  //     // 새로운 이벤트 필터링
  //     const newUntouchedEvents = activeEvents.filter(
  //       (eventId) =>
  //         !notifiedSet.has(eventId) &&
  //         townEventsData.townStatus.some(
  //           (event) => event.infraEventId === eventId && event.isActive,
  //         ),
  //     );

  //     // 새 이벤트가 없으면 처리 중단
  //     if (newUntouchedEvents.length === 0) {
  //       return;
  //     }

  //     // 알림 보낸 시간 갱신
  //     lastNotificationTime = Date.now();

  //     const eventsToShow = newUntouchedEvents.slice(0, 4); // 한 번에 최대 4개만 표시

  //     eventsToShow.forEach((eventId) => {
  //       // 에러 상태나 404 페이지 재확인 (비동기 처리 중 상태가 변경될 수 있음)
  //       if (useErrorStore.getState().isError || is404Page) {
  //         return;
  //       }

  //       // 이벤트 찾기 - 성능 최적화
  //       const eventInfo = townEventsData.townStatus.find(
  //         (event: TownEvent) => event.infraEventId === eventId,
  //       );

  //       if (eventInfo) {
  //         // 토스트 알림 표시 - 페이지 이동해도 유지되도록 설정
  //         showInfraEventNotice(eventInfo.ecoType, {
  //           onClick: () => navigate('/town'),
  //           // 페이지 이동 시에도 토스트가 유지되도록 설정
  //           autoClose: 3000, // 3초 후 자동으로 닫힘
  //         });

  //         // 알림 보낸 이벤트 ID 추가
  //         notifiedEventsRef.current.add(eventId);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('EventDetector 오류:', error);
  //   }
  // }, [
  //   activeEvents,
  //   townEventsData,
  //   navigate,
  //   shouldShowToast,
  //   isTransitioning,
  //   isError,
  //   is404Page,
  // ]);

  // // 이벤트 처리 로직 실행 - 의존성 배열 최적화 및 타이밍 조정
  // useEffect(() => {
  //   // 에러 상태나 404 페이지 확인
  //   if (isError || is404Page) {
  //     return;
  //   }

  //   // 페이지 전환 중이 아닐 때만 이벤트 처리 (화면이 먼저 표시된 후 토스트 표시)
  //   if (!isTransitioning) {
  //     // 약간의 지연 후 처리하여 화면 렌더링 우선 처리
  //     const timer = setTimeout(() => {
  //       processNewEvents();
  //     }, 100);

  //     return () => clearTimeout(timer);
  //   }
  // }, [processNewEvents, isTransitioning, isError, is404Page]);

  // 아무것도 렌더링하지 않음 - 로직만 실행
  return null;
};

export default EventDetector;
