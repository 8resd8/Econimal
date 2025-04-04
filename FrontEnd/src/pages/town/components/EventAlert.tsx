import { useEffect, useState, memo } from 'react';

interface EventAlertProps {
  isActive: boolean;
  className?: string; // 위치 조정을 위한 선택적 props
}

const EventAlert = memo(({ isActive, className = '' }: EventAlertProps) => {
  console.log('EventAlert rendering, isActive:', isActive); // 디버깅을 위한 로그 추가
  const [key, setKey] = useState(0); // 애니메이션 리셋을 위한 상태
  // const [visible, setVisible] = useState(true); // 깜빡임 상태 (fallback 애니메이션)
  const forceRemount = () => setKey((prev) => prev + 1); // Remount 트리거 함수

  // 초기 마운트와 isActive 변경 시 애니메이션 리셋
  useEffect(() => {
    if (!isActive) return;
    forceRemount();
  }, [isActive]);

  // 주기적으로 애니메이션 리셋
  useEffect(() => {
    if (!isActive) return;

    // 주기적으로 DOM 요소 재생성 (3초마다)
    const remountInterval = setInterval(forceRemount, 3000);

    return () => {
      clearInterval(remountInterval);
    };
  }, [isActive]);

  // 추가 안전장치: 전역 이벤트 리스너를 이용한 가시성 변경 감지
  useEffect(() => {
    if (!isActive) return;

    // 페이지 가시성 변경 시 (탭 전환 등) 애니메이션 리셋
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        forceRemount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      key={key}
      className={`absolute animate-bounce bg-red-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-base md:text-xl lg:text-2xl font-bold ${className}`}
    >
      !
    </div>
  );
});

export default EventAlert;
