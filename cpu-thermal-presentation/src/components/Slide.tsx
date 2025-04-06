import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Slide props interface
interface SlideProps {
  children: React.ReactNode;
}

// Styled components
const SlideContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

// Animation variants
const slideVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Slide component
const Slide: React.FC<SlideProps> = ({ children }) => {
  return (
    <SlideContainer
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6 }}
      variants={slideVariants}
    >
      {/* Visual flash effect on slide transition */}
      <TransitionFlash 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.6, times: [0, 0.1, 1] }}
      />
      <ScanLines />
      <RetroPanel>
        <CornerTL />
        <CornerTR />
        <CornerBL />
        <CornerBR />
        <BorderTop />
        <BorderRight />
        <BorderBottom />
        <BorderLeft />
        <PanelHeader>
          <HeaderText>&gt; CPU THERMAL MANAGEMENT_</HeaderText>
          <HeaderIndicator />
        </PanelHeader>
        <PanelContent>
          {children}
        </PanelContent>
      </RetroPanel>
    </SlideContainer>
  );
};

// Scan lines overlay effect
const ScanLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(0, 0, 0, 0.1) 1px,
    rgba(0, 0, 0, 0.1) 2px
  );
  pointer-events: none;
  z-index: 20;
  opacity: 0.2;
`;

const RetroPanel = styled.div`
  width: 100%;
  height: 100%;
  background: var(--card-bg);
  border-radius: 0px;
  padding: 40px;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 1px solid rgba(0, 255, 255, 0.2);
    pointer-events: none;
  }
`;

// Corner elements
const Corner = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
`;

const CornerTL = styled(Corner)`
  top: 0;
  left: 0;
  border-top: 2px solid var(--primary);
  border-left: 2px solid var(--primary);
`;

const CornerTR = styled(Corner)`
  top: 0;
  right: 0;
  border-top: 2px solid var(--primary);
  border-right: 2px solid var(--primary);
`;

const CornerBL = styled(Corner)`
  bottom: 0;
  left: 0;
  border-bottom: 2px solid var(--primary);
  border-left: 2px solid var(--primary);
`;

const CornerBR = styled(Corner)`
  bottom: 0;
  right: 0;
  border-bottom: 2px solid var(--primary);
  border-right: 2px solid var(--primary);
`;

// Border elements
const Border = styled.div`
  position: absolute;
  background: var(--primary);
  opacity: 0.6;
  z-index: 1;
`;

const BorderTop = styled(Border)`
  top: 0;
  left: 20px;
  right: 20px;
  height: 1px;
`;

const BorderRight = styled(Border)`
  top: 20px;
  right: 0;
  bottom: 20px;
  width: 1px;
`;

const BorderBottom = styled(Border)`
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
`;

const BorderLeft = styled(Border)`
  top: 20px;
  left: 0;
  bottom: 20px;
  width: 1px;
`;

const PanelHeader = styled.div`
  position: relative;
  border-bottom: 1px solid var(--primary);
  margin: -20px -20px 20px -20px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  font-family: var(--font-mono);
  opacity: 0.9;
`;

const HeaderText = styled.div`
  color: var(--primary);
  font-size: 16px;
  letter-spacing: 1px;
`;

// Blinking cursor
const HeaderIndicator = styled.div`
  width: 10px;
  height: 16px;
  background: var(--primary);
  margin-left: 5px;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  padding-right: 10px;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 0;
  }
`;

// Add TransitionFlash component
const TransitionFlash = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary);
  pointer-events: none;
  z-index: 100;
`;

export default Slide; 