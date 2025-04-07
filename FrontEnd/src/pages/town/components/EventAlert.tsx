import { useEffect, useState, useRef, useCallback } from 'react';

interface EventAlertProps {
  isActive: boolean;
  className?: string;
}

const EventAlert = ({ isActive, className = '' }: EventAlertProps) => {
  // 디버깅용 로그는 개발환경에서만 출력하도록 변경
  if (process.env.NODE_ENV === 'development') {
    console.log('EventAlert rendering, isActive:', isActive);
  }

  const [key, setKey] = useState(0);
  // 이전 isActive 상태를 추적하는 ref 추가
  const prevIsActiveRef = useRef(isActive);
  // 인터벌 ID를 저장하는 ref 추가
  const intervalRef = useRef<number | null>(null);

  // forceRemount를 useCallback으로 최적화
  const forceRemount = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  // isActive 변경 시 애니메이션 리셋 로직 개선
  useEffect(() => {
    // isActive가 false->true로 변경된 경우에만 리마운트
    if (isActive && !prevIsActiveRef.current) {
      forceRemount();
    }
    prevIsActiveRef.current = isActive;

    if (isActive) {
      // 이미 실행 중인 인터벌이 있다면 제거 후 재설정
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }

      // 참조에 인터벌 ID 저장
      intervalRef.current = window.setInterval(forceRemount, 3000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, forceRemount]);

  // 별도 가시성 변경 이벤트 핸들러 최적화
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        forceRemount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, forceRemount]);

  if (!isActive) return null;

  return (
    <div
      key={key}
      className={`absolute animate-bounce bg-red-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-base md:text-xl lg:text-2xl font-bold ${className}`}
    >
      !
    </div>
  );
};

export default EventAlert;
