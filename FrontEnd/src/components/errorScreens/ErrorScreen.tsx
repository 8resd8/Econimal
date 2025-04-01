import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NetworkErrorIcon from '@/components/errorScreens/icons/NetworkErrorIcon';
import ServerErrorIcon from '@/components/errorScreens/icons/ServerErrorIcon';
import PermissionErrorIcon from '@/components/errorScreens/icons/PermissionErrorIcon';
import NotFoundErrorIcon from '@/components/errorScreens/icons/NotFoundErrorIcon';
import TimeoutErrorIcon from '@/components/errorScreens/icons/TimeOutErrorIcon';
import GeneralErrorIcon from '@/components/errorScreens/icons/GeneralErrorIcon';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';

// 에러 스크린 컴포넌트
// URL 쿼리 파라미터로 에러 타입을 받아 처리
const ErrorScreen = (props: Partial<ErrorScreenProps>) => {
  const [searchParams] = useSearchParams();
  const [screenProps, setScreenProps] = useState<ErrorScreenProps>({
    message: props.message || '오류가 발생했습니다',
    subMessage: props.subMessage || '잠시 후 다시 시도해 주세요.',
    retryText: props.retryText || '다시 시도하기',
    onRetry: props.onRetry || (() => window.location.reload()),
    iconType: props.iconType || 'server',
    tipType: props.tipType || 'eco',
  });

  // URL 쿼리 파라미터에서 에러 타입 추출
  useEffect(() => {
    // 에러 타입 가져오기
    const errorType = searchParams.get('type') as
      | 'network'
      | 'server'
      | 'permission'
      | 'notFound'
      | 'timeout'
      | null;

    if (!errorType && !props.iconType) return;

    // 기본 속성 복사
    const newProps = { ...screenProps };

    // 에러 타입에 따른 화면 속성 설정
    switch (errorType || props.iconType) {
      case 'network':
        newProps.message = '네트워크에 접속할 수 없습니다';
        newProps.subMessage = '네트워크 연결 상태를 확인해 주세요.';
        newProps.retryText = '다시 시도하기';
        newProps.iconType = 'network';
        newProps.tipType = 'energy';
        break;

      case 'server':
        newProps.message = '서버에 문제가 발생했습니다';
        newProps.subMessage =
          '잠시 후 다시 시도해 주세요. 불편을 드려 죄송합니다.';
        newProps.retryText = '새로고침하기';
        newProps.iconType = 'server';
        newProps.tipType = 'eco';
        break;

      case 'permission':
        newProps.message = '접근 권한이 없습니다';
        newProps.subMessage =
          '로그인이 필요하거나 접근할 수 없는 페이지입니다.';
        newProps.retryText = '로그인 페이지로 이동';
        newProps.onRetry = () => (window.location.href = '/login');
        newProps.iconType = 'permission';
        newProps.tipType = 'recycle';
        break;

      case 'notFound':
        newProps.message = '페이지를 찾을 수 없습니다';
        newProps.subMessage =
          '요청하신 페이지가 존재하지 않거나 이동되었습니다.';
        newProps.retryText = '홈으로 이동';
        newProps.onRetry = () => (window.location.href = '/');
        newProps.iconType = 'notFound';
        newProps.tipType = 'water';
        break;

      case 'timeout':
        newProps.message = '요청 시간이 초과되었습니다';
        newProps.subMessage =
          '서버 응답 시간이 너무 오래 걸려요. 잠시 후 다시 시도해 주세요.';
        newProps.retryText = '다시 시도하기';
        newProps.iconType = 'timeout';
        newProps.tipType = 'eco';
        break;

      case 'general':
        newProps.message = '오류가 발생했어요';
        newProps.subMessage = '에코니멀에 문제가 생겼어요. 다시 시도해 볼까요?';
        newProps.retryText = '다시 시도하기';
        newProps.iconType = 'general';
        newProps.tipType = 'eco';
        break;
    }

    // props로 전달된 값이 있으면 우선 적용
    if (props.message) newProps.message = props.message;
    if (props.subMessage) newProps.subMessage = props.subMessage;
    if (props.retryText) newProps.retryText = props.retryText;
    if (props.onRetry) newProps.onRetry = props.onRetry;
    if (props.tipType) newProps.tipType = props.tipType;

    setScreenProps(newProps);
  }, [searchParams, props]);

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center w-full h-screen bg-green-50'>
      {/* 에러 아이콘 */}
      <div className='relative w-32 h-32 mb-6'>
        {screenProps.iconType === 'network' && <NetworkErrorIcon />}
        {screenProps.iconType === 'server' && <ServerErrorIcon />}
        {screenProps.iconType === 'permission' && <PermissionErrorIcon />}
        {screenProps.iconType === 'notFound' && <NotFoundErrorIcon />}
        {screenProps.iconType === 'timeout' && <TimeoutErrorIcon />}
        {screenProps.iconType === 'general' && <GeneralErrorIcon />}
      </div>

      {/* 에러 메시지 */}
      <h1 className='text-2xl font-bold text-green-800 mb-3'>
        {screenProps.message}
      </h1>
      <p className='text-md text-green-700 mb-8 text-center max-w-xs px-5'>
        {screenProps.subMessage}
      </p>

      {/* 재시도 버튼 */}
      <button
        className='px-8 py-3 bg-teal-500 text-white rounded-full font-medium flex items-center shadow-md hover:bg-teal-600 transition-colors'
        onClick={screenProps.onRetry}
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
        {screenProps.retryText}
      </button>
    </div>
  );
};

export default ErrorScreen;
