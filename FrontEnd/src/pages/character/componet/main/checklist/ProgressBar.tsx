interface ProgressBarProps {
  progress: number; // 진행률 (0 ~ 100)
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className='w-full bg-gray-200 rounded-full h-4'>
      <div
        className='bg-purple-500 h-4 rounded-full transition-all'
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
