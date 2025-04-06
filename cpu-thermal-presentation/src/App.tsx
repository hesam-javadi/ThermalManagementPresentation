import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from './styles/GlobalStyles';
import Slide from './components/Slide';
import BackgroundEffect from './components/BackgroundEffect';
import Introduction from './slides/Introduction';
import HeatImpact from './slides/HeatImpact';
import ThermalTechnologies from './slides/ThermalTechnologies';
import ThermalManagement from './slides/ThermalManagement';
import Conclusion from './slides/Conclusion';
import TheEnd from './slides/TheEnd';
import Controls from './components/Controls';
import { NavigationProvider } from './context/NavigationContext';
import GridForeground from './components/GridForeground';

// Custom cursor component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number, y: number, opacity: number }>>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);
  const inactivityTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Make cursor visible again if it was hidden
      setIsVisible(true);
      
      // Set moving state to true
      setIsMoving(true);
      
      // Add new position to trail only while moving
      setTrail(prevTrail => {
        const newTrail = [{ x: e.clientX, y: e.clientY, opacity: 1 }, ...prevTrail];
        return newTrail.slice(0, 10).map((point, index) => ({
          ...point,
          opacity: 1 - (index * 0.1)
        }));
      });
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      // Reset inactivity timer
      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current);
      }
      
      // Set timeout to clear trail after movement stops
      timeoutRef.current = window.setTimeout(() => {
        setIsMoving(false);
        setTrail([]);
      }, 50); // Immediate effect (50ms delay for detection)
      
      // Set inactivity timeout (5 seconds)
      inactivityTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Initial inactivity timeout
    inactivityTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  // Only render the cursor components if it's visible
  if (!isVisible) return null;

  return (
    <>
      {/* Cursor trail - only shown while moving */}
      {isMoving && trail.map((point, index) => (
        <div 
          key={`trail-${index}`}
          className="cursor-trail"
          style={{ 
            left: `${point.x}px`, 
            top: `${point.y}px`,
            opacity: point.opacity
          }}
        />
      ))}
      
      {/* Main cursor */}
      <div 
        className={`custom-cursor ${isActive ? 'active' : ''}`} 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`
        }}
      />
    </>
  );
};

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 6;
  
  // Slides content
  const slides = [
    <Introduction key="intro" />,
    <HeatImpact key="heat-impact" />,
    <ThermalTechnologies key="thermal-tech" />,
    <ThermalManagement key="thermal-management" />,
    <Conclusion key="conclusion" />,
    <TheEnd key="the-end" />
  ];
  
  const goToNextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, totalSlides]);
  
  const goToPrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  return (
    <AppContainer>
      <GlobalStyles />
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* 3D Background */}
      <CanvasContainer>
        <Canvas>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <BackgroundEffect />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </CanvasContainer>
      
      {/* Grid Foreground */}
      <GridForeground />
      
      {/* Wrap the entire presentation in the NavigationProvider */}
      <NavigationProvider
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onNext={goToNextSlide}
        onPrevious={goToPrevSlide}
      >
        {/* Presentation Container with Content Only */}
        <PresentationContainer>
          {/* Main Presentation Content with AnimatePresence for transitions */}
          <ContentContainer>
            <AnimatePresence mode="wait">
              <Slide key={`slide-${currentSlide}`}>
                {slides[currentSlide]}
              </Slide>
            </AnimatePresence>
          </ContentContainer>
        </PresentationContainer>
        
        {/* Fixed Controls at the Bottom */}
        <ControlsWrapper>
          <Controls 
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onNext={goToNextSlide}
            onPrevious={goToPrevSlide}
          />
        </ControlsWrapper>
      </NavigationProvider>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background);
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const PresentationContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 90%;
  height: 85%;
  max-width: 1600px;
  margin-top: -30px; /* Move it slightly up */
`;

const ControlsWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 30;
  pointer-events: none; /* Allow clicks to pass through the wrapper but not its children */
  
  & > * {
    pointer-events: auto; /* Re-enable pointer events on children */
  }
`;

export default App;