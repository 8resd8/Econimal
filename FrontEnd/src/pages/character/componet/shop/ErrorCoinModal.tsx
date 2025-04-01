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
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
      <div className='bg-white p-5 rounded-xl shadow-lg max-w-[600px] w-full border-4 border-red-100'>
        <div className='text-center'>
          {/* 아이콘 */}
          <div className='flex justify-center mb-4'>
            <div className='w-14 h-14 bg-red-100 rounded-full flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-red-500'
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
          <h2 className='text-xl font-bold text-gray-800 mb-4'>코인 부족!</h2>
          <p className='text-gray-600 text-sm mb-2'>
            <span className='font-semibold text-red-600'>{requiredCoins}</span>{' '}
            코인이 필요합니다.
          </p>
          <p className='text-gray-500 text-sm'>코인을 더 획득하시겠습니까?</p>
        </div>

        {/* 버튼 영역 */}
        <div className='flex gap-3 mt-6'>
          <button
            onClick={onClose}
            className='w-1/2 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition'
          >
            닫기
          </button>
          <button
            onClick={() => nav('/')}
            className='w-1/2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition'
          >
            코인 얻기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorCoinModal;
