import { toast, ToastOptions } from 'react-toastify';
import { EcoType } from '@/pages/town/features/infraApi';

// 기본 토스트 옵션
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// 인프라 타입별 메시지 맵
const infraEventMessages: Record<EcoType, string> = {
  ELECTRICITY: '가정에 문제가 발생했습니다!',
  WATER: '하수처리장에 문제가 발생했습니다!',
  GAS: '공장에 문제가 발생했습니다!',
  COURT: '법원에 문제가 발생했습니다!',
};

// 인프라 이벤트 알림 함수
export const showInfraEventNotice = (
  ecoType: string,
  options?: ToastOptions, // 추가 토스트 옵션
) => {
  const message =
    infraEventMessages[
      (ecoType as EcoType) || '마을에 새로운 문제가 발생했습니다!'
    ];
  return toast.info(message, { ...defaultOptions, ...options });
};

// 인프라 이벤트 선택 결과 알림 함수

export const showInfraResultNotice = (
  isOptimal: boolean,
  carbon: number,
  exp: number,
  coin: number,
  options?: ToastOptions,
) => {
  // 최적 해결책 여부에 따른 메시지
  const resultMessage = isOptimal
    ? '문제를 최적으로 해결했습니다! 😁'
    : '더 좋은 방법이 있었습니다. 😢';

  // 얻은 보상 메시지
  const rewardMessage = `
    ${carbon < 0 ? `탄소 ${Math.abs(carbon)} 감소` : `탄소 ${carbon} 증가`}
    경험치 ${exp} 획득
    코인 ${coin} 획득
  `;

  // 최적 해결책 여부에 따라 다른 토스트 타입 사용
  const toastFn = isOptimal ? toast.success : toast.warning;
  return toastFn(`${resultMessage}\n${rewardMessage}`, {
    ...defaultOptions,
    ...options,
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
  return toast[type](message, { ...defaultOptions, ...options });
};

// --------------필요한가--------------
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
