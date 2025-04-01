// 서버 에러 아이콘 컴포넌트
const ServerErrorIcon = () => {
  return (
    <div className='relative w-24 h-24 mx-auto'>
      {/* 서버 아이콘 */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='w-16 h-20 bg-green-200 rounded-md border-2 border-green-400 flex flex-col items-center justify-center relative'>
          {/* 서버 표시등 */}
          <div className='absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>

          {/* 서버 슬롯 */}
          <div className='w-12 h-2 bg-green-300 rounded-sm my-1'></div>
          <div className='w-12 h-2 bg-green-300 rounded-sm my-1'></div>
          <div className='w-12 h-2 bg-green-300 rounded-sm my-1'></div>

          {/* 표정 */}
          <div className='absolute bottom-3 w-10 h-6'>
            <div className='flex justify-between mt-1'>
              <div className='w-2 h-2 bg-green-600 rounded-full'></div>
              <div className='w-2 h-2 bg-green-600 rounded-full'></div>
            </div>
            <div className='w-6 h-2 bg-green-600 rounded-full mx-auto mt-1 transform rotate-180'></div>
          </div>
        </div>

        {/* 구름 아이콘 - 서버 문제 표시 */}
        <div className='absolute -top-6 -right-6 w-12 h-12'>
          <div className='w-10 h-10 bg-green-200 rounded-full border-2 border-green-400 flex items-center justify-center'>
            <span className='text-xl text-green-700 font-bold'>?</span>
          </div>
          <div className='absolute top-4 left-1 w-3 h-3 bg-green-200 rounded-full border-2 border-green-400'></div>
          <div className='absolute top-6 left-4 w-2 h-2 bg-green-200 rounded-full border-2 border-green-400'></div>
        </div>
      </div>
    </div>
  );
};
export default ServerErrorIcon;
