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

// Main component
const Conclusion: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [inSectionMode, setInSectionMode] = useState(true);
  
  // Use the navigation hook
  const { goToNextSlide, goToPrevSlide } = useNavigation();
  
  // Define the sections 
  const sections: Section[] = [
    {
      id: 0,
      title: "Conclusion",
      content: (
        <TitleContent>
          <MainTitle>Conclusion</MainTitle>
        </TitleContent>
      )
    },
    {
      id: 1,
      title: "Key Takeaways",
      content: (
        <SectionContent>
          <SectionTitle>Key Takeaways and Future Outlook</SectionTitle>
          <SectionText>
            Effective thermal management is crucial for high-performance CPUs and GPUs, ensuring optimal performance, reliability, and longevity in modern computing systems. Heat generation, driven by high TDPs and power density, poses significant challenges like thermal throttling, electromigration, and component stress, as seen in real-world examples. Technologies such as air cooling, liquid cooling (AIO and custom), and advanced methods like phase change and vapor chambers address these issues, each suited to specific TDP ranges and use cases. As chip designs continue to shrink and TDPs rise, future thermal solutions will need to innovate, balancing efficiency, cost, and sustainability to meet growing demands.
          </SectionText>
          
          <RelatedItemsList>
            <ListTitle>Key Points</ListTitle>
            <ListItem>
              <ListItemTitle>Heat Challenges</ListItemTitle>
              <ListItemText>Throttling, lifespan reduction, and system instability.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Cooling Solutions</ListItemTitle>
              <ListItemText>Air, liquid, and advanced methods for all TDPs.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Future Need</ListItemTitle>
              <ListItemText>Innovative, efficient cooling for rising TDPs.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Takeaway</ListItemTitle>
              <ListItemText>Proper thermal management ensures performance and reliability.</ListItemText>
            </ListItem>
          </RelatedItemsList>
        </SectionContent>
      )
    }
  ];
  
  // Update navigation functions to handle cross-slide navigation
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
      {/* Content Section with Split Scrollbar */}
      <ContentWrapper>
        {/* Split Scrollbar Navigation */}
        <SplitScrollbar>
          {sections.map((section) => (
            <ScrollSection 
              key={section.id}
              active={activeSection === section.id}
              total={sections.length}
              onClick={() => setActiveSection(section.id)}
            />
          ))}
        </SplitScrollbar>
        
        {/* Section Content with Animation */}
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
      </ContentWrapper>

      {/* Visual Section */}
      <VisualSection>
        <VisualContent>
          {activeSection === 0 ? (
            <ConclusionVisual>
              <GradientBorder>
                <ConclusionIcon>✓</ConclusionIcon>
              </GradientBorder>
            </ConclusionVisual>
          ) : (
            <KeyTakeawaysVisual>
              <TakeawayItem>
                <TakeawayIcon>🔥</TakeawayIcon>
                <TakeawayText>Heat Issues</TakeawayText>
              </TakeawayItem>
              <TakeawayItem>
                <TakeawayIcon>❄️</TakeawayIcon>
                <TakeawayText>Cooling Solutions</TakeawayText>
              </TakeawayItem>
              <TakeawayItem>
                <TakeawayIcon>🔬</TakeawayIcon>
                <TakeawayText>Future Innovation</TakeawayText>
              </TakeawayItem>
              <TakeawayItem>
                <TakeawayIcon>⚙️</TakeawayIcon>
                <TakeawayText>System Reliability</TakeawayText>
              </TakeawayItem>
            </KeyTakeawaysVisual>
          )}
        </VisualContent>
      </VisualSection>
    </SlideContainer>
  );
};

// Styled Components
const SlideContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 30px;
  height: 100%;
  width: 100%;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "model"
      "content";
  }
`;

const VisualSection = styled.div`
  position: relative;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VisualContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ConclusionVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const GradientBorder = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(45deg, var(--primary), #80E0FF);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 30px rgba(0, 204, 255, 0.6);
`;

const ConclusionIcon = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #000814;
  color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
  font-weight: bold;
`;

const KeyTakeawaysVisual = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const TakeawayItem = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--primary);
  border-radius: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 204, 255, 0.3);
  }
`;

const TakeawayIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const TakeawayText = styled.div`
  color: var(--primary);
  font-family: var(--font-mono);
  text-align: center;
  font-size: 14px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border: 1px solid var(--primary);
  background: rgba(0, 0, 0, 0.3);
`;

const SplitScrollbar = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const ScrollSection = styled.div<{ active: boolean; total: number }>`
  flex: 1;
  background: ${props => props.active ? 'var(--primary)' : 'rgba(0, 255, 255, 0.1)'};
  cursor: pointer;
  transition: background 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'rgba(0, 255, 255, 0.3)'};
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 255, 255, 0.4);
  }
`;

const ContentArea = styled.div`
  height: 100%;
  padding-right: 30px; /* Make space for the scrollbar */
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
  font-size: 72px;
  text-align: center;
  margin: 0;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
`;

const SectionContent = styled.div`
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 28px;
  color: var(--primary);
  margin-bottom: 20px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SectionText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 30px;
  font-family: var(--font-display);
`;

const RelatedItemsList = styled.div`
  border: 1px solid rgba(0, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 0;
  margin-bottom: 30px;
`;

const ListTitle = styled.h4`
  font-size: 18px;
  color: var(--primary);
  margin-bottom: 15px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ListItem = styled.div`
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 2px solid var(--primary);
`;

const ListItemTitle = styled.h5`
  font-size: 16px;
  color: var(--primary);
  margin-bottom: 5px;
  font-family: var(--font-mono);
  font-weight: 500;
`;

const ListItemText = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
`;

export default Conclusion; 