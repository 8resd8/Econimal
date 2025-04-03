import { useErrorStore } from '@/store/errorStore';
import NetworkErrorIcon from '@/components/errorScreens/icons/NetworkErrorIcon';
import ServerErrorIcon from '@/components/errorScreens/icons/ServerErrorIcon';
import PermissionErrorIcon from '@/components/errorScreens/icons/PermissionErrorIcon';
import NotFoundErrorIcon from '@/components/errorScreens/icons/NotFoundErrorIcon';
import TimeoutErrorIcon from '@/components/errorScreens/icons/TimeOutErrorIcon';
import BadRequestErrorIcon from '@/components/errorScreens/icons/BadRequestErrorIcon';
import GeneralErrorIcon from '@/components/errorScreens/icons/GeneralErrorIcon';

const ErrorOverlay = () => {
  // Zustand 스토어에서 상태 가져오기
  const {
    isError,
    errorType,
    errorMessage,
    errorSubMessage,
    retryAction,
    hideError,
    prevPath,
  } = useErrorStore();

  // 에러가 없으면 아무것도 렌더링하지 않음
  if (!isError || !errorType) {
    return null;
  }

  // 기본 에러 메시지 및 서브 메시지 설정
  let message = errorMessage;
  let subMessage = errorSubMessage;
  let retryText = '다시 시도하기';
  let tipType = 'eco';

  // 에러 타입에 따라 기본 메시지 설정
  switch (errorType) {
    case 'network':
      message = message || '네트워크에 접속할 수 없습니다';
      subMessage = subMessage || '네트워크 연결 상태를 확인해 주세요.';
      retryText = '다시 시도하기';
      tipType = 'energy';
      break;

    case 'server':
      message = message || '서버에 문제가 발생했습니다';
      subMessage =
        subMessage || '잠시 후 다시 시도해 주세요. 불편을 드려 죄송합니다.';
      retryText = '새로고침하기';
      tipType = 'eco';
      break;

    case 'permission':
      message = message || '접근 권한이 없습니다';
      subMessage =
        subMessage || '로그인이 필요하거나 접근할 수 없는 페이지입니다.';
      retryText = '로그인 페이지로 이동';
      tipType = 'recycle';
      break;

    case 'notFound':
      message = message || '페이지를 찾을 수 없습니다';
      subMessage =
        subMessage || '요청하신 페이지가 존재하지 않거나 이동되었습니다.';
      retryText = '홈으로 이동';
      tipType = 'water';
      break;

    case 'timeout':
      message = message || '요청 시간이 초과되었습니다';
      subMessage =
        subMessage ||
        '서버 응답 시간이 너무 오래 걸려요. 잠시 후 다시 시도해 주세요.';
      retryText = '다시 시도하기';
      tipType = 'eco';
      break;

    case 'badRequest':
      message = message || '요청에 문제가 있습니다';
      subMessage =
        subMessage ||
        '입력한 정보나 요청 형식에 오류가 있습니다. 다시 확인해 주세요.';
      retryText = '이전 페이지로 돌아가기';
      tipType = 'recycle';
      break;

    case 'general':
      message = message || '오류가 발생했어요';
      subMessage =
        subMessage || '에코니멀에 문제가 생겼어요. 다시 시도해 볼까요?';
      retryText = '다시 시도하기';
      tipType = 'eco';
      break;
  }

  // 재시도 동작 처리
  const handleRetry = () => {
    // 에러 상태 초기화
    hideError();

    // 커스텀 재시도 동작이 있으면 실행
    if (retryAction) {
      retryAction();
      return;
    }

    // 에러 타입에 따른 기본 동작
    switch (errorType) {
      case 'permission':
        window.location.href = '/login';
        break;
      case 'notFound':
        window.location.href = '/';
        break;
      case 'badRequest':
        // 이전 경로가 있으면 해당 경로로, 없으면 뒤로 가기
        if (prevPath) {
          window.history.pushState(null, '', prevPath);
        } else {
          window.history.back();
        }
        break;
      default:
        // 이전 경로로 돌아가거나 현재 페이지 새로고침
        if (prevPath) {
          window.history.pushState(null, '', prevPath);
        } else {
          window.location.reload();
        }
        break;
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-screen bg-green-50'>
      {/* 에러 아이콘 */}
      <div className='relative w-32 h-32 mb-6'>
        {errorType === 'network' && <NetworkErrorIcon />}
        {errorType === 'server' && <ServerErrorIcon />}
        {errorType === 'permission' && <PermissionErrorIcon />}
        {errorType === 'notFound' && <NotFoundErrorIcon />}
        {errorType === 'timeout' && <TimeoutErrorIcon />}
        {errorType === 'badRequest' && <BadRequestErrorIcon />}
        {errorType === 'general' && <GeneralErrorIcon />}
      </div>

      {/* 에러 메시지 */}
      <h1 className='text-2xl font-bold text-green-800 mb-3'>{message}</h1>
      <p className='text-md text-green-700 mb-8 text-center max-w-xs px-5'>
        {subMessage}
      </p>

      {/* 재시도 버튼 */}
      <button
        className='px-8 py-3 bg-teal-500 text-white rounded-full font-medium flex items-center shadow-md hover:bg-teal-600 transition-colors'
        onClick={handleRetry}
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
    </div>
  );
};

export default ErrorOverlay;
