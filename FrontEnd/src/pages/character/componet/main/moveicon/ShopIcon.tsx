import { MouseEventHandler } from 'react';

const ShopIcon = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      className='group w-28 h-24 bg-gradient-to-b from-orange-100 to-orange-50 rounded-3xl flex flex-col items-center justify-center border-4 border-orange-300 shadow-xl hover:from-orange-200 hover:to-orange-100 transition-colors'
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
    >
      <div className='w-12 h-12 flex items-center justify-center'>
        <svg
          width='56'
          height='56'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6'
            fill='#fed7aa'
            stroke='#f97316'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <circle
            cx='9'
            cy='20'
            r='2'
            fill='#fdba74'
            stroke='#f97316'
            strokeWidth='2'
          />
          <circle
            cx='20'
            cy='20'
            r='2'
            fill='#fdba74'
            stroke='#f97316'
            strokeWidth='2'
          />
          <path
            d='M12 10l2 2 4-4'
            stroke='#f97316'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
      <span className='text-sm mt-2 font-bold text-orange-700'>상점</span>
    </button>
  );
};

export default ShopIcon;
