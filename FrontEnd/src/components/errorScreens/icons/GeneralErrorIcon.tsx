const GeneralErrorIcon = () => {
  return (
    <div className='relative w-24 h-24 mx-auto'>
      {/* 메인 아이콘 - 연필과 종이 */}
      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-green-100 rounded-md border-2 border-green-400 flex items-center justify-center overflow-hidden'>
        {/* 종이에 그려진 물음표와 느낌표 */}
        <div className='absolute top-2 left-3 text-xl font-bold text-green-600'>
          ?
        </div>
        <div className='absolute top-2 right-3 text-xl font-bold text-yellow-600'>
          !
        </div>

        {/* 종이의 구겨진 선 */}
        <div className='absolute top-8 left-2 w-12 h-1 bg-green-200 rounded-full transform rotate-2'></div>
        <div className='absolute top-12 left-3 w-10 h-1 bg-green-200 rounded-full transform -rotate-3'></div>
        <div className='absolute top-16 left-1 w-14 h-1 bg-green-200 rounded-full transform rotate-1'></div>
      </div>

      {/* 연필 */}
      <div className='absolute top-1 right-0 w-4 h-16 bg-yellow-300 rounded-t-sm rounded-b-md transform rotate-12 border border-yellow-600'>
        {/* 연필심 */}
        <div className='absolute top-0 left-0 right-0 h-2 bg-gray-700 rounded-t-sm'></div>
        {/* 연필 지우개 */}
        <div className='absolute bottom-0 left-0 right-0 h-3 bg-pink-300 rounded-b-md border-t border-gray-400'></div>
      </div>

      {/* 표정 */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center'>
        <div className='flex space-x-6 mb-2'>
          <div className='w-2 h-2 bg-green-600 rounded-full'></div>
          <div className='w-2 h-2 bg-green-600 rounded-full'></div>
        </div>
        <div className='w-6 h-2 bg-green-600 rounded-b-full transform rotate-180'></div>
      </div>

      {/* 물음표 장식 */}
      <div className='absolute -top-4 -left-2 w-8 h-8 bg-blue-100 rounded-full border-2 border-blue-300 flex items-center justify-center animate-bounce'>
        <span className='text-lg font-bold text-blue-500'>?</span>
      </div>

      {/* 느낌표 장식 */}
      <div className='absolute -top-2 -right-2 w-7 h-7 bg-yellow-100 rounded-full border-2 border-yellow-300 flex items-center justify-center animate-pulse delay-300'>
        <span className='text-lg font-bold text-yellow-500'>!</span>
      </div>

      {/* 톱니바퀴 장식 - 에러 유형을 나타냄 */}
      <div className='absolute bottom-0 -right-4 w-6 h-6 border-4 border-green-500 rounded-full animate-spin animate-duration-[3s]'></div>
      <div className='absolute bottom-0 -left-4 w-5 h-5 border-3 border-green-400 rounded-full animate-spin animate-duration-[4s] animate-reverse'></div>
    </div>
  );
};

export default GeneralErrorIcon;
