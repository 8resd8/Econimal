import { useState, useEffect, useRef } from 'react';

const BackgroundMusic = ({
  src = '/assets/sounds/eco_friendly_bgm.mp3',
  autoPlay = true,
  initialVolume = 0.5,
}: {
  src?: string;
  autoPlay?: boolean;
  initialVolume?: number;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null); // 타입 명시
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);

  // 오디오 이벤트 핸들러
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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

  // 자동 재생
  useEffect(() => {
    if (!autoPlay || !audioRef.current) return;

    const handleFirstClick = () => {
      audioRef.current?.play();
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, [autoPlay]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      <audio ref={audioRef} src={src} loop />

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={() => {
            if (audioRef.current?.paused) {
              audioRef.current.play();
            } else {
              audioRef.current?.pause();
            }
          }}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          {isPlaying ? '🔊 음악 끄기' : '🔇 음악 켜기'}
        </button>

        <input
          type='range'
          min='0'
          max='1'
          step='0.01'
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ width: '100px' }}
        />
        <span style={{ minWidth: '40px' }}>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};

export default BackgroundMusic;
