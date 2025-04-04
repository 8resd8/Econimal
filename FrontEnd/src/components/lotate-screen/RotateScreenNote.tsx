import { useState, useEffect } from 'react';

const RotateScreenNotice = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  // 화면 방향 확인 함수
  const checkOrientation = () => {
    // screen.orientation API 사용 (최신 브라우저)
    if (window.screen && window.screen.orientation) {
      return window.screen.orientation.type.includes('portrait');
    }
    // window.orientation 사용 (iOS 지원)
    else if (window.orientation !== undefined) {
      return window.orientation === 0 || window.orientation === 180;
    }
    // 마지막 대안으로 창 크기 비율 사용
    else {
      return window.innerHeight > window.innerWidth;
    }
  };

  useEffect(() => {
    // 초기 방향 설정
    setIsPortrait(checkOrientation());

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setIsPortrait(checkOrientation());
    };

    const handleOrientationChange = () => {
      // 방향 변경 이벤트에 약간의 지연을 주어 안정성 확보
      setTimeout(() => {
        setIsPortrait(checkOrientation());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // 귀여운 애니메이션을 위한 웨이브 효과
    const waveInterval = setInterval(() => {
      setIsWaving((prev) => !prev);
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearInterval(waveInterval);
    };
  }, []);

  // 가로 모드일 때는 아무것도 표시하지 않음
  if (!isPortrait) {
    return null;
  }

  return (
    <div
      className='fixed top-0 left-0 w-full h-full bg-green-50 flex flex-col justify-center items-center'
      style={{ height: viewportHeight }}
    >
      {/* 귀여운 애니메이션 지구 캐릭터 */}
      <div className='mb-6 relative'>
        {/* 지구 몸통 */}
        <div className='w-40 h-40 bg-blue-300 rounded-full flex justify-center items-center relative overflow-hidden'>
          {/* 대륙 */}
          <div className='absolute top-5 left-7 w-16 h-12 bg-green-400 rounded-full transform rotate-12'></div>
          <div className='absolute bottom-6 right-4 w-20 h-14 bg-green-400 rounded-full transform -rotate-6'></div>
          <div className='absolute top-20 left-24 w-10 h-8 bg-green-400 rounded-full'></div>

          {/* 눈물 효과 - 애니메이션 */}
          <div className='absolute top-20 left-12 w-3 h-8 bg-blue-400 rounded-full animate-bounce opacity-80'></div>
          <div
            className='absolute top-20 right-12 w-3 h-6 bg-blue-400 rounded-full animate-bounce opacity-80'
            style={{ animationDelay: '0.3s' }}
          ></div>

          {/* 귀여운 눈과 눈동자 */}
          <div className='absolute top-14 left-12 w-8 h-8 bg-white rounded-full flex justify-center items-center'>
            <div className='w-4 h-4 bg-black rounded-full relative'>
              <div className='absolute top-0 left-0 w-2 h-2 bg-white rounded-full'></div>
            </div>
          </div>
          <div className='absolute top-14 right-12 w-8 h-8 bg-white rounded-full flex justify-center items-center'>
            <div className='w-4 h-4 bg-black rounded-full relative'>
              <div className='absolute top-0 left-0 w-2 h-2 bg-white rounded-full'></div>
            </div>
          </div>

          {/* 울고 있는 표정의 입 */}
          <div className='absolute top-24 left-1/2 transform -translate-x-1/2 w-16 h-8'>
            <div className='w-16 h-8 border-t-4 border-black rounded-t-full'></div>
          </div>

          {/* 볼터치 */}
          <div className='absolute top-20 left-6 w-5 h-3 bg-pink-300 rounded-full opacity-60'></div>
          <div className='absolute top-20 right-6 w-5 h-3 bg-pink-300 rounded-full opacity-60'></div>
        </div>

        {/* 귀여운 팔 - 웨이브 애니메이션 */}
        <div
          className={`absolute -left-4 top-16 transition-transform duration-300 ${
            isWaving ? 'transform -rotate-12' : 'transform rotate-6'
          }`}
        >
          <div className='w-8 h-16 bg-blue-300 rounded-full'></div>
        </div>
        <div
          className={`absolute -right-4 top-16 transition-transform duration-300 ${
            isWaving ? 'transform rotate-12' : 'transform -rotate-6'
          }`}
        >
          <div className='w-8 h-16 bg-blue-300 rounded-full'></div>
        </div>

        {/* 회전 표시 아이콘 애니메이션 */}
        <div className='absolute -right-6 -top-2'>
          <div className='relative'>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='animate-spin'
                style={{ animationDuration: '3s' }}
              >
                <path
                  d='M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3'
                  stroke='#22C55E'
                  strokeWidth='3'
                  strokeLinecap='round'
                />
                <path
                  d='M12 3L16 7M12 3L8 7'
                  stroke='#22C55E'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>

            <div
              className='w-10 h-10 bg-green-200 rounded-full flex items-center justify-center absolute -top-4 -right-2 animate-bounce'
              style={{ animationDuration: '1.5s' }}
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M9.5 15L5 10.5L9.5 6'
                  stroke='#22C55E'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M5 10.5H19'
                  stroke='#22C55E'
                  strokeWidth='3'
                  strokeLinecap='round'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 텍스트 */}
      <div className='w-72 text-center'>
        <h2 className='text-2xl font-bold text-green-600 mb-2'>
          화면을 가로로!
        </h2>
        <p className='text-base text-green-500 mb-3'>
          더 재미있게 볼 수 있어요
        </p>
      </div>

      {/* 디버그 정보 (테스트 중에만 사용, 실제로는 제거) */}
      <div className='text-xs text-gray-500 mb-2'>
        {`화면 방향: ${isPortrait ? '세로' : '가로'}, 
         크기: ${window.innerWidth}x${window.innerHeight}`}
      </div>

      {/* 귀여운 버튼 */}
      <button
        className='mt-2 px-6 py-3 bg-green-400 text-white text-lg rounded-full font-medium shadow-md hover:bg-green-500 transition-colors'
        onClick={() => window.location.reload()}
      >
        다시 볼래요
      </button>
    </div>
  );
};

export default RotateScreenNotice;
