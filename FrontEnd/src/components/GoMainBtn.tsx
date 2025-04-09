import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const GoMainBtn = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      // className='w-[30%] h-[50%] bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 border-2 border-white'
      className='w-12 h-12 bg-blue-200 hover:bg-blue-400 text-slate-100 rounded-full
      shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 border-2 border-slate-100'
      aria-label='홈으로 가기'
    >
      <PawPrint className='w-[70%] h-[70%]' strokeWidth={2} />
    </button>
  );
};

export default GoMainBtn;
