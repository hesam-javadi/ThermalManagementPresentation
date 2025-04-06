import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, useGLTF, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import the useNavigation hook
import { useNavigation } from '../context/NavigationContext';

// 3D CPU Model component
const CPUModel = () => {
  // This would typically load a real model, we're using a placeholder cube
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial 
          color="#00ffff" 
          roughness={0.2} 
          metalness={0.8} 
          wireframe={true}
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
        
        {/* CPU Pins */}
        <group position={[0, -0.2, 0]}>
          {Array.from({ length: 10 }).map((_, i) => 
            Array.from({ length: 10 }).map((_, j) => (
              <mesh 
                key={`pin-${i}-${j}`} 
                position={[
                  -0.45 + i * 0.1, 
                  -0.1, 
                  -0.45 + j * 0.1
                ]}
                castShadow
              >
                <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
                <meshStandardMaterial 
                  color="#80ffff" 
                  metalness={1} 
                  roughness={0.3} 
                  wireframe={true}
                  emissive="#80ffff"
                  emissiveIntensity={0.3}
                />
              </mesh>
            ))
          )}
        </group>
        
        {/* Heat spreader */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.8, 0.05, 0.8]} />
          <meshStandardMaterial 
            color="#00ffff" 
            metalness={1} 
            roughness={0.1} 
            wireframe={true}
            emissive="#00ffff"
            emissiveIntensity={0.3}
          />
        </mesh>
      </mesh>
    </Float>
  );
};

// Heat particles component
const HeatParticles = () => {
  const count = 100;
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [sizes, setSizes] = useState<Float32Array | null>(null);
  
  useEffect(() => {
    // Generate random positions for the particles
    const pos = new Float32Array(count * 3);
    const particleSizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 1.5;
      pos[i3 + 1] = Math.random() * 0.2; // Start near the bottom of the CPU
      pos[i3 + 2] = (Math.random() - 0.5) * 1.5;
      
      particleSizes[i] = Math.random() * 0.05 + 0.01;
    }
    
    setPositions(pos);
    setSizes(particleSizes);
  }, [count]);
  
  // Animate particles moving straight upward
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current && positions) {
      const time = state.clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Constant upward movement with slight speed variation
        const speed = 0.004 + (i % 5) * 0.001;
        positions[i3 + 1] += speed;
        
        // Add very subtle horizontal drift
        positions[i3] += (Math.random() - 0.5) * 0.001;
        
        // Reset particles that go too high
        if (positions[i3 + 1] > 1) {
          positions[i3] = (Math.random() - 0.5) * 1.5;
          positions[i3 + 1] = 0; // Reset to bottom
          positions[i3 + 2] = (Math.random() - 0.5) * 1.5;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  if (!positions || !sizes) return null;
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
          args={[positions, 3]}
        />
        <bufferAttribute 
          attach="attributes-size" 
          count={count} 
          array={sizes} 
          itemSize={1} 
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#00ffff" 
        sizeAttenuation 
        transparent 
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// TDP data for the chart
const tdpData = [
  { year: 2006, amd: 110, intel: 130, amdCpu: "Manchester", intelCpu: "Presler" },
  { year: 2008, amd: 140, intel: 135, amdCpu: "Agena", intelCpu: "Yorkfield" },
  { year: 2010, amd: 125, intel: 90, amdCpu: "Thuban", intelCpu: "Lynnfield" },
  { year: 2012, amd: 125, intel: 80, amdCpu: "Vishera", intelCpu: "Ivy Bridge" },
  { year: 2013, amd: 220, intel: 75, amdCpu: "Vishera", intelCpu: "Haswell" },
  { year: 2014, amd: 125, intel: 80, amdCpu: "Vishera", intelCpu: "Haswell" },
  { year: 2016, amd: 65, intel: 90, amdCpu: "Carrizo", intelCpu: "Skylake" },
  { year: 2018, amd: 110, intel: 90, amdCpu: "Zen+", intelCpu: "Coffee Lake-R" },
  { year: 2020, amd: 110, intel: 125, amdCpu: "Zen 3", intelCpu: "Comet Lake" },
  { year: 2022, amd: 170, intel: 125, amdCpu: "Zen 4", intelCpu: "Raptor Lake-S" },
];

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <ChartTooltip>
        <p className="label">{`Year: ${label}`}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.dataKey === 'amd' 
              ? `AMD (${data.amdCpu}): ${entry.value}W` 
              : `Intel (${data.intelCpu}): ${entry.value}W`}
          </p>
        ))}
      </ChartTooltip>
    );
  }
  return null;
};

// Define slide sections
interface Section {
  id: number;
  title: string;
  content: React.ReactNode;
}

const Introduction: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [inSectionMode, setInSectionMode] = useState(true);
  
  // Use the navigation hook instead of direct context
  const { goToNextSlide, goToPrevSlide } = useNavigation();
  
  // Define the sections
  const sections: Section[] = [
    {
      id: 0,
      title: "Thermal Management",
      content: (
        <TitleContent>
          <MainTitle>Thermal Management</MainTitle>
          <MainSubtitle>in High-Performance CPUs and GPUs</MainSubtitle>
        </TitleContent>
      )
    },
    {
      id: 1,
      title: "Growing Importance",
      content: (
        <SectionContent>
          <SectionTitle>Why We Care About Thermal Management in Modern Processors?</SectionTitle>
          
          <SectionText style={{ marginBottom: '30px' }}>
            High-performance GPUs like the RTX 5090 now reach 575W TDP, generating significant heat in a compact area. 
            Without cooling, temperatures would rapidly reach 100°C (boiling water). Billions of transistors in modern 
            chips (e.g., 3nm nodes) dramatically increase thermal density. As seen in the chart below, the TDP of desktop 
            CPUs has generally increased over time, with notable spikes such as AMD's Vishera reaching ~220W in 2013.
            As manufacturing processes advance to smaller nodes, power is concentrated in increasingly small areas, making thermal 
            management a critical challenge for system designers.
          </SectionText>

          <ChartContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ChartTitle>CPU Thermal Design Power (TDP) Trends: 2004-2024</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={tdpData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="var(--text-secondary)"
                  tick={{ fill: 'var(--text-secondary)' }}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  domain={[0, 250]}
                  tick={{ fill: 'var(--text-secondary)' }}
                  label={{ 
                    value: 'TDP (Watts)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: 'var(--text-secondary)' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
                <Line 
                  type="monotone" 
                  dataKey="amd" 
                  name="AMD"
                  stroke="#ff4400" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 8, stroke: '#ff4400', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="intel" 
                  name="Intel"
                  stroke="#0066ff" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 8, stroke: '#0066ff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
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
    <IntroContainer>
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

      {/* 3D Model Section - Always visible */}
      <ModelSection>
        <Canvas camera={{ position: [1, 1, 3], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <spotLight 
            position={[0, 10, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.8} />
          
          <Center position={[0, 0, 0]}>
            <group position={[0, 0, 0]}>
              <CPUModel />
              <HeatParticles />
            </group>
          </Center>
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Canvas>
      </ModelSection>
    </IntroContainer>
  );
};

// Styled Components
const IntroContainer = styled.div`
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
  box-sizing: border-box;
  
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
  padding: 20px 20px 30px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  
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
  margin-bottom: 0;
  font-family: var(--font-display);
`;

const HighlightCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const HighlightCard = styled(motion.div)`
  background: rgba(10, 10, 36, 0.7);
  border-radius: 0;
  padding: 20px;
  border: 1px solid var(--primary);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
  position: relative;
  
  &:before {
    content: '>';
    color: var(--primary);
    position: absolute;
    left: 8px;
    top: 8px;
    font-family: var(--font-mono);
  }
`;

const CardIcon = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
`;

const CardTitle = styled.h4`
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--primary);
  font-family: var(--font-mono);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const CardText = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  font-family: var(--font-display);
  margin-bottom: 0;
`;

const ChartContainer = styled(motion.div)`
  margin-top: 30px;
  padding: 15px;
  background: rgba(10, 10, 36, 0.7);
  border: 1px solid var(--primary);
  border-radius: 0;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
  width: 100%;
`;

const ChartTitle = styled.h4`
  font-size: 18px;
  font-family: var(--font-mono);
  color: var(--primary);
  text-align: center;
  margin-bottom: 15px;
  letter-spacing: 1px;
`;

const ChartCaption = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 15px;
  font-style: italic;
`;

const ChartTooltip = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--primary);
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);

  p {
    margin: 3px 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-secondary);
  }

  p.label {
    color: var(--primary);
    font-weight: bold;
  }
`;

export default Introduction; 