import { useState, useEffect } from 'react';

const PWAInstallNotice = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 기기 타입 감지
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    setIsIOSDevice(isIOS);
    setIsAndroidDevice(isAndroid);

    // PWA가 이미 설치되었는지 확인
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://');

    setIsPWAInstalled(isPWA);

    // 디스플레이 모드 변경 감지 (앱이 설치된 후 실행될 때)
    const displayModeHandler = (e) => {
      if (e.matches) {
        setIsPWAInstalled(true);
      }
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', displayModeHandler);

    // 지난 7일 이내에 사용자가 팝업을 닫았는지 확인
    const lastDismissed = localStorage.getItem('pwa-install-dismissed');
    if (lastDismissed) {
      const dismissedDate = new Date(parseInt(lastDismissed));
      const now = new Date();
      const daysSinceDismissed = Math.floor(
        (now - dismissedDate) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceDismissed < 7) {
        setDismissed(true);
      } else {
        localStorage.removeItem('pwa-install-dismissed');
      }
    }

    // beforeinstallprompt 이벤트 리스너 추가 (주로 Android Chrome, 데스크톱 Chrome, Edge 등)
    const handleBeforeInstallPrompt = (e) => {
      // 브라우저의 기본 설치 팝업 방지
      e.preventDefault();
      // 이벤트 저장
      setDeferredPrompt(e);
      // 커스텀 설치 팝업 표시 설정
      setShowInstallPrompt(true);

      console.log("'beforeinstallprompt' 이벤트 발생, PWA 설치 가능");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 이미 앱이 설치되었는지 먼저 확인하고, 설치가 안 되어 있다면 Android에서는 일정 시간 후 팝업 표시
    if (!isPWA && isAndroid) {
      // Android에서 beforeinstallprompt 이벤트가 발생하지 않을 경우를 대비해
      // 5초 후에도 이벤트가 발생하지 않았다면 기본 안내 메시지 표시
      const timeoutId = setTimeout(() => {
        if (!deferredPrompt) {
          console.log('5초 후에도 beforeinstallprompt 이벤트가 발생하지 않음');
          setShowInstallPrompt(true);
        }
      }, 5000);

      return () => clearTimeout(timeoutId);
    }

    // appinstalled 이벤트 리스너 추가
    const handleAppInstalled = () => {
      console.log('PWA가 성공적으로 설치됨');
      setIsPWAInstalled(true);
      setShowInstallPrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', displayModeHandler);
    };
  }, [deferredPrompt]);

  // 설치 버튼 클릭 핸들러
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        // 설치 팝업 표시
        deferredPrompt.prompt();
        // 사용자의 선택 대기
        const choiceResult = await deferredPrompt.userChoice;
        // deferredPrompt 초기화
        setDeferredPrompt(null);

        if (choiceResult.outcome === 'accepted') {
          console.log('사용자가 PWA 설치를 수락했습니다');
        } else {
          console.log('사용자가 PWA 설치를 거부했습니다');
        }
      } catch (error) {
        console.error('PWA 설치 중 오류 발생:', error);
      }
    } else {
      // Android인데 deferredPrompt가 없는 경우 (브라우저가 PWA 설치를 지원하지 않거나 이미 설치됨)
      if (isAndroidDevice) {
        // Chrome 앱 또는 기본 브라우저가 설치 기능을 지원하지 않는 경우
        alert('브라우저 메뉴에서 "홈 화면에 추가" 옵션을 선택해주세요.');
      }
    }

    setShowInstallPrompt(false);
  };

  // 팝업 닫기 핸들러
  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // 사용자가 팝업을 닫은 시간 저장
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // 이미 PWA가 설치되었거나, 팝업을 표시하지 않아야 하는 경우
  if (isPWAInstalled || dismissed) {
    return null;
  }

  // 팝업을 표시할지 여부 결정
  // Android에서는 deferredPrompt가 없어도 표시할 수 있게 함
  const shouldShow = showInstallPrompt || (isAndroidDevice && !deferredPrompt);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className='fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 border-2 border-green-400'>
      <div className='flex items-start'>
        {/* 앱 아이콘 */}
        <div className='w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='32'
            height='32'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#22C55E'
            strokeWidth='2'
          >
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
          </svg>
        </div>

        <div className='flex-1'>
          <div className='flex justify-between items-start'>
            <h3 className='font-bold text-lg text-green-600'>앱 설치하기</h3>
            <button
              onClick={handleDismiss}
              className='text-gray-400 hover:text-gray-600'
              aria-label='닫기'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M18 6L6 18M6 6l12 12'></path>
              </svg>
            </button>
          </div>

          <p className='text-sm text-gray-600 mt-1'>
            홈 화면에 추가하여 더 빠르고 편리하게 이용해보세요!
          </p>

          {isIOSDevice ? (
            <div className='mt-3 text-xs text-gray-500'>
              <p>
                Safari 브라우저에서{' '}
                <span className='inline-block'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M12 5v14M5 12h14'></path>
                  </svg>
                </span>{' '}
                버튼을 누른 다음,
              </p>
              <p>"홈 화면에 추가" 를 선택하세요.</p>
            </div>
          ) : isAndroidDevice && !deferredPrompt ? (
            <div className='mt-3'>
              <p className='text-xs text-gray-500 mb-2'>
                Chrome 브라우저 메뉴(⋮)에서 "앱 설치" 또는 "홈 화면에 추가"를
                선택하세요.
              </p>
              <button
                onClick={() =>
                  alert(
                    '브라우저 메뉴에서 "앱 설치" 또는 "홈 화면에 추가" 옵션을 선택해주세요.',
                  )
                }
                className='px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors'
              >
                설치 방법 보기
              </button>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className='mt-3 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors'
            >
              앱 설치하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallNotice;
