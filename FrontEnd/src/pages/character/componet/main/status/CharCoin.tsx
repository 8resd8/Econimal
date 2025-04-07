const CharCoin = ({ coin }: { coin: number }) => {
  return (
    <div className='flex items-center h-10 bg-gradient-to-r from-slate-100
    to-yellow-50 px-3 py-2 rounded-full shadow-lg border-2 border-slate-200
     scale-75'>
      {/* 동전 아이콘 */}
      <svg
        width='30'
        height='30'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='mr-1'
      >
        <circle
          cx='12'
          cy='12'
          r='10'
          fill='#fcd34d'
          stroke='#f59e0b'
          strokeWidth='2'
        />
        <circle cx='12' cy='12' r='8' fill='#fef08a' strokeWidth='0' />
        <text
          x='12'
          y='16'
          textAnchor='middle'
          fontSize='10'
          fontWeight='bold'
          fill='#f59e0b'
        >
          $
        </text>
      </svg>
      <span className='font-bold text-base text-slate-700'>{coin} 코인</span>
    </div>
  );
};

export default CharCoin;
