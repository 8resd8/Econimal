interface EventAlertProps {
  isActive: boolean;
  className?: string; // 위치 조정을 위한 선택적 props
}

const EventAlert = ({ isActive, className = '' }: EventAlertProps) => {
  // 디버깅을 위한 로그 추가
  console.log('EventAlert rendering, isActive:', isActive);

  if (!isActive) return null;

  return (
    <div
      className={`absolute animate-bounce bg-red-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-base md:text-xl lg:text-2xl font-bold ${className}`}
    >
      !
    </div>
  );
};
export default EventAlert;
