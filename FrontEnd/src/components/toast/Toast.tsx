import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { showNotice } from './toastUtil';

interface ToastProps {
  defaultMessage?: string;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
  autoClose?: number;
  className?: string;
  buttonText?: string;
  onToastClick?: () => void;
}

// 직접 컴포넌트를 정의하고 나중에 memo로 내보내기
const ToastComponent = ({
  defaultMessage = '알림 메시지입니다',
  position = 'top-right',
  autoClose = 2000,
  className = '',
  buttonText = '기본 토스트',
  onToastClick,
}: ToastProps) => {
  const [toastId, setToastId] = useState<string | number | null>(null);

  // useCallback으로 함수 메모이제이션
  const handleClick = useCallback(() => {
    // 이미 표시된 토스트가 있으면 닫음
    if (toastId) {
      toast.dismiss(toastId);
      setToastId(null);
      return;
    }

    // 새 토스트 생성 (showNotice 유틸리티 함수 활용)
    // 페이지 이동 시에도 토스트가 유지되도록 설정
    const id = showNotice(defaultMessage, 'info', {
      position,
      autoClose, // 자동 닫힘 시간 설정
      onClose: () => setToastId(null),
      onClick: onToastClick, // onClick 이벤트 핸들러 추가
      // 페이지 전환 시 토스트 유지를 위한 설정
      draggable: false,
      pauseOnHover: false,
      // 페이지 이동 시에도 토스트가 유지되도록 설정
      closeButton: true, // 명시적으로 닫기 버튼 표시
      progress: undefined, // 기본 진행 표시줄 사용
    });

    setToastId(id);
  }, [toastId, defaultMessage, position, autoClose, onToastClick]);

  return (
    <div className={className}>
      <Button onClick={handleClick}>{buttonText}</Button>
    </div>
  );
};

// 메모이제이션된 컴포넌트로 내보내기
const Toast = ToastComponent;

export default Toast;
