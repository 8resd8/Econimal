import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
    BackgroundGradient, 
    Stars, 
    Clouds, 
    Drips 
  } from './AnimationScrollUtils';

// 컴포넌트 전체 컨테이너 - 고정된 높이와 스크롤 가능하도록 설정
const ComponentContainer = styled.div`
  width: 100%;
  height: 100vh; /* 화면 높이만큼만 차지 */
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// 내부 스크롤 컨테이너
const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto; /* 내부 스크롤 활성화 */
  scroll-behavior: smooth; /* 부드러운 스크롤 효과 */
  background-color: #121212;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

// 내용 컨테이너 - 스크롤 효과를 위한 충분한 높이 제공
const ContentContainer = styled.div`
  width: 100%;
  height: 300%; /* 컨테이너 높이의 3배로 설정하여 스크롤 가능하게 함 */
  position: relative;
`;

// 고정된 애니메이션 래퍼
const AnimationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  position: sticky;
  top: 0;
  overflow: hidden;
`;

const AnimationContainer = styled.div`
  width: 100%;
  height: 100vh; /* 스크롤할 충분한 공간 */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #121212;
`;

const MessageContainer = styled.div`
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const Message = styled.div<{ opacity: number; transform: string }>`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 10px 0;
  opacity: ${props => props.opacity};
  transform: ${props => props.transform};
  transition: opacity 0.5s ease, transform 0.5s ease;
  max-width: 80%;
  text-align: center;
`;

// 물웅덩이 효과
const Puddle = styled.div<{ progress: number }>`
  position: absolute;
  width: ${props => 120 + props.progress * 80}px;
  height: ${props => 30 + props.progress * 10}px;
  background: rgba(66, 158, 189, 0.5);
  border-radius: 50%;
  bottom: -100px;
  z-index: 1;
  filter: blur(5px);
  opacity: ${props => props.progress * 0.8};
  transform: scale(${props => 0.5 + props.progress * 0.5});
`;

// 지구에 달 효과 추가
const Moon = styled.div<{ progress: number }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 50%;
  top: 10%;
  right: 10%;
  z-index: 0;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
  opacity: ${props => 1 - props.progress * 0.7};
  transform: translate(${props => props.progress * 30}px, ${props => props.progress * -20}px);
  
  /* 달의 분화구 */
  &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: rgba(200, 200, 200, 0.8);
    border-radius: 50%;
    top: 10px;
    left: 10px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: rgba(200, 200, 200, 0.8);
    border-radius: 50%;
    top: 25px;
    left: 20px;
  }
`;

// 경고 레이블
const WarningLabel = styled.div<{ progress: number }>`
  position: absolute;
  bottom: 10%;
  background-color: rgba(255, 50, 50, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transform: translateY(${props => (1 - props.progress) * 50}px);
  opacity: ${props => props.progress > 0.7 ? 1 : 0};
  transition: opacity 0.5s ease;
  font-weight: bold;
  z-index: 10;
`;

// 하단 스크롤 안내
const ScrollGuide = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.5s ease;
  z-index: 100;
`;

const ScrollArrow = styled.div`
  width: 20px;
  height: 20px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
  margin-top: 8px;
  animation: bounce 1.5s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) rotate(45deg);
    }
    40% {
      transform: translateY(-10px) rotate(45deg);
    }
    60% {
      transform: translateY(-5px) rotate(45deg);
    }
  }
`;

// 스킵 표시
const Skip  = styled.div

interface MessageVisibility {
    opacity: number;
    transform: string;
}

const AnimationScroll: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollGuide, setShowScrollGuide] = useState(true);

  // 메시지별 가시성 상태를 별도로 관리
  const [messageVisibility, setMessageVisibility] = useState<MessageVisibility[]>([
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 0, transform: 'translateY(20px)' }
  ]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      // 스크롤 진행도 계산 (0에서 1 사이의 값)
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrolled = Math.max(0, Math.min(1, scrollContainer.scrollTop / scrollHeight));
      
      setScrollProgress(scrolled);
      
      // 스크롤 안내 숨기기
      if (scrolled > 0.05) {
        setShowScrollGuide(false);
      } else if (scrolled === 0) {
        setShowScrollGuide(true);
      }
      
      // 스크롤 위치에 따라 메시지 가시성 업데이트
      updateMessageVisibility(scrolled);
    };
    
    // 스크롤 위치에 따라 각 메시지의 가시성 계산
    const updateMessageVisibility = (progress: number) => {
      // 4개의 메시지를 스크롤 진행도에 따라 표시
      const newVisibility = [...messageVisibility];
      
      // 0-25% 스크롤: 첫 번째 메시지
      if (progress <= 0.25) {
        newVisibility[0] = { 
          opacity: calculateOpacity(progress, 0, 0.05, 0.20, 0.25), 
          transform: `translateY(${20 - progress * 80}px)` 
        };
      } else {
        newVisibility[0] = { opacity: 0, transform: 'translateY(-20px)' };
      }
      
      // 25-50% 스크롤: 두 번째 메시지
      if (progress > 0.25 && progress <= 0.5) {
        newVisibility[1] = { 
          opacity: calculateOpacity(progress, 0.25, 0.30, 0.45, 0.5), 
          transform: `translateY(${20 - (progress - 0.25) * 80}px)` 
        };
      } else {
        newVisibility[1] = { 
          opacity: progress <= 0.25 ? 0 : (progress > 0.5 ? 0 : 1), 
          transform: progress <= 0.25 ? 'translateY(20px)' : 'translateY(-20px)' 
        };
      }
      
      // 50-75% 스크롤: 세 번째 메시지
      if (progress > 0.5 && progress <= 0.75) {
        newVisibility[2] = { 
          opacity: calculateOpacity(progress, 0.5, 0.55, 0.70, 0.75), 
          transform: `translateY(${20 - (progress - 0.5) * 80}px)` 
        };
      } else {
        newVisibility[2] = { 
          opacity: progress <= 0.5 ? 0 : (progress > 0.75 ? 0 : 1), 
          transform: progress <= 0.5 ? 'translateY(20px)' : 'translateY(-20px)' 
        };
      }
      
      // 75-100% 스크롤: 네 번째 메시지
      if (progress > 0.75) {
        newVisibility[3] = { 
          opacity: calculateOpacity(progress, 0.75, 0.80, 0.95, 1.0),
          transform: `translateY(${20 - (progress - 0.75) * 80}px)` 
        };
      } else {
        newVisibility[3] = { opacity: 0, transform: 'translateY(20px)' };
      }
      
      setMessageVisibility(newVisibility);
    };
    
    // 점진적인 opacity 계산 함수
    const calculateOpacity = (current: number, start: number, fadeIn: number, fadeOut: number, end: number) => {
      if (current < start || current > end) return 0;
      if (current < fadeIn) return (current - start) / (fadeIn - start);
      if (current > fadeOut) return 1 - (current - fadeOut) / (end - fadeOut);
      return 1;
    };
    
    scrollContainer.addEventListener('scroll', handleScroll);
    
    // 초기 로드 시 현재 스크롤 위치에 따라 메시지 업데이트
    handleScroll();
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [messageVisibility]);

  // 메시지 내용 배열
  const messages = [
    "뜨거워지는 지구",
    "지구가 녹고 있어요",
    "하지만 작은 행동으로",
    "지구를 살릴 수 있습니다"
  ];

  return (
    <ComponentContainer>
      <ScrollContainer ref={scrollContainerRef}>
        <ContentContainer>
          <AnimationWrapper>
            <BackgroundGradient progress={scrollProgress} />
            <Stars />
            
            <MessageContainer>
              {messages.map((text, index) => (
                <Message 
                  key={index}
                  opacity={messageVisibility[index].opacity}
                  transform={messageVisibility[index].transform}
                >
                  {text}
                </Message>
              ))}
            </MessageContainer>
            
            <Moon progress={scrollProgress} />
            <Clouds progress={scrollProgress} />
            <Puddle progress={scrollProgress} />
            <Drips progress={scrollProgress} />
            
            {scrollProgress > 0.7 && (
              <WarningLabel progress={scrollProgress}>
                기후 위기! 지구 온도 상승 중
              </WarningLabel>
            )}
            
            <ScrollGuide show={showScrollGuide}>
              아래로 스크롤하세요
              <ScrollArrow />
            </ScrollGuide>
          </AnimationWrapper>
        </ContentContainer>
      </ScrollContainer>
    </ComponentContainer>
  );
};

export default AnimationScroll;