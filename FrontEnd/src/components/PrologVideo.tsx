import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/store'; // Zustand 스토어 사용
import { usePrologStore } from '@/store/prologStore'; // 경로는 실제 파일 위치에 맞게 수정
import prologVideo from '@/assets/prolog.mp4';
import ReactDOM from 'react-dom'; // Portal을 위해 ReactDOM 추가

interface PrologVideoProps {
  onComplete?: () => void;
}

const PrologVideo: React.FC<PrologVideoProps> = ({ onComplete }) => {
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { token } = useAuthStore(); // Zustand에서 토큰 가져오기

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // 영상이 끝나면 메인 페이지로 이동
  useEffect(() => {
    const currentVideo = videoRef.current;

    if (currentVideo) {
      currentVideo.addEventListener('ended', handleVideoEnded);
    }

    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener('ended', handleVideoEnded);
      }
    };
  }, []);

  // 별도 스토어 사용 시
  const { setHasSeenProlog } = usePrologStore();

  // 영상 종료 시 실행되는 함수
  const handleVideoEnded = (): void => {
    setHasSeenProlog(true);
    navigateToMain();
  };

  // 스킵 버튼 클릭 시 실행되는 함수
  const handleSkip = (): void => {
    setIsSkipped(true);
    if (onComplete) {
      onComplete();
    }
    navigateToMain();
  };

  // 메인 페이지로 이동하는 함수
  const navigateToMain = (): void => {
    // 프롤로그 시청 완료 표시를 로컬 스토리지에 저장
    localStorage.setItem('prologViewed', 'true');
    navigate('/');
  };

  // 스킵 버튼 내용
  const skipButtonContent = (
    <button
      onClick={handleSkip}
      className='fixed top-8 right-8 z-50 px-5 py-3 bg-black bg-opacity-60 text-white border border-white rounded-lg cursor-pointer text-lg font-extrabold transition-all duration-300 hover:bg-opacity-20 focus:outline-none'
    >
      SKIP⏭️
    </button>
  );

  return (
    <div className='relative w-full h-screen bg-black overflow-hidden'>
      {!isSkipped && (
        <>
          <video
            ref={videoRef}
            className='w-full h-full object-cover'
            autoPlay
            muted
            playsInline
          >
            <source src={prologVideo} type='video/mp4' />
            브라우저가 비디오 태그를 지원하지 않습니다.
          </video>
          {/* Portal을 사용하여 스킵 버튼을 body에 직접 렌더링 */}
          {ReactDOM.createPortal(skipButtonContent, document.body)}
        </>
      )}
    </div>
  );
};

export default PrologVideo;
