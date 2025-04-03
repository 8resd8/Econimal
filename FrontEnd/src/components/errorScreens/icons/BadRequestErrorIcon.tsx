// 클라이언트 측 오류(400)를 위한 아이콘 컴포넌트
const BadRequestErrorIcon = () => {
  return (
    <div className='relative w-24 h-24 mx-auto'>
      {/* 문서 아이콘 */}
      <div className='absolute w-16 h-20 bg-orange-100 rounded-md border-2 border-orange-300 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center'>
        {/* 문서 줄 */}
        <div className='w-10 h-1 bg-orange-200 rounded-sm my-1'></div>
        <div className='w-10 h-1 bg-orange-200 rounded-sm my-1'></div>
        <div className='w-10 h-1 bg-orange-200 rounded-sm my-1'></div>

        {/* 400 표시 */}
        <div className='absolute top-3 left-1/2 -translate-x-1/2 font-bold text-orange-500 text-sm'>
          400
        </div>

        {/* 표정 (혼란스러운 표정) */}
        <div className='absolute bottom-4 w-10 h-6'>
          <div className='flex justify-between mt-1'>
            <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
            <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
          </div>
          <div className='w-5 h-2 bg-orange-500 mx-auto mt-1 flex items-center justify-center'>
            <div className='w-3 h-0.5 bg-orange-100'></div>
          </div>
        </div>
      </div>

      {/* 물음표 장식 */}
      <div className='absolute -top-3 -right-3 w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center border-2 border-orange-300 animate-pulse'>
        <span className='text-lg font-bold text-orange-600'>?</span>
      </div>

      {/* 펜 아이콘 - 클라이언트 측 입력 문제를 나타냄 */}
      <div className='absolute -bottom-2 -left-2 w-8 h-8 transform rotate-45'>
        <div className='w-2 h-8 bg-orange-400 rounded-t-sm'></div>
        <div
          className='absolute top-0 left-0 w-0 h-0 border-solid border-transparent border-b-orange-500 border-r-orange-500'
          style={{ borderWidth: '3px' }}
        ></div>
      </div>
    </div>
  );
};

export default BadRequestErrorIcon;
