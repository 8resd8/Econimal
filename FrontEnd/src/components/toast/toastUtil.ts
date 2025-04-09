import { toast, ToastOptions, Id } from 'react-toastify';
import { isModalOpen } from '@/components/EventDetector';
import { useErrorStore } from '@/store/errorStore';
// import { EcoType } from '@/pages/town/features/infraApi';

// [최적화] 토스트 관리를 위한 객체
// 마지막으로 표시된 토스트의 시간과 ID를 저장
const toastTracker = {
  // 마지막 토스트 표시 시간
  lastShownTime: {} as Record<string, number>,
  // 현재 활성화된 토스트 ID
  activeToasts: {} as Record<string, Id>,
  // 토스트 표시 최소 간격 (밀리초)
  COOLDOWN: 1000,

  // 특정 유형의 토스트를 표시해도 될지 확인하는 메서드
  canShow(key: string): boolean {
    if (isModalOpen || useErrorStore.getState().isError) {
      return false;
    }

    const now = Date.now();
    const lastTime = this.lastShownTime[key] || 0;

    // 마지막 표시 후 충분한 시간이 지났는지 확인
    if (now - lastTime < this.COOLDOWN) {
      return false;
    }

    this.lastShownTime[key] = now;
    return true;
  },

  // 토스트 ID 저장 메서드
  saveId(key: string, id: Id): void {
    this.activeToasts[key] = id;
  },

  // 특정 유형의 토스트를 표시하고 ID 반환하는 메서드
  show(
    key: string,
    toastFn: Function,
    message: string,
    options: ToastOptions,
  ): Id | null {
    if (!this.canShow(key)) {
      return this.activeToasts[key] || null;
    }

    const id = toastFn(message, {
      ...defaultOptions,
      ...options,
      // 유형별 고유 ID 지정
      toastId: `toast-${key}`,
    });

    this.saveId(key, id);
    return id;
  },

  // 모든 토스트 제거 및 추적 데이터 초기화
  clearAll(): void {
    toast.dismiss({ containerId: TOAST_CONTAINER_ID });
    this.lastShownTime = {};
    this.activeToasts = {};
  },
};

// 토스트 컨테이너 ID
export const TOAST_CONTAINER_ID = 'app-toast-container';

// 기본 토스트 옵션
export const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  containerId: TOAST_CONTAINER_ID,
  closeButton: true,
  rtl: false,
};

// 토스트 표시 여부 확인 함수
export const shouldShowToast = (): boolean => {
  return !isModalOpen && !useErrorStore.getState().isError;
};

// -------------------- 인프라 이벤트 관련 함수 --------------------

// [최적화] 통합 마을 이벤트 알림 토스트
export const showTownEventNotice = (options?: ToastOptions): Id | null => {
  return toastTracker.show(
    'town-event',
    toast.info,
    '마을에 문제가 발생했습니다!',
    {
      ...options,
      autoClose: options?.autoClose || 5000,
    },
  );
};

// 인프라 타입별 메시지 맵
// const infraEventMessages: Record<EcoType, string> = {
//   ELECTRICITY: '가정에 문제가 발생했습니다!',
//   WATER: '하수처리장에 문제가 발생했습니다!',
//   GAS: '공장에 문제가 발생했습니다!',
//   COURT: '법원에 문제가 발생했습니다!',
// };

// [최적화] 통합된 인프라 이벤트 알림 함수
export const showInfraEventNotice = (
  // ecoType: string,
  options?: ToastOptions,
  onClick?: () => void,
): Id | null => {
  return showTownEventNotice({
    ...options,
    onClick: onClick,
  });
};

// [최적화] 인프라 결과 알림 함수
export const showInfraResultNotice = (
  isOptimal: boolean,
  exp: number,
  coin: number,
  options?: ToastOptions,
): Id | null => {
  const resultMessage = isOptimal
    ? '캐릭터가 행복해요! 🥰'
    : '캐릭터가 슬퍼요 😭';

  const fullMessage = `${resultMessage}\n\n 경험치 ${exp} 획득\n코인 ${coin} 획득`;

  const toastFn = isOptimal ? toast.success : toast.warning;

  return toastTracker.show('infra-result', toastFn, fullMessage, {
    ...options,
    autoClose: options?.autoClose || 5000,
    style: { whiteSpace: 'pre-line' },
  });
};

// [최적화] 일반 알림 함수
export const showNotice = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  options?: ToastOptions,
): Id | null => {
  return toastTracker.show(
    `notice-${type}-${message.substring(0, 10)}`,
    toast[type],
    message,
    {
      ...options,
      autoClose: options?.autoClose || 3000,
    },
  );
};

// 모든 토스트 제거 함수
export const clearAllToasts = () => {
  toastTracker.clearAll();
};

// -------------------- 기본 토스트 함수들 --------------------

// [최적화] 성공 토스트 메시지
export const showSuccessToast = (
  message: string,
  options?: ToastOptions,
): Id | null => {
  return toastTracker.show(
    `success-${message.substring(0, 10)}`,
    toast.success,
    message,
    options || {},
  );
};

// [최적화] 에러 토스트 메시지
export const showErrorToast = (
  message: string,
  options?: ToastOptions,
): Id | null => {
  return toastTracker.show(
    `error-${message.substring(0, 10)}`,
    toast.error,
    message,
    options || {},
  );
};

// [최적화] 정보 토스트 메시지
export const showInfoToast = (
  message: string,
  options?: ToastOptions,
): Id | null => {
  return toastTracker.show(
    `info-${message.substring(0, 10)}`,
    toast.info,
    message,
    options || {},
  );
};

// [최적화] 경고 토스트 메시지
export const showWarningToast = (
  message: string,
  options?: ToastOptions,
): Id | null => {
  return toastTracker.show(
    `warning-${message.substring(0, 10)}`,
    toast.warning,
    message,
    options || {},
  );
};
