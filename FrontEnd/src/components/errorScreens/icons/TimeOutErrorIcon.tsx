// 타임아웃 에러 아이콘 컴포넌트
const TimeoutErrorIcon = () => {
  return (
    <div className='relative w-24 h-24 mx-auto'>
      {/* 시계 아이콘 */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='relative'>
          {/* 시계 외형 */}
          <div className='w-16 h-16 bg-green-200 rounded-full border-2 border-green-400 flex items-center justify-center'>
            {/* 시계 중앙 */}
            <div className='w-2 h-2 bg-green-600 rounded-full'></div>

            {/* 시계 바늘 */}
            <div className='absolute w-1 h-7 bg-green-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-bottom rotate-45'></div>
            <div className='absolute w-1 h-5 bg-green-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-bottom -rotate-45'></div>
          </div>

          {/* 시계 위 장식 */}
          <div className='absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-400 rounded-sm'></div>
        </div>
      </div>

      {/* 느낌표 표시 */}
      <div className='absolute -top-4 -right-4 w-10 h-10 bg-yellow-300 rounded-full border-2 border-yellow-500 flex items-center justify-center'>
        <span className='text-xl text-yellow-700 font-bold'>!</span>
      </div>
    </div>
  );
};
export default TimeoutErrorIcon;
