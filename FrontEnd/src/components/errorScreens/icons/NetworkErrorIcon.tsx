// src/components/errorScreens/icons/NetworkErrorIcon.tsx

/**
 * 네트워크 에러 아이콘 컴포넌트 - 콘센트와 플러그가 분리된 디자인
 */
const NetworkErrorIcon = () => {
  return (
    <div className='relative w-24 h-24 mx-auto'>
      {/* 콘센트 (벽면) */}
      <div className='absolute top-2 right-2 w-10 h-16 bg-gray-200 rounded-md border-2 border-gray-400 shadow-md'>
        {/* 콘센트 구멍 */}
        <div className='absolute top-3 left-1/2 -translate-x-1/2 flex space-x-2'>
          <div className='w-2 h-6 bg-gray-700 rounded-sm'></div>
          <div className='w-2 h-6 bg-gray-700 rounded-sm'></div>
        </div>
      </div>

      {/* 플러그 (분리된 상태) */}
      <div className='absolute bottom-0 left-3 w-12 h-8 bg-green-200 rounded-sm border-2 border-green-400 shadow-md transform rotate-12'>
        {/* 플러그 핀 */}
        <div className='absolute -top-5 left-2 w-2 h-6 bg-green-500 rounded-sm'></div>
        <div className='absolute -top-5 right-2 w-2 h-6 bg-green-500 rounded-sm'></div>

        {/* 플러그 눈 (귀여운 요소) */}
        <div className='absolute top-1 left-2 w-2 h-2 bg-white rounded-full border border-gray-800'></div>
        <div className='absolute top-1 right-2 w-2 h-2 bg-white rounded-full border border-gray-800'></div>

        {/* 플러그 입 - 슬픈 표정 */}
        <div className='absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-gray-800 rounded-full transform rotate-[190deg]'></div>
      </div>

      {/* 전원 코드 */}
      <div className='absolute bottom-7 left-9 w-16 h-3 bg-green-200 rounded-full border border-green-400 transform rotate-[30deg]'></div>

      {/* 번개 아이콘 */}
      <div className='absolute top-2 left-1 text-yellow-500 text-2xl animate-bounce'>
        ⚡
      </div>

      {/* 느낌표 (알림) */}
      <div className='absolute -top-4 -left-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-md animate-pulse'>
        <span className='text-lg text-yellow-700 font-bold'>!</span>
      </div>

      {/* 끊어진 연결 표시 */}
      <div className='absolute top-10 left-1/2 -translate-x-1/2'>
        <div className='w-8 h-2 bg-red-500 rounded-full transform rotate-45'></div>
        <div className='w-8 h-2 bg-red-500 rounded-full transform -rotate-45 -mt-2'></div>
      </div>
    </div>
  );
};

export default NetworkErrorIcon;
