interface LoadingScreenProps {
  message?: string;
}

/*
 에코니멀 서비스를 위한 로딩 스크린 컴포넌트
 - 초등학생 타겟으로 친환경 요소를 반영한 애니메이션
 - Suspense 경계에서 fallback으로 사용됨
 */

const LoadingScreen = ({
  message = '에코니멀 세상을 불러오는 중...',
}: LoadingScreenProps) => {
  console.log('LoadingScreen rendered!'); // 이 로그가 표시되면 작동 중
  // z-index를 9999로 높여서 다른 모든 요소보다 위에 표시되도록 함
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center w-full h-screen bg-green-50 z-[9999]'>
      <div className='relative w-32 h-32 mb-6'>
        {/* 나뭇잎 스피너 */}
        <div className='absolute top-1/2 left-1/4 w-10 h-10 bg-green-500 rounded-br-full rounded-bl-full rounded-tr-full animate-[spin_3s_ease-in-out_infinite] origin-center'>
          <div className='absolute top-[45%] left-[45%] w-2.5 h-5 bg-green-800 rounded-md rotate-[-45deg]'></div>
        </div>

        {/* 물방울 스피너 */}
        <div className='absolute top-1/3 left-1/2 w-8 h-8 bg-blue-500 rounded-br-full rounded-bl-full rounded-tr-full rotate-45 animate-[bounce_2.5s_ease-in-out_infinite]'></div>

        {/* 태양 스피너 */}
        <div className='absolute top-2/5 right-1/5 w-10 h-10 bg-amber-400 rounded-full animate-[spin_4s_linear_infinite] shadow-[0_0_15px_rgba(255,193,7,0.8)]'>
          <div className='absolute -top-1 -left-1 w-[calc(100%+8px)] h-[calc(100%+8px)] rounded-full border-4 border-amber-400/50 box-content'></div>
        </div>
      </div>

      <p className='text-xl font-bold text-green-800 mb-4'>{message}</p>

      <p className='text-sm text-green-700 max-w-xs text-center px-5'>
        {getTip()}
      </p>
    </div>
  );
};

// 환경 관련 꿀팁 랜덤 제공
const getTip = () => {
  const tips = [
    '알고 계셨나요? 이면지를 재활용하면 나무를 보호할 수 있어요!',
    '전기를 절약하면 이산화탄소 배출량을 줄일 수 있어요!',
    '물을 아껴 쓰면 소중한 지구 자원을 보호할 수 있어요!',
    '분리수거는 지구를 깨끗하게 만드는 첫걸음이에요!',
    '가까운 거리는 걸어다니면 공기가 맑아져요!',
    '장바구니를 사용하면 비닐봉지 사용을 줄일 수 있어요!',
    '음식물 쓰레기를 줄이면 메탄가스 발생을 줄일 수 있어요!',
    '재활용품은 새로운 보물로 태어날 수 있어요!',
  ];

  return tips[Math.floor(Math.random() * tips.length)];
};

export default LoadingScreen;
