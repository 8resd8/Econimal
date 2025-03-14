const EarthIcon = () => {
  return (
    <button className='group w-28 h-28 bg-gradient-to-b from-green-100 to-green-50 rounded-3xl flex flex-col items-center justify-center border-4 border-green-300 shadow-xl hover:from-green-200 hover:to-green-100 transition-colors'>
      <div className='w-16 h-16 flex items-center justify-center'>
        <svg
          width='56'
          height='56'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            fill='#86efac'
            stroke='#22c55e'
            strokeWidth='2'
          />
          <path
            d='M12 2a10 10 0 0110 10M2 12a10 10 0 0110-10'
            stroke='#22c55e'
            strokeWidth='2'
          />
          <path d='M12 2v20M2 12h20' stroke='#22c55e' strokeWidth='2' />
          <circle
            cx='12'
            cy='12'
            r='4'
            fill='#22c55e'
            stroke='#22c55e'
            strokeWidth='0'
          />
          <path
            d='M18.4 5.6a9 9 0 010 12.8M5.6 5.6a9 9 0 000 12.8'
            stroke='#22c55e'
            strokeWidth='1'
          />
        </svg>
      </div>
      <span className='text-base mt-2 font-bold text-green-700'>전세계</span>
    </button>
  );
};

export default EarthIcon;
