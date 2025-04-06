import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

// Import the useNavigation hook
import { useNavigation } from '../context/NavigationContext';

// 3D CPU Model component
const CPUModel = () => {
  // Create a more structured thermal management visualization with retro aesthetic
  return (
    <group position={[0, 0, 0]}>
      {/* Base motherboard */}
      <mesh receiveShadow position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.5, 0.05, 2.5]} />
        <meshStandardMaterial color="#003344" emissive="#002233" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Motherboard grid pattern */}
      <group position={[0, -0.195, 0]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`grid-h-${i}`} position={[0, 0, -1.2 + i * 0.35]}>
            <boxGeometry args={[2.4, 0.001, 0.01]} />
            <meshBasicMaterial color="#00AACC" opacity={0.3} transparent />
          </mesh>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`grid-v-${i}`} position={[-1.2 + i * 0.35, 0, 0]}>
            <boxGeometry args={[0.01, 0.001, 2.4]} />
            <meshBasicMaterial color="#00AACC" opacity={0.3} transparent />
          </mesh>
        ))}
      </group>
      
      {/* CPU socket */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#001a2a" emissive="#00111b" emissiveIntensity={0.2} />
      </mesh>
      
      {/* CPU die */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial 
          color="#102030" 
          emissive="#ff2000"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Heat spreader */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial 
          color="#405060" 
          emissive="#304050"
          emissiveIntensity={0.1}
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Heat sink base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.9]} />
        <meshStandardMaterial 
          color="#506070" 
          emissive="#405060"
          emissiveIntensity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Heat sink fins */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh 
          key={`fin-${i}`} 
          position={[
            -0.4 + (i % 6) * 0.16, 
            0.35, 
            i < 6 ? -0.2 : 0.2
          ]}
          castShadow
        >
          <boxGeometry args={[0.06, 0.4, 0.5]} />
          <meshStandardMaterial
            color="#708090"
            emissive="#607080"
            emissiveIntensity={0.1}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Heat pipes */}
      {Array.from({ length: 2 }).map((_, i) => (
        <mesh
          key={`pipe-${i}`}
          position={[0, 0.2, -0.15 + i * 0.3]}
          rotation={[0, Math.PI/2, 0]}
        >
          <cylinderGeometry args={[0.05, 0.05, 1.1, 12]} />
          <meshStandardMaterial 
            color="#cc7722" 
            emissive="#aa5511"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
      
      {/* Circuit traces on motherboard */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`traces-${i}`}>
          <mesh position={[
            -1 + i * 0.4, 
            -0.17, 
            0.8 + (i % 2) * 0.4
          ]}>
            <boxGeometry args={[0.3, 0.01, 0.01]} />
            <meshStandardMaterial 
              color="#00DDEE" 
              emissive="#00DDEE"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[
            -1 + i * 0.4, 
            -0.17, 
            -0.8 - (i % 2) * 0.4
          ]}>
            <boxGeometry args={[0.3, 0.01, 0.01]} />
            <meshStandardMaterial 
              color="#00DDEE" 
              emissive="#00DDEE"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
      
      {/* Small components on motherboard */}
      {Array.from({ length: 6 }).map((_, i) => {
        const posX = (Math.random() - 0.5) * 2;
        const posZ = (Math.random() - 0.5) * 2;
        // Avoid placing components over the CPU
        const adjustedX = (Math.abs(posX) < 0.7) ? (posX < 0 ? -0.7 - Math.random() * 0.5 : 0.7 + Math.random() * 0.5) : posX;
        const adjustedZ = (Math.abs(posZ) < 0.7) ? (posZ < 0 ? -0.7 - Math.random() * 0.5 : 0.7 + Math.random() * 0.5) : posZ;
        
        return (
          <mesh key={`component-${i}`} position={[adjustedX, -0.13, adjustedZ]}>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#203040" : "#304050"} 
              emissive={i % 2 === 0 ? "#102030" : "#203040"}
              emissiveIntensity={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Heat particles component
const HeatParticles = () => {
  const count = 100;
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [sizes, setSizes] = useState<Float32Array | null>(null);
  
  useEffect(() => {
    // Generate particles around and above the CPU
    const pos = new Float32Array(count * 3);
    const particleSizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Position particles above the CPU die
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 0.5;
      
      pos[i3] = Math.cos(angle) * distance; // X position
      pos[i3 + 1] = Math.random() * 0.1; // Y position starts near the CPU surface
      pos[i3 + 2] = Math.sin(angle) * distance; // Z position
      
      particleSizes[i] = Math.random() * 0.03 + 0.01;
    }
    
    setPositions(pos);
    setSizes(particleSizes);
  }, [count]);
  
  // Animate particles moving upward from the CPU through the heatsink
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current && positions) {
      const time = state.clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Upward movement with slight outward drift as particles rise
        const height = positions[i3 + 1];
        const speed = 0.005 + (i % 5) * 0.002;
        
        // Move up faster as they rise (convection)
        positions[i3 + 1] += speed * (1 + height);
        
        // Add some horizontal drift based on height
        const driftFactor = 0.0003 * height;
        positions[i3] += (positions[i3] > 0 ? 1 : -1) * driftFactor;
        positions[i3 + 2] += (positions[i3 + 2] > 0 ? 1 : -1) * driftFactor;
        
        // Reset particles that go too high
        if (positions[i3 + 1] > 0.8) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 0.5;
          
          positions[i3] = Math.cos(angle) * distance;
          positions[i3 + 1] = Math.random() * 0.1; // Reset to just above CPU
          positions[i3 + 2] = Math.sin(angle) * distance;
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
        color="#ee3300" 
        sizeAttenuation 
        transparent 
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Define slide sections
interface Section {
  id: number;
  title: string;
  content: React.ReactNode;
}

// Main component
const HeatImpact: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [inSectionMode, setInSectionMode] = useState(true);
  
  // Use the navigation hook
  const { goToNextSlide, goToPrevSlide } = useNavigation();
  
  // Define the sections
  const sections: Section[] = [
    {
      id: 0,
      title: "Heat Impact",
      content: (
        <TitleContent>
          <MainTitle>Impact of Heat on Processors</MainTitle>
          <MainSubtitle>How excessive temperatures degrade computing systems</MainSubtitle>
        </TitleContent>
      )
    },
    {
      id: 1,
      title: "Thermal Throttling",
      content: (
        <SectionContent>
          <SectionTitle>1- Reduce Performance (Thermal Throttling)</SectionTitle>
          <SectionText>
            Thermal throttling is a critical self-protection mechanism in CPUs and GPUs to prevent overheating damage. 
            When temperatures rise excessively, the processor automatically reduces its clock speed and voltage to lower heat output. 
            This process is triggered by onboard thermal sensors that monitor the chip's junction temperature, comparing it to the TJMax threshold—the 
            maximum safe operating temperature defined by the manufacturer.
          </SectionText>
          
          <SectionText>
            Throttling ensures the chip avoids permanent damage but significantly impacts performance, causing delays in tasks like 
            gaming or rendering. The effect is more pronounced in high-performance systems with TDPs exceeding 200W, where sustained 
            heat buildup is common.
          </SectionText>
          
          <HighlightCards>
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardIcon>⚡</CardIcon>
              <CardTitle>Clock Speed Drop</CardTitle>
              <CardText>
                Reduces from 5 GHz to 3 GHz under heavy load
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardIcon>📉</CardIcon>
              <CardTitle>Performance Impact</CardTitle>
              <CardText>
                Lowers FPS by 10-20% in gaming scenarios
              </CardText>
            </HighlightCard>
          </HighlightCards>
          
          <HighlightCards style={{ marginTop: '20px' }}>
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <CardIcon>🌡️</CardIcon>
              <CardTitle>Trigger Temperature</CardTitle>
              <CardText>
                Activates near TJMax (85-100°C range)
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <CardIcon>🎮</CardIcon>
              <CardTitle>Affected Workloads</CardTitle>
              <CardText>
                Gaming, video rendering, and 3D modeling
              </CardText>
            </HighlightCard>
          </HighlightCards>
        </SectionContent>
      )
    },
    {
      id: 2,
      title: "Electromigration",
      content: (
        <SectionContent>
          <SectionTitle>2- Reduce Lifespan (Electromigration)</SectionTitle>
          <SectionText>
            Electromigration is a phenomenon that significantly reduces the lifespan of CPUs and GPUs when exposed to high temperatures. 
            It occurs when sustained heat causes metal atoms in the chip's circuits to migrate due to the flow of electric current, 
            leading to structural degradation of the silicon. This process creates voids or shorts in the interconnects, weakening the chip over time.
          </SectionText>
          
          <SectionText>
            In high-performance systems, where temperatures often exceed 90°C under load, electromigration accelerates, potentially 
            cutting a chip's lifespan from a decade to just a few years. Proper thermal management is essential to mitigate this risk 
            and ensure long-term reliability.
          </SectionText>
          
          <HighlightCards>
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardIcon>🌡️</CardIcon>
              <CardTitle>Cause</CardTitle>
              <CardText>
                High temperatures (above 90°C) and current density
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardIcon>⚡</CardIcon>
              <CardTitle>Effect</CardTitle>
              <CardText>
                Voids and shorts in chip interconnects
              </CardText>
            </HighlightCard>
          </HighlightCards>
          
          <HighlightCards style={{ marginTop: '20px' }}>
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <CardIcon>⏳</CardIcon>
              <CardTitle>Lifespan Impact</CardTitle>
              <CardText>
                Reduces from 10 years to 5 years
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <CardIcon>❄️</CardIcon>
              <CardTitle>Mitigation</CardTitle>
              <CardText>
                Effective cooling to keep temperatures below 80°C
              </CardText>
            </HighlightCard>
          </HighlightCards>
        </SectionContent>
      )
    },
    {
      id: 3,
      title: "Internal Connections",
      content: (
        <SectionContent>
          <SectionTitle>3- Weaken Internal Connection</SectionTitle>
          <SectionText>
            Sustained high temperatures in CPUs and GPUs can weaken the internal connections critical to their operation. 
            Heat above 90°C stresses the solder joints and the bonding between the silicon die and the integrated heat 
            spreader (IHS), leading to micro-cracks or delamination over time. This degradation compromises the chip's 
            structural integrity, causing instability during operation.
          </SectionText>
          
          <SectionText>
            In high-performance systems, where thermal cycles are frequent due to heavy workloads, these weakened connections 
            increase the risk of intermittent failures or complete chip breakdown, making robust thermal management essential 
            for reliability.
          </SectionText>
          
          <StatsContainer>
            <StatBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatValue>Joints</StatValue>
              <StatLabel>Solder joints and die-to-IHS bonding are most affected</StatLabel>
            </StatBox>
            
            <StatBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StatValue>90°C+</StatValue>
              <StatLabel>Temperature threshold for connection damage over time</StatLabel>
            </StatBox>
            
            <StatBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <StatValue>Cracks</StatValue>
              <StatLabel>Micro-cracks, delamination, and operational instability</StatLabel>
            </StatBox>
            
            <StatBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <StatValue>Cycling</StatValue>
              <StatLabel>Higher risk in systems with frequent thermal cycling</StatLabel>
            </StatBox>
          </StatsContainer>
        </SectionContent>
      )
    },
    {
      id: 4,
      title: "Other Components",
      content: (
        <SectionContent>
          <SectionTitle>4- Effects on Other Components</SectionTitle>
          <SectionText>
            Excessive heat from high-performance CPUs and GPUs doesn't just affect the chip itself—it also impacts surrounding 
            components within the system. Elevated temperatures can overheat voltage regulator modules (VRMs) on the motherboard, 
            which manage power delivery to the processor, leading to instability or failure. High case temperatures, often reaching 
            60°C or more, stress other hardware like RAM, storage drives, and the power supply unit (PSU).
          </SectionText>
          
          <SectionText>
            This thermal stress increases the risk of system-wide crashes, data corruption, or premature hardware failure, 
            underscoring the need for comprehensive thermal management in modern computing setups.
          </SectionText>
          
          <StatsContainer>
            <StatBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatValue>VRMs</StatValue>
              <StatLabel>Overheating causes power delivery issues and instability</StatLabel>
            </StatBox>
            
            <StatBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StatValue>60°C+</StatValue>
              <StatLabel>Case temperatures stress RAM and storage devices</StatLabel>
            </StatBox>
            
            <StatBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <StatValue>PSU</StatValue>
              <StatLabel>High heat reduces power supply efficiency and lifespan</StatLabel>
            </StatBox>
            
            <StatBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <StatValue>Risk</StatValue>
              <StatLabel>System crashes, data corruption, and component failure</StatLabel>
            </StatBox>
          </StatsContainer>
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

      {/* 3D Visualization Section */}
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
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const StatBox = styled(motion.div)`
  background: rgba(10, 10, 36, 0.7);
  border: 1px solid var(--primary);
  padding: 20px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
`;

const StatValue = styled.div`
  font-family: var(--font-mono);
  font-size: 32px;
  color: var(--primary);
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
`;

export default HeatImpact; 