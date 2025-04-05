import { useState, useEffect, useRef } from 'react';

const BackgroundMusic = ({
  src = '/assets/sounds/eco_friendly_bgm.mp3',
  initialVolume = 0.3,
}: {
  src?: string;
  initialVolume?: number;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [showVolume, setShowVolume] = useState(false);

  // 오디오 초기화
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // 볼륨 조절
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999, // 콘텐츠보다 위에 표시
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {/* 컴팩트한 음악 컨트롤 */}
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '50%',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          width: '50px',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setShowVolume(!showVolume)}
      >
        {/* 토글 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 클릭 이벤트 전파 방지
            isPlaying ? audioRef.current?.pause() : audioRef.current?.play();
          }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: 'none',
            fontSize: '24px',
          }}
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>
      </div>

      {/* 볼륨 슬라이더 (클릭 시 표시) */}
      {showVolume && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px', // 버튼 위에 표시
            right: '20px',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
            zIndex: 9999,
          }}
        >
          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '150px' }}
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      )}

      <audio ref={audioRef} src={src} loop />
    </div>
  );
};

export default BackgroundMusic;
