const TownIcon = () => {
  return (
    <button className='group w-28 h-28 bg-gradient-to-b from-blue-100 to-blue-50 rounded-3xl flex flex-col items-center justify-center border-4 border-blue-300 shadow-xl hover:from-blue-200 hover:to-blue-100 transition-colors'>
      <div className='w-16 h-16 flex items-center justify-center'>
        <svg
          width='56'
          height='56'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
            fill='#93c5fd'
            stroke='#3b82f6'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M9 22V12h6v10'
            fill='#dbeafe'
            stroke='#3b82f6'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <circle
            cx='12'
            cy='7'
            r='2'
            fill='#3b82f6'
            stroke='#3b82f6'
            strokeWidth='0'
          />
          <path
            d='M7 9a5 5 0 0110 0'
            stroke='#3b82f6'
            strokeWidth='1'
            strokeLinecap='round'
          />
        </svg>
      </div>
      <span className='text-base mt-2 font-bold text-blue-700'>마을가기</span>
    </button>
  );
};

export default TownIcon;
