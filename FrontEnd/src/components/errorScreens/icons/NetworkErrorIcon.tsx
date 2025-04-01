// 네트워크 에러 아이콘 컴포넌트
const NetworkErrorIcon = () => {
  return (
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
  );
};

export default NetworkErrorIcon;
