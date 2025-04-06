import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Float, Center, useHelper } from '@react-three/drei';
import * as THREE from 'three';

// Import the useNavigation hook
import { useNavigation } from '../context/NavigationContext';

// Types for components
interface HotZoneProps {
  position: [number, number, number];
  intensity: number;
  size: number;
}

interface CoreLabelProps {
  position: [number, number, number];
  label: string;
  temp: string;
}

interface Section {
  id: number;
  title: string;
  content: React.ReactNode;
}

// 3D CPU heat map component
const HeatMapModel = () => {
  // Light for hotspots
  const spotLightRef = useRef<THREE.SpotLight>(null!);
  useHelper(spotLightRef, THREE.SpotLightHelper, 'red');
  
  return (
    <group>
      {/* CPU Base */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[2, 0.1, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* CPU Die */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.1, 1.8]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Hot Zones */}
      <HotZone position={[-0.5, 0.1, -0.5]} intensity={1.5} size={0.4} />
      <HotZone position={[0.5, 0.1, 0.5]} intensity={1.2} size={0.3} />
      <HotZone position={[0.6, 0.1, -0.6]} intensity={0.8} size={0.2} />
      <HotZone position={[-0.3, 0.1, 0.4]} intensity={1.0} size={0.25} />
      
      {/* Core Labels */}
      <group position={[0, 0.15, 0]}>
        <CoreLabel position={[-0.5, 0, -0.5]} label="Core 1" temp="95°C" />
        <CoreLabel position={[0.5, 0, 0.5]} label="Core 2" temp="88°C" />
        <CoreLabel position={[0.6, 0, -0.6]} label="Core 3" temp="82°C" />
        <CoreLabel position={[-0.3, 0, 0.4]} label="Core 4" temp="85°C" />
      </group>
    </group>
  );
};

const HotZone = ({ position, intensity, size }: HotZoneProps) => {
  return (
    <group position={position}>
      {/* Heat visual effect */}
      <mesh>
        <cylinderGeometry args={[size, size * 0.8, 0.01, 32]} />
        <meshBasicMaterial 
          color={new THREE.Color(
            Math.min(1, 0.5 + intensity * 0.5), 
            Math.max(0, 0.3 - intensity * 0.3), 
            0
          )} 
          transparent={true}
          opacity={0.7}
        />
      </mesh>
      
      {/* Point light for glow */}
      <pointLight 
        color={new THREE.Color(1, 0.3, 0)} 
        intensity={intensity * 2} 
        distance={size * 3}
      />
    </group>
  );
};

const CoreLabel = ({ position, label, temp }: CoreLabelProps) => {
  return (
    <group position={position}>
      <Text3D
        font="/fonts/Inter_Regular.json"
        size={0.1}
        height={0.01}
        curveSegments={5}
        bevelEnabled={false}
        letterSpacing={0.02}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-0.2, 0, 0.1]}
      >
        {label}
        <meshBasicMaterial color="cyan" />
      </Text3D>
      
      <Text3D
        font="/fonts/Inter_Regular.json"
        size={0.08}
        height={0.01}
        curveSegments={5}
        bevelEnabled={false}
        letterSpacing={0.01}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-0.1, 0, 0.2]}
      >
        {temp}
        <meshBasicMaterial color="red" />
      </Text3D>
    </group>
  );
};

// Replace with a circuit-style visualization
const CircuitThermalVisualization = ({ powerLevel }: { powerLevel: number }) => {
  // Calculate temperature based on power level
  const maxTemp = 100; // Maximum temperature in °C
  const minTemp = 30;  // Minimum temperature in °C
  const temperature = minTemp + ((maxTemp - minTemp) * powerLevel / 100);
  
  const requestRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [animationPhase, setAnimationPhase] = useState(0);

  // Setup canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const { width, height } = canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Slow down animation based on frame rate
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;
    
    const draw = (timestamp: number) => {
      if (timestamp - lastTime < interval) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }
      
      // Update last time
      lastTime = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
      const gridSize = 30;
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Center in canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw CPU
      const cpuSize = Math.min(canvas.width, canvas.height) * 0.4;
      const cpuX = centerX - cpuSize / 2;
      const cpuY = centerY - cpuSize / 2;
      
      // CPU outer case
      ctx.fillStyle = '#111';
      ctx.fillRect(cpuX, cpuY, cpuSize, cpuSize);
      
      // CPU inner circuit
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(cpuX + 10, cpuY + 10, cpuSize - 20, cpuSize - 20);
      
      // CPU pins
      const pinSize = 5;
      const pinSpacing = 15;
      const pinsPerSide = Math.floor(cpuSize / pinSpacing) - 2;
      
      // Draw pins on each side
      ctx.fillStyle = 'rgba(150, 150, 150, 0.6)';
      
      // Bottom pins
      for (let i = 1; i <= pinsPerSide; i++) {
        ctx.fillRect(
          cpuX + (cpuSize / (pinsPerSide + 1)) * i - pinSize/2,
          cpuY + cpuSize,
          pinSize,
          10
        );
      }
      
      // Circuit paths
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      
      // Create circuit patterns
      const drawCircuitPath = (x: number, y: number, width: number, height: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y + height/2);
        ctx.lineTo(x + width/4, y + height/2);
        ctx.lineTo(x + width/4, y + height/4);
        ctx.lineTo(x + width/2, y + height/4);
        ctx.lineTo(x + width/2, y + height*3/4);
        ctx.lineTo(x + width*3/4, y + height*3/4);
        ctx.lineTo(x + width*3/4, y + height/2);
        ctx.lineTo(x + width, y + height/2);
        ctx.stroke();
      };
      
      // Draw circuit patterns inside CPU
      const circuitPadding = 20;
      drawCircuitPath(
        cpuX + circuitPadding, 
        cpuY + circuitPadding, 
        cpuSize - circuitPadding*2, 
        cpuSize - circuitPadding*2
      );
      
      // Draw smaller circuit details
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
      drawCircuitPath(
        cpuX + circuitPadding*1.5, 
        cpuY + circuitPadding*1.5, 
        cpuSize - circuitPadding*3, 
        cpuSize - circuitPadding*3
      );
      
      // Heat particles moving along circuits
      const numParticles = Math.floor(powerLevel / 10) + 1;
      
      // Animate particles flowing through circuits
      const particleSize = 4;
      const speed = powerLevel / 100; // Speed based on power level
      
      // Update animation phase
      setAnimationPhase(prev => (prev + 0.01 * speed) % 1);
      
      // Draw particles
      ctx.fillStyle = `rgba(255, ${Math.max(0, 255 - powerLevel * 2)}, 0, 0.7)`;
      
      // Circuit 1 (outer)
      const circuit1Points = [
        { x: cpuX + circuitPadding, y: cpuY + cpuSize/2 },
        { x: cpuX + cpuSize/4, y: cpuY + cpuSize/2 },
        { x: cpuX + cpuSize/4, y: cpuY + cpuSize/4 },
        { x: cpuX + cpuSize/2, y: cpuY + cpuSize/4 },
        { x: cpuX + cpuSize/2, y: cpuY + cpuSize*3/4 },
        { x: cpuX + cpuSize*3/4, y: cpuY + cpuSize*3/4 },
        { x: cpuX + cpuSize*3/4, y: cpuY + cpuSize/2 },
        { x: cpuX + cpuSize - circuitPadding, y: cpuY + cpuSize/2 }
      ];
      
      // Draw particles at positions based on animation phase
      for (let i = 0; i < numParticles; i++) {
        const particlePhase = (animationPhase + i / numParticles) % 1;
        
        // Calculate position along the circuit path
        const segment = Math.floor(particlePhase * (circuit1Points.length - 1));
        const segmentPhase = (particlePhase * (circuit1Points.length - 1)) % 1;
        
        const start = circuit1Points[segment];
        const end = circuit1Points[segment + 1];
        
        const x = start.x + (end.x - start.x) * segmentPhase;
        const y = start.y + (end.y - start.y) * segmentPhase;
        
        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw temperature readout
      const tempFontSize = Math.min(canvas.width, canvas.height) * 0.08;
      ctx.font = `bold ${tempFontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Gradient text for temperature
      const tempGradient = ctx.createLinearGradient(
        centerX - 50, centerY, centerX + 50, centerY
      );
      tempGradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
      tempGradient.addColorStop(1, `rgba(255, ${Math.max(0, 255 - powerLevel * 2)}, 0, 1)`);
      
      ctx.fillStyle = tempGradient;
      ctx.fillText(`${Math.round(temperature)}°C`, centerX, centerY);
      
      // Add indicator label
      ctx.font = `${tempFontSize * 0.4}px monospace`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('CORE TEMP', centerX, centerY - tempFontSize * 0.7);
      
      // Power indicator
      ctx.font = `${tempFontSize * 0.4}px monospace`;
      ctx.fillText(`POWER: ${powerLevel}%`, centerX, centerY + tempFontSize * 0.7);
      
      requestRef.current = requestAnimationFrame(draw);
    };
    
    requestRef.current = requestAnimationFrame(draw);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [powerLevel, dimensions, animationPhase]);

  return (
    <VisualizationCanvas ref={canvasRef} />
  );
};

// Main component
const ThermalTechnologies: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [powerLevel, setPowerLevel] = useState<number>(50);
  const [inSectionMode, setInSectionMode] = useState(true);
  
  // Use the navigation hook
  const { goToNextSlide, goToPrevSlide } = useNavigation();
  
  // Define the sections
  const sections: Section[] = [
    {
      id: 0,
      title: "Heat Generation",
      content: (
        <TitleContent>
          <MainTitle>Understanding Heat Generation</MainTitle>
          <MainSubtitle>The Physics Behind CPU & GPU Thermal Challenges</MainSubtitle>
        </TitleContent>
      )
    },
    {
      id: 1,
      title: "How Heat Forms",
      content: (
        <SectionContent>
          <SectionTitle>How CPUs & GPUs Generate Heat</SectionTitle>
          <SectionText>
            Modern processors generate heat through the movement of electrons across billions
            of transistors. As electricity flows through the silicon pathways, it encounters 
            resistance that converts electrical energy into heat.
          </SectionText>
          
          <KeyFactsHeading>Key Factors Influencing Heat Generation:</KeyFactsHeading>
          <FactsList>
            <Fact
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FactTitle>Transistor Density</FactTitle>
              <FactText>
                Modern CPUs can have over 50 billion transistors in a die smaller than your fingernail
              </FactText>
            </Fact>
            
            <Fact
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FactTitle>Clock Speed</FactTitle>
              <FactText>
                Higher frequencies increase power consumption and heat output exponentially
              </FactText>
            </Fact>
          </FactsList>
        </SectionContent>
      )
    },
    {
      id: 2,
      title: "Power vs Heat",
      content: (
        <SectionContent>
          <SectionTitle>Power & Heat Relationship</SectionTitle>
          <SectionText>
            The relationship between power consumption and heat generation is direct. 
            Try adjusting the power level below to see how it affects heat output.
          </SectionText>
          
          <PowerControls>
            <label>Power Level: {powerLevel}%</label>
            <SliderContainer>
              <Slider 
                type="range" 
                min={10} 
                max={100} 
                value={powerLevel} 
                onChange={(e) => setPowerLevel(parseInt(e.target.value))}
              />
              <SliderTrack>
                <SliderProgress style={{ width: `${powerLevel}%` }} />
              </SliderTrack>
            </SliderContainer>
            
            <HeatOutput>
              <HeatIcon>🔥</HeatIcon>
              <HeatBar>
                <HeatLevel 
                  style={{ width: `${powerLevel * 1.2}%` }}
                >
                  {Math.round(30 + ((100 - 30) * powerLevel / 100))}°C
                </HeatLevel>
              </HeatBar>
            </HeatOutput>
          </PowerControls>
        </SectionContent>
      )
    },
    {
      id: 3,
      title: "Trends",
      content: (
        <SectionContent>
          <SectionTitle>Power Density Trends</SectionTitle>
          <SectionText>
            Power density in CPUs has increased dramatically over the years, making 
            thermal management one of the greatest challenges in processor design.
          </SectionText>
          
          <ChartContainer>
            <ChartBar height="10%" label="1990" value="10 W/cm²" />
            <ChartBar height="20%" label="2000" value="25 W/cm²" />
            <ChartBar height="40%" label="2010" value="50 W/cm²" />
            <ChartBar height="70%" label="2020" value="100 W/cm²" />
            <ChartBar height="90%" label="2025" value="150 W/cm²" />
            <ChartLabel>CPU Power Density (W/cm²) by Year</ChartLabel>
          </ChartContainer>
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

      {/* Minimalist Circuit Visualization */}
      <ModelSection>
        <CircuitThermalVisualization powerLevel={powerLevel} />
      </ModelSection>
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
    grid-template-rows: 1fr auto;
    grid-template-areas:
      "content"
      "model";
  }
`;

const ModelSection = styled.div`
  position: relative;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--primary);
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

const KeyFactsHeading = styled.h4`
  font-size: 18px;
  color: var(--primary);
  margin-bottom: 15px;
  font-family: var(--font-mono);
`;

const FactsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Fact = styled(motion.div)`
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid var(--primary);
  padding: 15px;
`;

const FactTitle = styled.h5`
  font-size: 16px;
  color: var(--primary);
  margin-bottom: 8px;
`;

const FactText = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const PowerControls = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  label {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-secondary);
  }
`;

const SliderContainer = styled.div`
  position: relative;
  height: 30px;
  display: flex;
  align-items: center;
`;

const Slider = styled.input`
  position: absolute;
  width: 100%;
  opacity: 0;
  z-index: 10;
  cursor: pointer;
  height: 100%;
`;

const SliderTrack = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  position: relative;
`;

const SliderProgress = styled.div`
  position: absolute;
  height: 100%;
  background: var(--primary);
`;

const HeatOutput = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
`;

const HeatIcon = styled.div`
  font-size: 24px;
`;

const HeatBar = styled.div`
  flex-grow: 1;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
`;

const HeatLevel = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #ff00ff);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  color: white;
  font-weight: 600;
  font-family: var(--font-mono);
  transition: width 0.3s ease;
`;

const ChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.3);
  padding: 20px;
  position: relative;
  margin-top: 30px;
`;

const ChartBar = styled.div<{ height: string; label: string; value: string }>`
  width: 40px;
  height: ${props => props.height};
  background: linear-gradient(180deg, var(--primary), var(--secondary));
  position: relative;
  
  &:after {
    content: '${props => props.label}';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
  }
  
  &:before {
    content: '${props => props.value}';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: var(--primary);
    white-space: nowrap;
    font-family: var(--font-mono);
  }
`;

const ChartLabel = styled.div`
  position: absolute;
  bottom: -45px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
`;

// Add new styled component for the canvas
const VisualizationCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
`;

export default ThermalTechnologies; 