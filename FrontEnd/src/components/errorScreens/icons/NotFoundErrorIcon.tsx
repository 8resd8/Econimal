const NotFoundErrorIcon = () => {
  return (
    <div className='relative w-24 h-24 mx-auto'>
      {/* 지구 아이콘 */}
      <div className='absolute w-20 h-20 rounded-full bg-blue-400 border-4 border-green-300 overflow-hidden flex items-center justify-center mx-auto left-1/2 -translate-x-1/2'>
        {/* 지구 대륙 */}
        <div className='absolute w-8 h-6 bg-green-500 rounded-full left-2 top-3 rotate-12'></div>
        <div className='absolute w-6 h-5 bg-green-500 rounded-full right-2 top-5'></div>
        <div className='absolute w-10 h-4 bg-green-500 rounded-full right-5 bottom-3 rotate-12'></div>
        <div className='absolute w-7 h-6 bg-green-500 rounded-full left-4 bottom-2 rotate-45'></div>

        {/* 물음표 오버레이 */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-4xl font-bold text-white opacity-60 drop-shadow-lg'>
            ?
          </span>
        </div>
      </div>

      {/* 잎 장식 */}
      <div className='absolute -top-2 -left-2 w-7 h-7 bg-green-400 rounded-br-full rounded-bl-full rounded-tl-full rotate-45 animate-[bounce_3s_ease-in-out_infinite]'></div>
      <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-br-full rounded-bl-full rounded-tl-full rotate-90 animate-[bounce_2.5s_ease-in-out_infinite_0.5s]'></div>

      {/* 404 텍스트 */}
      <div className='absolute -top-6 right-0 text-3xl font-bold text-green-700 opacity-50'>
        404
      </div>
    </div>
  );
};

export default NotFoundErrorIcon;
