import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import the useNavigation hook
import { useNavigation } from '../context/NavigationContext';

// Define slide sections
interface Section {
  id: number;
  title: string;
  content: React.ReactNode;
}

const EmptySlide: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [inSectionMode, setInSectionMode] = useState(true);
  
  // Use the navigation hook
  const { goToNextSlide, goToPrevSlide } = useNavigation();
  
  // Define the sections - just a placeholder for now
  const sections: Section[] = [
    {
      id: 0,
      title: "Empty Slide",
      content: (
        <TitleContent>
          <MainTitle>Coming Soon</MainTitle>
          <MainSubtitle>Future content will be added here</MainSubtitle>
        </TitleContent>
      )
    }
  ];
  
  // Navigation functions
  const goToNextSection = useCallback(() => {
    if (activeSection < sections.length - 1) {
      setActiveSection(prev => prev + 1);
    } else {
      // Navigate to next slide
      goToNextSlide();
      // Reset to first section when moving to next slide
      setActiveSection(0);
    }
  }, [activeSection, sections.length, goToNextSlide]);

  const goToPreviousSection = useCallback(() => {
    if (activeSection > 0) {
      setActiveSection(prev => prev - 1);
    } else {
      // Navigate to previous slide and go to the last section immediately
      // We need to set a flag to tell the previous slide to jump to the last section
      sessionStorage.setItem('jumpToLastSection', 'true');
      goToPrevSlide();
    }
  }, [activeSection, goToPrevSlide]);
  
  // Check for the jumpToLastSection flag when the component mounts
  useEffect(() => {
    const shouldJumpToLast = sessionStorage.getItem('jumpToLastSection') === 'true';
    if (shouldJumpToLast) {
      setActiveSection(sections.length - 1);
      sessionStorage.removeItem('jumpToLastSection');
    }
  }, [sections.length]);
  
  // Add wheel event handler for scrolling between sections
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent default browser scrolling
      e.preventDefault();
      
      if (e.deltaY > 0) {
        goToNextSection();
      } else if (e.deltaY < 0) {
        goToPreviousSection();
      }
    };
    
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [goToNextSection, goToPreviousSection]);
  
  // Track section/slide mode with the Tab key
  useEffect(() => {
    const handleModeToggle = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setInSectionMode(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleModeToggle);
    return () => window.removeEventListener('keydown', handleModeToggle);
  }, []);
  
  // Update keyboard navigation to handle Space, Backspace, and arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for navigation keys
      if (e.key === ' ' || e.key === 'Backspace' || 
          (inSectionMode && (e.key === 'ArrowRight' || e.key === 'ArrowLeft'))) {
        e.preventDefault();
        
        switch (e.key) {
          case ' ':
            goToNextSection();
            break;
          case 'Backspace':
            goToPreviousSection();
            break;
          case 'ArrowRight':
            if (inSectionMode) goToNextSection();
            break;
          case 'ArrowLeft':
            if (inSectionMode) goToPreviousSection();
            break;
          default:
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNextSection, goToPreviousSection, inSectionMode]);
  
  return (
    <SlideContainer>
      <ContentArea ref={contentRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%' }}
          >
            {sections[activeSection].content}
          </motion.div>
        </AnimatePresence>
      </ContentArea>
    </SlideContainer>
  );
};

// Styled Components
const SlideContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  height: 100%;
  padding: 20px;
  overflow: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TitleContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
`;

const MainTitle = styled.h1`
  font-size: 52px;
  text-align: center;
  margin: 0;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
`;

const MainSubtitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  margin-top: 10px;
`;

export default EmptySlide; 