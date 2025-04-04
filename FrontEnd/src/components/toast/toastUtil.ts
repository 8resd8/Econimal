import { toast, ToastOptions } from 'react-toastify';
import { EcoType } from '@/pages/town/features/infraApi';
import { isModalOpen } from '@/components/EventDetector';

// 토스트 컨테이너 ID - 로그아웃 시 모든 토스트를 제거하기 위해 사용
export const TOAST_CONTAINER_ID = 'app-toast-container';

// 기본 토스트 옵션 - 성능 및 UX 개선
export const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false, // 호버 시 일시정지 방지
  draggable: false, // 드래그 방지
  containerId: TOAST_CONTAINER_ID,
  closeButton: true, // 닫기 버튼 표시
  rtl: false, // 왼쪽에서 오른쪽으로 텍스트 표시
  // theme: 'colored', // 색상이 강조된 테마 사용
};
// -------------------- 기본 토스트 --------------------
// 성공 토스트 메시지
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

// 에러 토스트 메시지
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

// 정보 토스트 메시지
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

// 경고 토스트 메시지
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

// -------------------- 인프라 이벤트 발생 관련 --------------------
// 인프라 타입별 메시지 맵
const infraEventMessages: Record<EcoType, string> = {
  ELECTRICITY: '가정에 문제가 발생했습니다!',
  WATER: '하수처리장에 문제가 발생했습니다!',
  GAS: '공장에 문제가 발생했습니다!',
  COURT: '법원에 문제가 발생했습니다!',
};

// 인프라 이벤트 알림 함수 - 개선된 버전
export const showInfraEventNotice = (
  ecoType: string,
  options?: ToastOptions,
  onClick?: () => void,
): string | number => {
  // 모달이 열려있다면 토스트를 표시하지 않음
  if (isModalOpen) {
    return -1;
  }

  const message =
    infraEventMessages[ecoType as EcoType] ||
    '마을에 새로운 문제가 발생했습니다!';

  // onClick 핸들러 통합
  const finalOptions = {
    ...defaultOptions,
    ...options,
    // 기본 옵션 덮어쓰기 방지를 위해 onClick을 마지막에 추가
    onClick:
      onClick ||
      (() => {
        window.location.href = '/town';
      }),
    // 페이지 이동 시에도 토스트가 유지되도록 설정
    autoClose: options?.autoClose || 5000, // 기본 5초
  };

  return toast.info(message, finalOptions);
};

// 인프라 이벤트 선택 결과 알림 함수 => ResultModal롷 대체하면 불필요함
export const showInfraResultNotice = (
  isOptimal: boolean,
  exp: number,
  coin: number,
  options?: ToastOptions,
) => {
  // 모달이 열려있다면 토스트를 표시하지 않음
  if (isModalOpen) {
    return null;
  }
  // 최적 해결책 여부에 따른 메시지
  const resultMessage = isOptimal
    ? '캐릭터가 행복해요! 🥰'
    : '캐릭터가 슬퍼요 😭';

  // 단순 텍스트 메시지로 구성 (줄바꿈을 위해 \n\n 사용)
  const fullMessage = `${resultMessage}\n\n 경험치 ${exp} 획득\n코인 ${coin} 획득`;

  // 최적 해결책 여부에 따라 다른 토스트 타입 사용
  const toastFn = isOptimal ? toast.success : toast.warning;

  // 단순 텍스트 메시지를 토스트에 표시
  return toastFn(fullMessage, {
    ...defaultOptions,
    ...options,
    // 페이지 이동 시에도 토스트가 유지되도록 설정
    autoClose: options?.autoClose || 5000,
    style: { whiteSpace: 'pre-line' }, // react-toastify CSS에서 줄바꿈을 인식하도록 스타일 추가
  });
};

// 마을 이름 변경 알림
// export const showTownNameChangeNotice = (newName: string, options?: ToastOptions) => {
//   return toast.success(`마을 이름이 "${newName}"으로 변경되었습니다.`, {
//     ...defaultOptions,
//     ...options
//   });
// };

// 일반 알림 함수
export const showNotice = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  options?: ToastOptions,
): string | number => {
  // 모달이 열려있다면 토스트를 표시하지 않음
  if (isModalOpen) {
    return -1; // 토스트가 표시되지 않았음을 나타내는 임의의 값
  }
  return toast[type](message, {
    ...defaultOptions,
    ...options,
    // 페이지 이동 시에도 토스트가 유지되도록 설정
    autoClose: options?.autoClose || 3000,
  });
};

// 로그아웃 시 모든 토스트 제거 함수
export const clearAllToasts = () => {
  toast.dismiss({ containerId: TOAST_CONTAINER_ID });
};

// ---------------필요한가?--------------
// ID로 토스트 업데이트 또는 닫기 유틸리티 함수
// export const updateToast = (
//   toastId: string | number,
//   message: string,
//   type: 'info' | 'success' | 'warning' | 'error',
// ) => {
//   return toast.update(toastId, {
//     render: message,
//     type,
//     autoClose: 5000,
//   });
// };

// export const dismissToast = (toastId: string | number) => {
//   toast.dismiss(toastId);
// };
