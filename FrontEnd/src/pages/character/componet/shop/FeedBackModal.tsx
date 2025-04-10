import { X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 선택 피드백 모달 컴포넌트
// 선택 피드백 모달 컴포넌트
interface FeedbackModalProps {
  message: string;
  status: 'success' | 'error' | 'loading';
  onClose: () => void;
  itemName?: string;
  requiredCoins?: number;
}

const FeedbackModal = ({
  message,
  status,
  onClose,
  itemName,
  requiredCoins,
}: FeedbackModalProps) => {
  const navigate = useNavigate(); // 라우터 네비게이션 훅

  const getBorderColor = () => {
    switch (status) {
      case 'success':
        return 'border-blue-100';
      case 'error':
        return 'border-red-100';
      default:
        return 'border-yellow-100';
    }
  };

  const getBgColor = () => {
    switch (status) {
      case 'success':
        return 'bg-blue-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-yellow-100';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'success':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getButtonColor = () => {
    switch (status) {
      case 'success':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-blue-500 hover:bg-yellow-600';
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'success':
        return '성공!';
      case 'error':
        return '실패';
      default:
        return '처리 중...';
    }
  };

  // 코인 얻기 페이지로 이동
  const handleGetCoins = () => {
    navigate('/'); // 코인을 얻을 수 있는 페이지로 이동 (메인 페이지 가정)
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]'>
      <div
        className={`bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-4 ${getBorderColor()}`}
      >
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div
              className={`w-16 h-16 ${getBgColor()} rounded-full flex items-center justify-center`}
            >
              {status === 'success' && (
                <Check className={`h-10 w-10 ${getTextColor()}`} />
              )}
              {status === 'error' && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className={`h-10 w-10 ${getTextColor()}`}
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
              )}
              {status === 'loading' && (
                <div
                  className={`w-10 h-10 border-4 ${getTextColor()} border-t-transparent rounded-full animate-spin`}
                ></div>
              )}
            </div>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            {getTitle()}
          </h2>

          {itemName && status === 'success' && (
            <p className='text-gray-600 text-sm mb-3'>
              <span className={`font-semibold ${getTextColor()}`}>
                {itemName}
              </span>
              {status === 'success' ? '이(가) 정상적으로 ' : '을(를) '}
              {message.includes('구매') ? '구매되었습니다.' : '선택되었습니다.'}
            </p>
          )}

          {!itemName && <p className='text-gray-600 mb-3'>{message}</p>}

          {status === 'error' && requiredCoins && (
            <>
              <p className='text-gray-600 text-sm mb-2'>
                <span className={`font-semibold ${getTextColor()} text-xl`}>
                  {requiredCoins} 코인
                </span>{' '}
                이 부족합니다.
              </p>
              <p className='text-gray-500 text-sm'>
                코인을 더 획득하시겠습니까?
              </p>
            </>
          )}
        </div>

        {status === 'error' && requiredCoins ? (
          <div className='flex gap-3'>
            <button
              onClick={onClose}
              className='w-1/2 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors duration-200'
            >
              닫기
            </button>
            <button
              onClick={handleGetCoins}
              className='w-1/2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-200'
            >
              코인 얻기
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`w-full py-3 ${getButtonColor()} text-white rounded-xl font-semibold transition-colors duration-200`}
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
