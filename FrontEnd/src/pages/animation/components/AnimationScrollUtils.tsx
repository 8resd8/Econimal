import React from 'react';
import styled, { keyframes } from 'styled-components';

// 물방울이 떨어지는 애니메이션
const drip = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translateY(100px) scale(0.5);
    opacity: 0;
  }
`;

// 물방울 떨어지는 효과
export const Droplet = styled.div<{ delay: number; duration: number; left: string }>`
  position: absolute;
  background: linear-gradient(135deg, rgba(66, 158, 189, 0.8), rgba(30, 107, 135, 0.6));
  width: 10px;
  height: 15px;
  border-radius: 50% 50% 50% 50%;
  top: 50%;
  left: ${props => props.left};
  animation: ${drip} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 1;
`;

// 별이 반짝이는 애니메이션
const twinkle = keyframes`
  0% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
`;

// 배경 별 효과
export const Star = styled.div<{ delay: number; duration: number; top: string; left: string; size: string }>`
  position: absolute;
  background-color: white;
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${twinkle} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 0;
`;

// 배경 그라데이션 효과
export const BackgroundGradient = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg, 
    rgba(25, 25, 112, ${props => 1 - props.progress * 0.4}) 0%, 
    rgba(65, 105, 225, ${props => 0.7 - props.progress * 0.3}) 50%, 
    rgba(135, 206, 250, ${props => 0.5 - props.progress * 0.2}) 100%
  );
  z-index: -1;
`;

// 지구 위의 구름 효과 
const cloudFloat = keyframes`
  0% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(-10px);
  }
`;

export const Cloud = styled.div<{ progress: number; top: string; left: string; size: string; delay: number }>`
  position: absolute;
  width: ${props => props.size};
  height: calc(${props => props.size} * 0.6);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  top: ${props => props.top};
  left: ${props => props.left};
  opacity: ${props => 1 - props.progress * 0.8};
  animation: ${cloudFloat} ${props => 5 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 3;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }
  
  &::before {
    width: calc(${props => props.size} * 0.6);
    height: calc(${props => props.size} * 0.6);
    top: -40%;
    left: 25%;
  }
  
  &::after {
    width: calc(${props => props.size} * 0.4);
    height: calc(${props => props.size} * 0.4);
    top: -30%;
    left: 60%;
  }
`;

// 떨어지는 물방울 컴포넌트
export const Drips: React.FC<{ progress: number }> = ({ progress }) => {
  // 진행도에 따라 물방울 수 결정 (진행도가 높을수록 더 많은 물방울)
  const dripCount = Math.floor(progress * 10) + 1;
  
  return (
    <>
      {Array.from({ length: dripCount }).map((_, i) => (
        <Droplet 
          key={i}
          delay={i * 0.7}
          duration={1 + Math.random() * 2}
          left={`${20 + (i * 5) + Math.random() * 30}%`}
        />
      ))}
    </>
  );
};

// 배경 별 컴포넌트
export const Stars: React.FC = () => {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <Star 
          key={i}
          delay={Math.random() * 5}
          duration={1 + Math.random() * 3}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          size={`${2 + Math.random() * 3}px`}
        />
      ))}
    </>
  );
};

// 구름 컴포넌트
export const Clouds: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <>
      <Cloud progress={progress} top="20%" left="20%" size="40px" delay={0} />
      <Cloud progress={progress} top="15%" left="60%" size="50px" delay={1} />
      <Cloud progress={progress} top="40%" left="15%" size="30px" delay={0.5} />
      <Cloud progress={progress} top="30%" left="70%" size="35px" delay={1.5} />
    </>
  );
};