import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Main component
const TheEnd: React.FC = () => {
  useEffect(() => {
    // Play subtle audio effect when slide appears
    const audioEffect = new Audio();
    audioEffect.volume = 0.2;
    
    try {
      audioEffect.play().catch(e => {
        // Auto-play might be blocked by browser
        console.log('Audio autoplay blocked by browser', e);
      });
    } catch (error) {
      console.log('Audio playback error', error);
    }
    
    return () => {
      audioEffect.pause();
    };
  }, []);

  return (
    <EndContainer>
      <CenterContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <EndTitle>The End.</EndTitle>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
        >
          <EndSubtitle>CPU Thermal Management Solutions</EndSubtitle>
        </motion.div>
      </CenterContent>
      
      <ParticleContainer>
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} />
        ))}
      </ParticleContainer>
      
      <GlowingGrid />
    </EndContainer>
  );
};

// Keyframes for particle movement
const floatAnimation = keyframes`
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) translateX(${() => Math.random() * 100 - 50}px) rotate(${() => Math.random() * 360}deg);
    opacity: 0;
  }
`;

const pulseGrid = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.3;
  }
`;

// Styled Components
const EndContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #000814 0%, #001233 100%);
  overflow: hidden;
`;

const CenterContent = styled.div`
  position: relative;
  z-index: 20;
  text-align: center;
  padding: 40px;
  border-radius: 0;
  box-shadow: 0 0 50px rgba(0, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--primary);
`;

const EndTitle = styled.h1`
  font-size: 96px;
  font-weight: 900;
  margin: 0 0 20px 0;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  letter-spacing: 2px;
`;

const EndSubtitle = styled.h2`
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-mono);
  font-weight: 400;
  letter-spacing: 2px;
  margin: 0;
`;

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--primary);
  bottom: -10px;
  left: ${() => Math.random() * 100}vw;
  opacity: 0;
  animation: ${floatAnimation} ${() => 10 + Math.random() * 15}s linear infinite;
  animation-delay: ${() => Math.random() * 5}s;
  box-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary);
  z-index: 1;
`;

const GlowingGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 0;
  opacity: 0.5;
  animation: ${pulseGrid} 4s ease-in-out infinite;
`;

export default TheEnd; 