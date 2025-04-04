import { useEffect, useRef, memo } from 'react';

interface EventAlertProps {
  isActive: boolean;
  className?: string; // 위치 조정을 위한 선택적 props
}

const EventAlert = memo(({ isActive, className = '' }: EventAlertProps) => {
  // 디버깅을 위한 로그 추가
  console.log('EventAlert rendering, isActive:', isActive);

  const alertRef = useRef<HTMLDivElement>(null);

  // isActive가 변경될 때마다 애니메이션 재시작
  useEffect(() => {
    if (!isActive || !alertRef.current) return;

    // 애니메이션 재설정
    const resetAnimation = () => {
      if (!alertRef.current) return;

      // CSS 애니메이션 재시작을 위한 트릭
      alertRef.current.style.animation = 'none';
      // 강제 리플로우 발생
      void alertRef.current.offsetWidth;
      // 애니메이션 다시 설정
      alertRef.current.style.animation = 'bounce 1s infinite';
    };

    // 초기 애니메이션 설정
    resetAnimation();

    // 주기적으로 애니메이션 재설정
    const intervalId = setInterval(resetAnimation, 5000);

    // 메모리 누수 방지를 위한 클린업
    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);
  if (!isActive) return null;

  return (
    <div
      className={`absolute animate-bounce bg-red-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-base md:text-xl lg:text-2xl font-bold ${className}`}
    >
      !
    </div>
  );
});

export default EventAlert;
