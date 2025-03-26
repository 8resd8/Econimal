import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const GoMainBtn = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className='w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 border-4 border-white'
      aria-label='홈으로 가기'
    >
      <PawPrint className='w-8 h-8' strokeWidth={2} />
    </button>
  );
};

export default GoMainBtn;
