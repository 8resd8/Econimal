const CharCoin = ({ coin }: { coin: number }) => {
  // const CharCoin = () => {
  return (
    <div className='flex items-center bg-gradient-to-r from-yellow-200 to-yellow-100 px-5 py-3 rounded-full shadow-lg border-2 border-yellow-400'>
      {/* 동전 아이콘 */}
      <svg
        width='36'
        height='36'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='mr-2'
      >
        <circle
          cx='12'
          cy='12'
          r='10'
          fill='#fcd34d' // 더 밝은 금색
          stroke='#f59e0b'
          strokeWidth='2'
        />
        <circle cx='12' cy='12' r='8' fill='#fef08a' strokeWidth='0' />
        <text
          x='12'
          y='16'
          textAnchor='middle'
          fontSize='12'
          fontWeight='bold'
          fill='#f59e0b'
        >
          $
        </text>
      </svg>
      {/* <span className='font-bold text-lg text-yellow-800'>2350</span> */}
      <span className='font-extrabold text-xl text-yellow-700'>
        {coin} 코인
      </span>
    </div>
  );
};
export default CharCoin;
