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
      return 'from-slate-300 to-slate-100';
    } else if (percentage < 50) {
      return 'from-slate-300 to-slate-100';
    } else if (percentage < 75) {
      return 'from-slate-300 to-slate-100';
    } else {
      return 'from-slate-300 to-slate-100';
    }
  };

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <div className='relative w-48 sm:w-64 md:w-80 h-8 bg-white/90 rounded-full
        overflow-hidden shadow-md border-2 border-blue-200 ml-3'>
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
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
