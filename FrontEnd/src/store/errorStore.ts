// Zustand를 사용한 에러 상태 스토어
import { create } from 'zustand';
import { ErrorState, ErrorType } from '@/components/errorScreens/types/error';
import { setModalOpen } from '@/components/EventDetector'; // 모달 상태 관리 함수
import { clearAllToasts } from '@/components/toast/toastUtil'; // 토스트 제거 함수

// 에러 스토어 인터페이스
interface ErrorStore extends ErrorState {
  showError: (params: Omit<ErrorState, 'isError'>) => void;
  hideError: () => void;
}

// Zustand 스토어 생성
export const useErrorStore = create<ErrorStore>((set) => ({
  // 초기 상태
  isError: false,
  errorType: null,

  // 에러 표시 함수
  showError: (params) => {
    setModalOpen(false); // 에러 발생 시 모든 모달 닫기
    clearAllToasts(); // 에러 발생 시 모든 토스트 제거

    const prevPath = params.prevPath || window.location.pathname; // 현재 경로 저장

    set({
      isError: true,
      ...params,
      prevPath,
    });
  },

  // 에러 숨기기 함수
  hideError: () => {
    set({
      isError: false,
      errorType: null,
    });
  },
}));

// 에러 발생 리스너 - 전역 에러를 캐치하여 에러 스토어에 등록
export const setupErrorHandlers = () => {
  // 전역 에러 핸들러 설정
  window.addEventListener('error', (event) => {
    // 에러가 React ErrorBoundary에서 이미 처리되고 있는지 확인
    // 중복 처리 방지를 위해 사용자 정의 플래그 검사
    if ((event as any)._reactHandled) {
      return;
    }

    // 에러 스토어에 에러 등록
    useErrorStore.getState().showError({
      errorType: 'general' as ErrorType, // 타입 캐스팅 추가
      errorMessage: event.error?.message || '예상치 못한 오류가 발생했습니다.', // message -> errorMessage로 수정
    });

    // 이벤트 마킹 (중복 처리 방지)
    (event as any)._reactHandled = true;
  });

  // Promise 에러 핸들러 (unhandled rejections)
  window.addEventListener('unhandledrejection', (event) => {
    // 에러 스토어에 에러 등록
    useErrorStore.getState().showError({
      errorType: 'general' as ErrorType, // 타입 캐스팅 추가
      // message -> errorMessage로 수정
      errorMessage:
        event.reason?.message || '처리되지 않은 Promise 에러가 발생했습니다.',
    });
  });
};
