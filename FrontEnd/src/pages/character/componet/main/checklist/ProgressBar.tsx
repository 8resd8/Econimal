interface ProgressBarProps {
  progress: number; // 진행률 (0 ~ 100)
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className='w-full bg-gray-200 rounded-full h-4'>
      {/* 자연스러운 애니메이션 추가를 위해 transition-all : 전환을 사용 && 인라인 스타일 적용*/}
      <div
        className='bg-green-500 h-4 rounded-full transition-all' //transition-all : 모든 속성에 전환효과
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
