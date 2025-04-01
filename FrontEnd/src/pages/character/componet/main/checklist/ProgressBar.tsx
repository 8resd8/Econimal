interface ProgressBarProps {
  progress: number; // 진행률 (0 ~ 100)
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className='relative w-full bg-gray-200 rounded-full h-6 shadow-inner'>
      <div
        className='bg-gradient-to-r from-blue-400 to-green-400 h-6 rounded-full transition-all'
        style={{ width: `${progress}%` }}
      ></div>
      <div className='absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-2'>
        {/* 🌟 {progress}% */}
      </div>
    </div>
  );
};

export default ProgressBar;
