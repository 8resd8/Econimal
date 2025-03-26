import { MouseEventHandler } from 'react';

const TownIcon = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      className='group w-28 h-28 bg-gradient-to-b from-blue-100 to-blue-50 rounded-3xl flex flex-col items-center justify-center border-4 border-blue-300 shadow-xl hover:from-blue-200 hover:to-blue-100 transition-colors'
      onClick={(e) => {
        console.log('Button clicked');
        if (onClick) onClick(e);
      }}
    >
      <div className='w-16 h-16 flex items-center justify-center'>
        <svg
          width='56'
          height='56'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          {/* 배경 */}
          <rect x='2' y='10' width='20' height='12' fill='#60a5fa' />

          {/* 건물들 */}
          <path d='M2 10L6 6L10 10' fill='#3b82f6' />
          <rect x='3' y='10' width='4' height='7' fill='#93c5fd' />

          <path d='M8 10L12 6L16 10' fill='#3b82f6' />
          <rect x='9' y='10' width='6' height='9' fill='#93c5fd' />

          <path d='M14 10L18 6L22 10' fill='#3b82f6' />
          <rect x='15' y='10' width='6' height='8' fill='#93c5fd' />

          {/* 창문 */}
          <rect x='4' y='12' width='2' height='2' fill='#dbeafe' />
          <rect x='11' y='12' width='2' height='2' fill='#dbeafe' />
          <rect x='17' y='12' width='2' height='2' fill='#dbeafe' />

          {/* 문 */}
          <rect x='12' y='15' width='2' height='4' fill='#1d4ed8' />
        </svg>
      </div>
      <span className='text-base mt-2 font-bold text-blue-700'>마을가기</span>
    </button>
  );
};

export default TownIcon;
