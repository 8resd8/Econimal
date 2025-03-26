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

// import { MouseEventHandler } from 'react';

// const GoMainBtn = ({
//   onClick,
// }: {
//   onClick: MouseEventHandler<HTMLButtonElement>;
// }) => {
//   return (
//     <button
//       className='w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-md hover:from-blue-200 hover:to-blue-100 transition-colors border-2 border-blue-300'
//       onClick={onClick}
//     >
//       <svg
//         width='24'
//         height='24'
//         fill='none'
//         stroke='currentColor'
//         strokeWidth='2'
//         viewBox='0 0 24 24'
//       >
//         <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
//         <path d='M9 22V12h6v10' />
//       </svg>
//     </button>
//   );
// };

// export default GoMainBtn;
