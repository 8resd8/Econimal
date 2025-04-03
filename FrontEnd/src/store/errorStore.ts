// Zustand를 사용한 에러 상태 스토어
import { create } from 'zustand';
import { ErrorState } from '@/components/errorScreens/types/error';
import { setModalOpen } from '@/components/EventDetector'; // 모달 상태 관리 함수 import

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
    // [여기] 에러 발생 시 모든 모달 닫기
    setModalOpen(false);

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
