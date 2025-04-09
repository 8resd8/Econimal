import { memo, useEffect, useRef } from 'react';

interface EventAlertProps {
  isActive: boolean;
  className?: string;
}

const EventAlert = memo(({ isActive, className = '' }: EventAlertProps) => {
  // isActive가 false면 아무것도 렌더링하지 않음
  if (!isActive) return null;

  // 애니메이션 설정을 위한 ref
  const alertRef = useRef<HTMLDivElement>(null);

  // 컴포넌트가 마운트되면 즉시 애니메이션 적용
  useEffect(() => {
    if (alertRef.current) {
      // 초기 transform 설정으로 애니메이션이 즉시 시작될 수 있게 함
      alertRef.current.style.transform = 'translateY(0px)';
    }
  }, []);

  return (
    <div
      className={`absolute animate-bounce bg-red-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-base md:text-xl lg:text-2xl font-bold ${className}`}
      // 애니메이션 강제 적용 (CSS 변수 활용)
      style={{
        // 애니메이션 속성 직접 지정하여 Tailwind 기본값 덮어쓰기
        animationDuration: '1s',
        animationDelay: '0s', // 지연 없이 즉시 시작
        animationIterationCount: 'infinite',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
        animationFillMode: 'both', // 애니메이션 시작 전에도 첫 프레임 적용
        willChange: 'transform', // GPU 가속 활성화
      }}
    >
      !
    </div>
  );
});

export default EventAlert;
