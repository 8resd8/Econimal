import { useEffect } from 'react';
import { useErrorStore } from '@/store/errorStore';
import {
  TOAST_CONTAINER_ID,
  clearAllToasts,
} from '@/components/toast/toastUtil';

/**
 * 에러 상태와 토스트 컨테이너를 관리하는 커스텀 훅
 *
 * - 에러 발생 시 모든 토스트를 제거
 * - 페이지 새로고침 시 에러 상태 초기화
 * - 에러 상태 정보 반환
 */
export const useErrorToastManager = () => {
  // 에러 스토어에서 에러 상태 가져오기
  const isError = useErrorStore((state) => state.isError);

  // 페이지 새로고침 시 에러 상태 초기화
  useEffect(() => {
    const handleBeforeUnload = () => {
      useErrorStore.getState().hideError();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 에러 상태 변경 감지 및 토스트 처리
  useEffect(() => {
    if (isError) {
      // 방법 1: react-toastify API 사용 (정상적인 방법)
      clearAllToasts();

      // 방법 2: DOM에서 직접 토스트 제거 (백업 매커니즘)
      // react-toastify가 작동하지 않는 경우를 대비
      setTimeout(() => {
        const toastContainer = document.getElementById(TOAST_CONTAINER_ID);
        if (toastContainer && toastContainer.children.length > 0) {
          Array.from(toastContainer.children).forEach((child) => {
            child.remove();
          });
        }
      }, 100); // API 호출 후 약간의 지연 시간 추가
    }
  }, [isError]);

  // 에러 상태 반환
  return { isError };
};

export default useErrorToastManager;
