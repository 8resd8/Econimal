// 404 Not Found 에러 아이콘 컴포넌트
const NotFoundErrorIcon = () => {
  return (
    <div className='relative w-24 h-24 mx-auto'>
      {/* 돋보기 아이콘 */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='relative'>
          {/* 돋보기 렌즈 */}
          <div className='w-14 h-14 bg-green-100 rounded-full border-2 border-green-400'></div>

          {/* 돋보기 손잡이 */}
          <div className='absolute bottom-0 right-0 w-4 h-12 bg-green-400 rounded-full transform rotate-45 origin-top'></div>

          {/* 물음표 */}
          <div className='absolute top-3 left-5 text-2xl font-bold text-green-600'>
            ?
          </div>
        </div>
      </div>

      {/* 404 표시 */}
      <div className='absolute -top-4 -right-4 w-12 h-12 bg-green-200 rounded-full border-2 border-green-400 flex items-center justify-center'>
        <span className='text-xs text-green-700 font-bold'>404</span>
      </div>
    </div>
  );
};
export default NotFoundErrorIcon;
