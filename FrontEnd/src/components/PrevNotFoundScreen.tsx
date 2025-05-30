import { useEffect } from 'react';
import { useErrorStore } from '@/store/errorStore';
import { clearAllToasts } from '@/components/toast/toastUtil';

interface NotFoundScreenProps {
  message?: string;
  subMessage?: string;
  homeText?: string;
  onGoHome?: () => void;
}

const NotFoundScreen = ({
  message = '페이지를 찾을 수 없습니다',
  subMessage = '요청하신 페이지가 삭제되었거나 주소가 변경되었어요.',
  homeText = '메인으로 이동',
  onGoHome = () => (window.location.href = '/'),
}: NotFoundScreenProps) => {
  // [여기] 에러 스토어 훅 사용
  const showError = useErrorStore((state) => state.showError);

  // [여기] 컴포넌트 마운트 시 에러 상태 설정 및 토스트 제거
  useEffect(() => {
    // 즉시 모든 토스트 제거
    clearAllToasts();

    // 에러 상태 설정 (404 페이지)
    showError({
      errorType: 'notFound',
      errorMessage: message,
      errorSubMessage: subMessage,
    });

    // 언마운트 시 클린업 함수
    return () => {
      // 필요한 경우 추가 정리 작업
    };
  }, [showError, message, subMessage]);

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center w-full h-screen bg-green-50'>
      {/* 404 애니메이션 아이콘 */}
      <div className='relative w-40 h-40 mb-6'>
        {/* 지구 아이콘 */}
        <div className='absolute w-28 h-28 rounded-full bg-blue-400 border-4 border-green-300 overflow-hidden flex items-center justify-center mx-auto left-1/2 -translate-x-1/2'>
          {/* 지구 대륙 */}
          <div className='absolute w-12 h-8 bg-green-500 rounded-full left-3 top-5 rotate-12'></div>
          <div className='absolute w-8 h-7 bg-green-500 rounded-full right-3 top-7'></div>
          <div className='absolute w-14 h-6 bg-green-500 rounded-full right-7 bottom-5 rotate-12'></div>
          <div className='absolute w-10 h-9 bg-green-500 rounded-full left-6 bottom-3 rotate-45'></div>

          {/* 물음표 오버레이 */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-6xl font-bold text-white opacity-60 drop-shadow-lg'>
              ?
            </span>
          </div>
        </div>

        {/* 잎 장식 */}
        <div className='absolute -top-2 -left-2 w-10 h-10 bg-green-400 rounded-br-full rounded-bl-full rounded-tl-full rotate-45 animate-[bounce_3s_ease-in-out_infinite]'></div>
        <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-br-full rounded-bl-full rounded-tl-full rotate-90 animate-[bounce_2.5s_ease-in-out_infinite_0.5s]'></div>

        {/* 404 텍스트 */}
        <div className='absolute -top-8 right-0 text-5xl font-bold text-green-700 opacity-50'>
          404
        </div>
      </div>

      {/* 에러 메시지 */}
      <h1 className='text-2xl font-bold text-green-800 mb-3'>{message}</h1>
      <p className='text-md text-green-700 mb-8 text-center max-w-xs px-5'>
        {subMessage}
      </p>

      {/* 메인으로 버튼 */}
      <button
        className='px-8 py-3 bg-teal-500 text-white rounded-full font-medium flex items-center shadow-md hover:bg-teal-600 transition-colors'
        onClick={onGoHome}
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
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          ></path>
        </svg>
        {homeText}
      </button>
    </div>
  );
};

export default NotFoundScreen;
