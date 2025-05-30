import { MouseEventHandler } from 'react';

const EarthIcon = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      className='group w-24 h-24 bg-gradient-to-b from-slate-100 to-slate-50 rounded-[50%]
      flex flex-col items-center justify-center border-4 border-slate-200 shadow-xl
      hover:from-green-200 hover:to-green-100 transition-colors'
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
          <circle
            cx='12'
            cy='12'
            r='10'
            fill='#86efac'
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
        </svg>
      </div>
      <span className='text-sm mt-2 font-bold text-slate-700'>전세계</span>
    </button>
  );
};

export default EarthIcon;
