interface NetworkErrorScreenProps {
  message?: string;
  subMessage?: string;
  retryText?: string;
  onRetry?: () => void;
}

/**
 * 에코니멀 서비스를 위한 네트워크 에러 스크린 컴포넌트
 * - 초등학생 타겟으로 친환경 요소를 반영한 디자인
 * - 네트워크 연결 실패 시 사용자에게 친근한 안내 제공
 */
const NetworkErrorScreen: React.FC<NetworkErrorScreenProps> = ({
  message = '네트워크에 접속할 수 없습니다',
  subMessage = '네트워크 연결 상태를 확인해 주세요.',
  retryText = '다시 시도하기',
  onRetry = () => window.location.reload(),
}) => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center w-full h-screen bg-green-50'>
      {/* 에러 아이콘 */}
      <div className='relative w-32 h-32 mb-6'>
        {/* 전원 플러그 아이콘 */}
        <div className='relative w-24 h-24 mx-auto'>
          {/* 플러그 몸체 */}
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-10 bg-green-200 rounded-t-lg border-2 border-green-400'></div>

          {/* 플러그 선 */}
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 w-3 h-12 bg-gray-300 rounded-full'></div>

          {/* 플러그 핀 */}
          <div className='absolute bottom-3 left-1/3 w-3 h-8 bg-green-500 rounded-full'></div>
          <div className='absolute bottom-3 right-1/3 w-3 h-8 bg-green-500 rounded-full'></div>

          {/* 알림 말풍선 */}
          <div className='absolute -top-4 -left-6 w-12 h-12 bg-green-200 rounded-full flex items-center justify-center border-2 border-green-400'>
            <span className='text-2xl text-green-700 font-bold'>!</span>
          </div>

          {/* 신호 아이콘 */}
          <div className='absolute top-2 right-1 flex flex-col items-center'>
            <div className='w-8 h-8 border-2 border-green-400 rounded-full relative'>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-5 h-1 bg-green-400 rounded-full'></div>
                <div className='absolute w-1 h-5 bg-green-400 rounded-full opacity-50'></div>
              </div>
            </div>
            <div className='mt-1 w-6 h-1 bg-green-400 rounded-full opacity-25'></div>
            <div className='mt-1 w-4 h-1 bg-green-400 rounded-full opacity-25'></div>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      <h1 className='text-2xl font-bold text-green-800 mb-3'>{message}</h1>
      <p className='text-md text-green-700 mb-8 text-center max-w-xs px-5'>
        {subMessage}
      </p>

      {/* 재시도 버튼 */}
      <button
        className='px-8 py-3 bg-teal-500 text-white rounded-full font-medium flex items-center shadow-md hover:bg-teal-600 transition-colors'
        onClick={onRetry}
      >
        <svg
          className='w-5 h-5 mr-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
          ></path>
        </svg>
        {retryText}
      </button>

      {/* 환경 꿀팁 */}
      {/* <div className='absolute bottom-5 left-0 right-0 text-center'>
        <p className='text-sm text-green-700 max-w-xs mx-auto'>{getTip()}</p>
      </div> */}
    </div>
  );
};

// 환경 관련 꿀팁 랜덤 제공 (기존 LoadingScreen과 동일하게 유지)
// const getTip = () => {
//   const tips = [
//     '알고 계셨나요? 이면지를 재활용하면 나무를 보호할 수 있어요!',
//     '전기를 절약하면 이산화탄소 배출량을 줄일 수 있어요!',
//     '물을 아껴 쓰면 소중한 지구 자원을 보호할 수 있어요!',
//     '분리수거는 지구를 깨끗하게 만드는 첫걸음이에요!',
//     '가까운 거리는 걸어다니면 공기가 맑아져요!',
//     '장바구니를 사용하면 비닐봉지 사용을 줄일 수 있어요!',
//     '음식물 쓰레기를 줄이면 메탄가스 발생을 줄일 수 있어요!',
//     '재활용품은 새로운 보물로 태어날 수 있어요!',
//   ];
//
//   return tips[Math.floor(Math.random() * tips.length)];
// };

export default NetworkErrorScreen;
