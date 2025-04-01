// 권한 에러 아이콘 컴포넌트
const PermissionErrorIcon = () => {
  return (
    <div className='relative w-24 h-24 mx-auto'>
      {/* 자물쇠 아이콘 */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='relative'>
          {/* 자물쇠 몸체 */}
          <div className='w-14 h-16 bg-green-200 rounded-lg border-2 border-green-400 flex items-center justify-center'>
            {/* 열쇠 구멍 */}
            <div className='w-4 h-6 bg-green-50 rounded-full border border-green-400'></div>
          </div>

          {/* 자물쇠 걸쇠 */}
          <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 border-4 border-green-400 rounded-t-full border-b-0'></div>

          {/* 표정 */}
          <div className='absolute bottom-3 w-10 h-6 left-1/2 transform -translate-x-1/2'>
            <div className='flex justify-between'>
              <div className='w-2 h-2 bg-green-600 rounded-full'></div>
              <div className='w-2 h-2 bg-green-600 rounded-full'></div>
            </div>
            <div className='w-6 h-1 bg-green-600 rounded-full mx-auto mt-2'></div>
          </div>
        </div>
      </div>

      {/* 금지 표시 */}
      <div className='absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center'>
        <div className='w-12 h-2 bg-red-500 transform rotate-45 rounded-full'></div>
        <div className='w-12 h-2 bg-red-500 transform -rotate-45 rounded-full absolute'></div>
      </div>
    </div>
  );
};
export default PermissionErrorIcon;
