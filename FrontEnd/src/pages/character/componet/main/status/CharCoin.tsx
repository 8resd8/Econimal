const CharCoin = ({ coin }: { coin: number }) => {
  // const CharCoin = () => {
  return (
    <div className='flex items-center bg-gradient-to-r from-yellow-100 to-yellow-50 px-5 py-3 rounded-full shadow-md border-2 border-yellow-300'>
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
          fill='#fde68a'
          stroke='#f59e0b'
          strokeWidth='2'
        />
        <circle cx='12' cy='12' r='8' fill='#fef3c7' strokeWidth='0' />
        <path
          d='M12 7v10M8 12h8'
          stroke='#f59e0b'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </svg>
      {/* <span className='font-bold text-lg text-yellow-800'>2350</span> */}
      <span className='font-bold text-lg text-yellow-800'>{coin}</span>
    </div>
  );
};
export default CharCoin;
