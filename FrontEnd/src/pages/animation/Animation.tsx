import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Components
import AnimationScroll from './components/AnimationScroll';

// styled-components 타입 추가
const EarthContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Earth: React.FC = () => {
  
  return (
    <div className='bg-slate-500'>
      <EarthContainer>
        {/* 스크롤에 따른 애니메이션 섹션 */}
        <Section>
          <AnimationScroll />
        </Section>
      </EarthContainer>
    </div>
  );
};

export default Earth;