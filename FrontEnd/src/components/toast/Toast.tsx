import { useState } from 'react';
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

const Toast =
  () =>
  ({
    defaultMessage = '알림 메시지입니다',
    position = 'top-right',
    autoClose = 5000,
    className = '',
    buttonText = '기본 토스트',
    onToastClick,
  }: ToastProps) => {
    const [toastId, setToastId] = useState<string | number | null>(null);

    const handleClick = () => {
      // 이미 표시된 토스트가 있으면 닫음
      if (toastId) {
        toast.dismiss(toastId);
        setToastId(null);
        return;
      }

      // 새 토스트 생성 (showNotice 유틸리티 함수 활용)
      const id = showNotice(defaultMessage, 'info', {
        position,
        autoClose,
        onClose: () => setToastId(null),
        onClick: onToastClick, // onClick 이벤트 핸들러 추가
        // 드래그 및 호버 옵션 명시적으로 지정
        draggable: false,
        pauseOnHover: false,
      });

      setToastId(id);
    };

    return (
      <div className={className}>
        <Button onClick={handleClick}>{buttonText}</Button>
        {/* ToastContainer가 App 컴포넌트에 이미 포함되어 있다면 아래 줄은 제거 */}
        {/* <ToastContainer /> */}
      </div>
    );
  };
Toast;
