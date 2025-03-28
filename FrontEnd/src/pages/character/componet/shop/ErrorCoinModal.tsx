import { useNavigate } from 'react-router-dom';

const ErrorCoinModal = ({
  requiredCoins,
  onClose,
}: {
  requiredCoins: number;
  onClose: () => void;
}) => {
  const nav = useNavigate();
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center'>
      <div className='bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-4 border-red-100'>
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 text-red-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>코인 부족!</h2>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <span className='text-xl font-bold text-red-600'>
              {requiredCoins}
            </span>
            <img src='/coin-icon.png' className='w-6 h-6' alt='코인' />
            <span className='text-gray-600'>가 필요합니다</span>
          </div>
          <p className='text-gray-500 text-sm'>코인을 더 획득하시겠습니까?</p>
        </div>
        <div className='flex gap-4'>
          <button
            onClick={onClose}
            className='flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors duration-200'
          >
            닫기
          </button>
          <button
            onClick={() => {
              nav('/');
            }}
            className='flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-200'
          >
            코인 얻기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorCoinModal;
