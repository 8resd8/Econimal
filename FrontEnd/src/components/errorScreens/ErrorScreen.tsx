import NetworkErrorIcon from '@/components/errorScreens/icons/NetworkErrorIcon';
import ServerErrorIcon from '@/components/errorScreens/icons/NetworkErrorIcon';
import PermissionErrorIcon from '@/components/errorScreens/icons/NetworkErrorIcon';
import NotFoundErrorIcon from '@/components/errorScreens/icons/NetworkErrorIcon';
import TimeoutErrorIcon from '@/components/errorScreens/icons/NetworkErrorIcon';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';

/**
 * 에코니멀 서비스를 위한 네트워크 에러 스크린 컴포넌트
 * - 초등학생 타겟으로 친환경 요소를 반영한 디자인
 * - 네트워크 연결 실패 시 사용자에게 친근한 안내 제공
 */

const ErrorScreen = ({
  message,
  subMessage,
  retryText,
  onRetry = () => window.location.reload(),
  iconType,
}: // tipType = 'eco',
ErrorScreenProps) => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center w-full h-screen bg-green-50'>
      {/* 에러 아이콘 */}
      <div className='relative w-32 h-32 mb-6'>
        {iconType === 'network' && <NetworkErrorIcon />}
        {iconType === 'server' && <ServerErrorIcon />}
        {iconType === 'permission' && <PermissionErrorIcon />}
        {iconType === 'notFound' && <NotFoundErrorIcon />}
        {iconType === 'timeout' && <TimeoutErrorIcon />}
      </div>

      {/* 에러 메시지 */}
      <h1 className='text-2xl font-bold text-green-800 mb-3'>{message}</h1>
      <p className='text-md text-green-700 mb-8 text-center max-w-xs px-5'>
        {subMessage}
      </p>

      {/* 재시도 버튼 */}
      <button
        className='px-8 py-3 bg-teal-500 text-white rounded-full font-medium flex items-center shadow-md hover:bg-teal-600 transition-colors'
        onClick={onRetry}
      >
        <svg
          className='w-5 h-5 mr-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
          ></path>
        </svg>
        {retryText}
      </button>

      {/* 환경 꿀팁 */}
      {/* <div className="absolute bottom-5 left-0 right-0 text-center">
        <p className="text-sm text-green-700 max-w-xs mx-auto">{getTip(tipType)}</p>
      </div> */}
    </div>
  );
};

export default ErrorScreen;
