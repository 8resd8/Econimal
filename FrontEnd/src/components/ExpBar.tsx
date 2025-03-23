//일단 킵

interface ExpBarProps {
  current: number;
  max: number;
}

export default function ExpBar({ current, max }: ExpBarProps) {
  const percentage = (current / max) * 100;

  // 경험치 레벨에 따른 그라데이션 색상 변경
  const getGradient = () => {
    if (percentage < 25) {
      return 'from-blue-300 to-blue-100';
    } else if (percentage < 50) {
      return 'from-green-300 to-green-100';
    } else if (percentage < 75) {
      return 'from-yellow-300 to-yellow-100';
    } else {
      return 'from-orange-300 to-orange-100';
    }
  };

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <div className='flex items-center bg-blue-100 px-3 py-1 rounded-lg shadow-md border-2 border-blue-300'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='mr-1'
          >
            <path
              d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'
              fill='#e0f7ff'
              stroke='#0ea5e9'
              strokeWidth='2'
            />
          </svg>
          <span className='font-bold text-blue-700'>EXP</span>
        </div>
        <div className='relative w-48 sm:w-64 md:w-80 h-12 bg-white/90 rounded-full overflow-hidden shadow-md border-2 border-blue-200'>
          <div
            className={`h-full bg-gradient-to-r ${getGradient()}`}
            style={{ width: `${percentage}%` }}
          >
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
              <div className='flex items-center gap-2'>
                <span className='text-base font-bold drop-shadow-md'>
                  {current}/{max} 방울
                </span>
                {percentage >= 95 && (
                  <div className='animate-pulse'>
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83'
                        stroke='#ef4444'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <circle
                        cx='12'
                        cy='12'
                        r='4'
                        fill='#fecaca'
                        stroke='#ef4444'
                        strokeWidth='2'
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 물방울 아이콘 표시 */}
      <div className='flex justify-between px-2'>
        <div className='flex'>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className={`${
                i * 20 < percentage ? 'opacity-100' : 'opacity-30'
              } -ml-1 first:ml-0`}
            >
              <path
                d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'
                fill={i * 20 < percentage ? '#e0f7ff' : '#cbd5e1'}
                stroke={i * 20 < percentage ? '#0ea5e9' : '#94a3b8'}
                strokeWidth='2'
              />
            </svg>
          ))}
        </div>
        <div className='flex'>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className={`${
                (i + 5) * 20 < percentage ? 'opacity-100' : 'opacity-30'
              } -ml-1 first:ml-0`}
            >
              <path
                d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'
                fill={(i + 5) * 20 < percentage ? '#e0f7ff' : '#cbd5e1'}
                stroke={(i + 5) * 20 < percentage ? '#0ea5e9' : '#94a3b8'}
                strokeWidth='2'
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}
