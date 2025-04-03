import { useState, useEffect } from 'react';

const RotateScreenNotice = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth,
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isPortrait) {
    return null;
  }

  return (
    <div
      className='fixed top-0 left-0 w-full h-full bg-green-50 flex flex-col justify-center items-center'
      style={{ height: viewportHeight }}
    >
      <div className='bg-white rounded-3xl shadow-lg p-6 w-64 flex flex-col items-center border-4 border-green-200'>
        {/* 더 귀여운 지구 캐릭터 */}
        <div className='mb-4 relative'>
          {/* 단순한 지구 */}
          <div className='w-36 h-36 bg-blue-400 rounded-full flex justify-center items-center relative'>
            {/* 간단한 대륙 */}
            <div className='absolute top-6 left-6 w-16 h-10 bg-green-500 rounded-full'></div>
            <div className='absolute bottom-8 right-8 w-12 h-8 bg-green-500 rounded-full'></div>

            {/* 더 귀여운 눈과 눈동자 - 조금 더 작고 귀여운 버전 */}
            <div className='absolute top-13 left-11 w-4 h-4 bg-white rounded-full'></div>
            <div className='absolute top-13 right-11 w-4 h-4 bg-white rounded-full'></div>
            <div className='absolute top-13 left-11.5 w-2 h-2 bg-black rounded-full'></div>
            <div className='absolute top-13 right-11.5 w-2 h-2 bg-black rounded-full'></div>
            <div className='absolute top-12 left-11 w-1 h-1 bg-white rounded-full'></div>
            <div className='absolute top-12 right-11 w-1 h-1 bg-white rounded-full'></div>

            {/* 부드러운 웃는 입 - 더 작고 귀여운 버전 */}
            <div className='absolute bottom-12 left-1/2 transform -translate-x-1/2 w-14 h-6'>
              <div className='w-10 h-8 mx-auto border-b-3 border-white rounded-full'></div>
            </div>

            {/* 볼터치 - 더 작고 귀여운 버전 */}
            <div className='absolute bottom-13 left-8 w-3 h-2 bg-pink-200 rounded-full opacity-60'></div>
            <div className='absolute bottom-13 right-8 w-3 h-2 bg-pink-200 rounded-full opacity-60'></div>
          </div>

          {/* 회전 표시 - 더 귀여운 버전 */}
          <div className='absolute -right-2 top-16'>
            <div className='relative'>
              {/* 더 작고 부드러운 회전 아이콘 */}
              <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-pulse'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M6 10C6 10 10 6 15 8'
                    stroke='#22C55E'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M17 7L15 11L11 9'
                    stroke='#22C55E'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>

              {/* 두 번째 회전 아이콘 */}
              <div
                className='w-6 h-6 bg-green-200 rounded-full flex items-center justify-center absolute -top-4 right-2 animate-pulse'
                style={{ animationDelay: '0.4s' }}
              >
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M6 10C6 10 10 6 15 8'
                    stroke='#22C55E'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M17 7L15 11L11 9'
                    stroke='#22C55E'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 텍스트 - 더 명확하고 크게 */}
        <div className='w-full text-center'>
          <h2 className='text-xl font-bold text-green-600 mb-1'>
            화면을 가로로!
          </h2>
          <p className='text-base text-green-500 mb-3'>
            더 재미있게 볼 수 있어요
          </p>
        </div>

        {/* 단순한 새로고침 버튼 */}
        <button
          className='mt-2 px-5 py-2.5 bg-green-400 text-white text-lg rounded-full font-medium shadow-md hover:bg-green-500 transition-colors'
          onClick={() => window.location.reload()}
        >
          다시 볼래요
        </button>
      </div>
    </div>
  );
};

export default RotateScreenNotice;
