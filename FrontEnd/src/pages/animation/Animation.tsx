import React from 'react';
import styled from 'styled-components';

// Components
import AnimationScroll from './components/AnimationScroll';

// Remove the nested containers that might be causing layout issues
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0;
`;

const Earth = () => {
  return (
    <AppContainer>
      <AnimationScroll />
    </AppContainer>
  );
};

export default Earth;