const ShopCoin = () => {
  return (
    <svg
      width='16'
      height='16'
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
  );
};

export default ShopCoin;
