import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
    BackgroundGradient, 
    Stars, 
    Clouds, 
    // Drips 
} from './AnimationScrollUtils';

// 인터페이스 정의
interface MessageProps {
  opacity: number;
  transform: string;
}

interface ProgressProps {
  progress: number;
}

interface ScrollGuideProps {
  show: boolean;
}

interface MessageVisibility {
  opacity: number;
  transform: string;
}

// 컴포넌트 전체 컨테이너 - 고정된 높이와 스크롤 가능하도록 설정
const ComponentContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// 내부 스크롤 컨테이너 - 부드러운 스크롤 효과 강화
const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
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

const Message = styled.div<MessageProps>`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 10px 0;
  opacity: ${props => props.opacity};
  transform: ${props => props.transform};
  transition: opacity 0.3s ease, transform 0.3s ease; /* 더 자연스러운 전환 */
  max-width: 80%;
  text-align: center;
`;

// 물웅덩이 효과
const Puddle = styled.div<ProgressProps>`
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
  transition: all 0.1s linear; /* 전환 시간 단축 */
`;

// 지구에 달 효과 추가
const Moon = styled.div<ProgressProps>`
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
  transition: all 0.1s linear; /* 전환 시간 단축 */
  
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

// 경고 레이블 - 버튼 포함
const WarningLabel = styled.div<ProgressProps>`
  position: absolute;
  bottom: 30%;
  background-color: rgba(155, 50, 50, 0.6);
  color: white;
  padding: 15px 20px;
  border-radius: 5px;
  transform: translateY(${props => (1 - props.progress) * 50}px);
  opacity: ${props => props.progress > 0.7 ? 1 : 0};
  transition: opacity 0.2s linear, transform 0.2s linear;
  font-weight: bold;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

// 버튼 스타일
const ActionButton = styled.button`
  background-color: white;
  color: #d32f2f;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

// 체크박스 컨테이너
const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  margin-top: 5px;
  gap: 5px;
`;

// 체크박스 스타일
const Checkbox = styled.input`
  cursor: pointer;
`;

// 하단 스크롤 안내
const ScrollGuide = styled.div<ScrollGuideProps>`
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

// 스킵 버튼
const SkipToEndButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  z-index: 100;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const AnimationScroll: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [targetScrollProgress, setTargetScrollProgress] = useState<number>(0);
    const [currentScrollProgress, setCurrentScrollProgress] = useState<number>(0);
    const [showScrollGuide, setShowScrollGuide] = useState<boolean>(true);
    const [skipAnimation, setSkipAnimation] = useState<boolean>(false);
    const [messageVisibility, setMessageVisibility] = useState<MessageVisibility[]>([
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 0, transform: 'translateY(20px)' }
    ]);
    
    // 컴포넌트 마운트 시 로컬 스토리지에서 애니메이션 스킵 여부 확인
    useEffect(() => {
        const skipPref = localStorage.getItem('skipEarthAnimation');
        if (skipPref === 'true') {
            // 애니메이션 스킵이 설정되어 있으면 지구 환경 페이지로 바로 이동
            window.location.href = '/earth';
        }
    }, []);
    
    // 지구 환경 페이지로 이동하는 함수
    const navigateToEarth = () => {
        window.location.href = '/earth';
    };
    
    // 애니메이션 스킵 설정 함수
    const handleSkipAnimationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkipAnimation(e.target.checked);
        if (e.target.checked) {
            localStorage.setItem('skipEarthAnimation', 'true');
        } else {
            localStorage.removeItem('skipEarthAnimation');
        }
    };
    
    // 스크롤 진행 값을 부드럽게 보간하는 효과
    useEffect(() => {
        // 스크롤이 움직이지 않을 때는 업데이트하지 않음
        if (Math.abs(targetScrollProgress - currentScrollProgress) < 0.001) {
            return;
        }
        
        let animationFrame: number | undefined;
        
        const smoothScrollProgress = () => {
            // 현재 값과 목표 값 사이를 부드럽게 보간
            const diff = targetScrollProgress - currentScrollProgress;
            
            // 안정성을 위해 적당한 값으로 조정
            const easeFactor = 0.3;
            
            if (Math.abs(diff) < 0.001) {
                setCurrentScrollProgress(targetScrollProgress);
            } else {
                setCurrentScrollProgress(prev => prev + diff * easeFactor);
                animationFrame = requestAnimationFrame(smoothScrollProgress);
            }
        };
        
        animationFrame = requestAnimationFrame(smoothScrollProgress);
        
        return () => {
            if (animationFrame !== undefined) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [targetScrollProgress, currentScrollProgress]);
    
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;
        
        const handleScroll = () => {
            // 스크롤 진행도 계산 (0에서 1 사이의 값)
            const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            const scrolled = Math.max(0, Math.min(1, scrollContainer.scrollTop / scrollHeight));
            
            // 목표 진행도 설정 (실제 스크롤 위치)
            setTargetScrollProgress(scrolled);
            
            // 스크롤 안내 숨기기
            if (scrolled > 0.05) {
                setShowScrollGuide(false);
            } else if (scrolled === 0) {
                setShowScrollGuide(true);
            }
        };
        
        scrollContainer.addEventListener('scroll', handleScroll);
        
        // 초기 로드 시 현재 스크롤 위치에 따라 메시지 업데이트
        handleScroll();
        
        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    // 메시지 가시성 업데이트
    useEffect(() => {
        // 스크롤 진행도에 큰 변화가 없으면 업데이트하지 않음
        const newVisibility: MessageVisibility[] = [];
        let shouldUpdate = false;
        
        // 0-25% 스크롤: 첫 번째 메시지
        if (currentScrollProgress <= 0.25) {
            const newOpacity = calculateOpacity(currentScrollProgress, 0, 0.02, 0.20, 0.25);
            const newTransform = `translateY(${20 - currentScrollProgress * 80}px)`;
            
            if (Math.abs(newOpacity - messageVisibility[0].opacity) > 0.01 || 
                newTransform !== messageVisibility[0].transform) {
                shouldUpdate = true;
            }
            
            newVisibility[0] = { 
                opacity: newOpacity, 
                transform: newTransform
            };
        } else {
            newVisibility[0] = { opacity: 0, transform: 'translateY(-20px)' };
        }
        
        // 비슷한 방식으로 나머지 메시지 처리
        // ...
        
        // 나머지 메시지는 간단하게 처리
        if (currentScrollProgress > 0.25 && currentScrollProgress <= 0.5) {
            newVisibility[1] = { 
                opacity: calculateOpacity(currentScrollProgress, 0.25, 0.27, 0.45, 0.5), 
                transform: `translateY(${20 - (currentScrollProgress - 0.25) * 80}px)` 
            };
        } else {
            newVisibility[1] = { 
                opacity: currentScrollProgress <= 0.25 ? 0 : (currentScrollProgress > 0.5 ? 0 : 1), 
                transform: currentScrollProgress <= 0.25 ? 'translateY(20px)' : 'translateY(-20px)' 
            };
        }
        
        if (currentScrollProgress > 0.5 && currentScrollProgress <= 0.75) {
            newVisibility[2] = { 
                opacity: calculateOpacity(currentScrollProgress, 0.5, 0.52, 0.70, 0.75), 
                transform: `translateY(${20 - (currentScrollProgress - 0.5) * 80}px)` 
            };
        } else {
            newVisibility[2] = { 
                opacity: currentScrollProgress <= 0.5 ? 0 : (currentScrollProgress > 0.75 ? 0 : 1), 
                transform: currentScrollProgress <= 0.5 ? 'translateY(20px)' : 'translateY(-20px)' 
            };
        }
        
        if (currentScrollProgress > 0.75) {
            newVisibility[3] = { 
                opacity: calculateOpacity(currentScrollProgress, 0.75, 0.77, 0.95, 1.0),
                transform: `translateY(${20 - (currentScrollProgress - 0.75) * 80}px)` 
            };
        } else {
            newVisibility[3] = { opacity: 0, transform: 'translateY(20px)' };
        }
        
        // 실제로 변화가 있을 때만 상태 업데이트
        if (shouldUpdate || 
            JSON.stringify(newVisibility) !== JSON.stringify(messageVisibility)) {
            setMessageVisibility(newVisibility);
        }
    }, [currentScrollProgress, messageVisibility]);
    
    // 점진적인 opacity 계산 함수
    const calculateOpacity = (current: number, start: number, fadeIn: number, fadeOut: number, end: number): number => {
        if (current < start || current > end) return 0;
        if (current < fadeIn) return (current - start) / (fadeIn - start);
        if (current > fadeOut) return 1 - (current - fadeOut) / (end - fadeOut);
        return 1;
    };
    
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
                        <BackgroundGradient progress={currentScrollProgress} />
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
                        
                        <Moon progress={currentScrollProgress} />
                        <Clouds progress={currentScrollProgress} />
                        <Puddle progress={currentScrollProgress} />
                        {/* <Drips progress={currentScrollProgress} /> */}
                        
                        {currentScrollProgress > 0.7 && (
                            <WarningLabel progress={currentScrollProgress}>
                                기후 위기! 지구 온도 상승 중
                                <ActionButton onClick={navigateToEarth}>
                                    지구 환경 보러 가기
                                </ActionButton>
                                <CheckboxContainer>
                                    <Checkbox 
                                        type="checkbox" 
                                        id="skipAnimation" 
                                        checked={skipAnimation}
                                        onChange={handleSkipAnimationChange}
                                    />
                                    <label htmlFor="skipAnimation">다음부터 애니메이션 보지 않기</label>
                                </CheckboxContainer>
                            </WarningLabel>
                        )}
                        
                        <ScrollGuide show={showScrollGuide}>
                            아래로 스크롤하세요
                            <ScrollArrow />
                        </ScrollGuide>
                        
                        {/* 하단에 바로 이동 버튼 추가 */}
                        <SkipToEndButton onClick={() => {
                            const scrollContainer = scrollContainerRef.current;
                            if (scrollContainer) {
                                const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                                scrollContainer.scrollTo({
                                    top: scrollHeight * 0.9, // 마지막 메시지로 바로 이동
                                    behavior: 'smooth'
                                });
                            }
                        }}>
                            마지막으로 이동
                        </SkipToEndButton>
                    </AnimationWrapper>
                </ContentContainer>
            </ScrollContainer>
        </ComponentContainer>
    );
};

export default AnimationScroll;