import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Create direct arrow icon components to ensure proper loading
const LeftArrowIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const RightArrowIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface ControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrevious: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  currentSlide, 
  totalSlides, 
  onNext, 
  onPrevious 
}) => {
  // Track if we're in section navigation mode
  const [inSectionMode, setInSectionMode] = useState<boolean>(true);
  
  // Add keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle arrow keys differently based on section navigation mode
      if (e.key === 'ArrowRight') {
        if (!inSectionMode) {
          onNext();
        }
        // In section mode, arrow keys are handled by the slide components
      } else if (e.key === 'ArrowLeft') {
        if (!inSectionMode) {
          onPrevious();
        }
        // In section mode, arrow keys are handled by the slide components
      }
      
      // Toggle section mode with Tab key
      if (e.key === 'Tab') {
        e.preventDefault(); // Prevent default tab behavior
        setInSectionMode(prev => !prev);
        // Display mode information (you might want to add a visual indicator)
        console.log(`Navigation mode: ${!inSectionMode ? 'Section' : 'Slide'}`);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious, inSectionMode]);

  return (
    <>
      {/* Left (Previous) Button */}
      <LeftButton 
        onClick={onPrevious}
        disabled={currentSlide === 0}
        initial={false}
        animate={{ opacity: currentSlide === 0 ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <IconWrapper>
          <LeftArrowIcon />
        </IconWrapper>
      </LeftButton>
      
      {/* Right (Next) Button */}
      <RightButton 
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        initial={false}
        animate={{ opacity: currentSlide === totalSlides - 1 ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <IconWrapper>
          <RightArrowIcon />
        </IconWrapper>
      </RightButton>
      
      {/* Progress Dots */}
      <ProgressDotsContainer>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <ProgressDot 
            key={index}
            active={index <= currentSlide}
            current={index === currentSlide}
            onClick={() => {
              // Set navigation mode to slide mode
              setInSectionMode(false);
              
              // Navigate directly to clicked slide
              const diff = index - currentSlide;
              if (diff > 0) {
                // Need to go forward
                for (let i = 0; i < diff; i++) {
                  onNext();
                }
              } else if (diff < 0) {
                // Need to go backward
                for (let i = 0; i < Math.abs(diff); i++) {
                  onPrevious();
                }
              }
            }}
          />
        ))}
      </ProgressDotsContainer>
    </>
  );
};

// Left Navigation Button
const LeftButton = styled(motion.button)<{ disabled: boolean }>`
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 0;
  background: transparent;
  border: 2px solid ${props => props.disabled 
    ? 'rgba(0, 255, 255, 0.2)' 
    : 'var(--primary)'};
  color: ${props => props.disabled 
    ? 'rgba(0, 255, 255, 0.2)' 
    : 'var(--primary)'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  box-shadow: ${props => props.disabled
    ? 'none'
    : '0 0 10px rgba(0, 255, 255, 0.4)'};
  transition: box-shadow 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    display: block;
    stroke: currentColor;
  }
  
  &:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
  }
`;

// Right Navigation Button
const RightButton = styled(motion.button)<{ disabled: boolean }>`
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 0;
  background: transparent;
  border: 2px solid ${props => props.disabled 
    ? 'rgba(0, 255, 255, 0.2)' 
    : 'var(--primary)'};
  color: ${props => props.disabled 
    ? 'rgba(0, 255, 255, 0.2)' 
    : 'var(--primary)'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  box-shadow: ${props => props.disabled
    ? 'none'
    : '0 0 10px rgba(0, 255, 255, 0.4)'};
  transition: box-shadow 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    display: block;
    stroke: currentColor;
  }
  
  &:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
  }
`;

// Progress Dots Container
const ProgressDotsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  width: fit-content;
  margin: 0 auto;
  display: flex;
  gap: 15px;
  z-index: 20;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--primary);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
`;

// Individual Progress Dot
const ProgressDot = styled.div<{ active: boolean; current: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 0; /* Square shape */
  background: ${props => {
    if (props.current) return 'var(--primary)';
    return props.active ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 255, 255, 0.1)';
  }};
  border: 1px solid ${props => {
    if (props.current) return 'var(--primary)';
    return props.active ? 'var(--primary)' : 'rgba(0, 255, 255, 0.3)';
  }};
  box-shadow: ${props => {
    if (props.current) return '0 0 8px var(--primary)';
    return props.active ? '0 0 5px rgba(0, 255, 255, 0.5)' : 'none';
  }};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 0 8px var(--primary);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const IconWrapper = styled.span`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
`;

export default Controls; 