interface EventAlertProps {
  isActive: boolean;
  // 위치 조정을 위한 선택적 props
  className?: string;
}

const EventAlert = ({ isActive, className = '' }: EventAlertProps) => {
  // 디버깅을 위한 로그 추가
  console.log('EventAlert rendering, isActive:', isActive);

  if (!isActive) return null;

  return (
    <div
      // className={`absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse ${className}`}  // 희미하게 깜빡
      // 퍼센트로 하려니 글씨 스타일은 별도로 반응형 설정을 해야하는...
      // className={`absolute w-6 h-6 bg-red-500 rounded-full border-white border-2 flex items-center justify-center text-white font-bold animate-bounce ${className}`} // 흰 테두리
      className={`absolute bg-red-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-base md:text-xl lg:text-2xl font-bold animate-bounce ${className}`} // 바운스
    >
      !
    </div>
  );
};
export default EventAlert;
