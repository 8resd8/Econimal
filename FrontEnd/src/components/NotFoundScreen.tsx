interface NotFoundScreenProps {
  message?: string;
  subMessage?: string;
  homeText?: string;
  onGoHome?: () => void;
}

/**
 * 에코니멀 서비스를 위한 404 에러 스크린 컴포넌트
 * - 초등학생 타겟으로 친환경 요소를 반영한 디자인
 * - 페이지를 찾을 수 없을 때 사용자에게 친근한 안내 제공
 */
const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  message = '페이지를 찾을 수 없습니다',
  subMessage = '요청하신 페이지가 삭제되었거나 주소가 변경되었어요.',
  homeText = '홈으로 돌아가기',
  onGoHome = () => (window.location.href = '/'),
}) => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center w-full h-screen bg-green-50'>
      {/* 404 애니메이션 아이콘 */}
      <div className='relative w-40 h-40 mb-6'>
        {/* 지구 아이콘 */}
        <div className='absolute w-28 h-28 rounded-full bg-blue-400 border-4 border-green-300 overflow-hidden flex items-center justify-center mx-auto left-1/2 -translate-x-1/2'>
          {/* 지구 대륙 */}
          <div className='absolute w-12 h-8 bg-green-500 rounded-full left-3 top-5 rotate-12'></div>
          <div className='absolute w-8 h-7 bg-green-500 rounded-full right-3 top-7'></div>
          <div className='absolute w-14 h-6 bg-green-500 rounded-full right-7 bottom-5 rotate-12'></div>
          <div className='absolute w-10 h-9 bg-green-500 rounded-full left-6 bottom-3 rotate-45'></div>

          {/* 물음표 오버레이 */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-6xl font-bold text-white opacity-60 drop-shadow-lg'>
              ?
            </span>
          </div>
        </div>

        {/* 잎 장식 */}
        <div className='absolute -top-2 -left-2 w-10 h-10 bg-green-400 rounded-br-full rounded-bl-full rounded-tl-full rotate-45 animate-[bounce_3s_ease-in-out_infinite]'></div>
        <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-br-full rounded-bl-full rounded-tl-full rotate-90 animate-[bounce_2.5s_ease-in-out_infinite_0.5s]'></div>

        {/* 404 텍스트 */}
        <div className='absolute -top-8 right-0 text-5xl font-bold text-green-700 opacity-50'>
          404
        </div>
      </div>

      {/* 에러 메시지 */}
      <h1 className='text-2xl font-bold text-green-800 mb-3'>{message}</h1>
      <p className='text-md text-green-700 mb-8 text-center max-w-xs px-5'>
        {subMessage}
      </p>

      {/* 홈으로 버튼 */}
      <button
        className='px-8 py-3 bg-teal-500 text-white rounded-full font-medium flex items-center shadow-md hover:bg-teal-600 transition-colors'
        onClick={onGoHome}
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
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          ></path>
        </svg>
        {homeText}
      </button>

      {/* 환경 꿀팁 */}
      {/* <div className='absolute bottom-20 left-0 right-0 text-center'>
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

//   return tips[Math.floor(Math.random() * tips.length)];
// };

export default NotFoundScreen;
