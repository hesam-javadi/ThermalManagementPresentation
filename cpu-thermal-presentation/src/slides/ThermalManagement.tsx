import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// Import the useNavigation hook
import { useNavigation } from '../context/NavigationContext';
import { CircuitThermalVisualization } from '../components/CircuitThermalVisualization';
import IntelCpuWithWindEffect from '../components/IntelCpuWithWindEffect';

// Import images
import heatsinkImg from '../assets/heatsink.png';
import cpuFanImg from '../assets/cpuFan.png';
import aioWatercoolingImg from '../assets/AIO-watercooling.png';
import customWatercoolingImg from '../assets/Custom-watercooling.png';
import phasechangeCoolerImg from '../assets/Phasechange-cooler.png';

// Define slide sections
interface Section {
  id: number;
  title: string;
  content: React.ReactNode;
  visualContent?: React.ReactNode;
}

// Main component
const ThermalManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [inSectionMode, setInSectionMode] = useState(true);
  
  // Use the navigation hook
  const { goToNextSlide, goToPrevSlide } = useNavigation();
  
  // Define the sections 
  const sections: Section[] = [
    {
      id: 0,
      title: "Thermal Management",
      content: (
        <TitleContent>
          <MainTitle>Thermal Management Solution</MainTitle>
          <MainSubtitle>How to Cool Down Our Processor?</MainSubtitle>
        </TitleContent>
      ),
      visualContent: <IntelCpuWithWindEffect />
    },
    {
      id: 1,
      title: "Air Cooling",
      content: (
        <SectionContent>
          <SectionTitle>1- Air Cooling - Heat Sinks</SectionTitle>
          <SectionText>
            Heat sinks are a fundamental air cooling solution for managing heat in CPUs and GPUs, designed to dissipate thermal energy through conduction and convection. Made from high-thermal-conductivity materials like aluminum or copper, heat sinks feature a large surface area with fins to maximize heat transfer to the surrounding air. They absorb heat from the processor via a baseplate, often paired with thermal paste for better contact, and rely on natural or forced airflow to cool down. Heat sinks are cost-effective and reliable, making them ideal for systems with TDPs up to 150W, though their efficiency can be limited in high-performance setups.
          </SectionText>
          
          <RelatedItemsList>
            <ListTitle>Key Points</ListTitle>
            <ListItem>
              <ListItemTitle>Material</ListItemTitle>
              <ListItemText>Aluminum or copper for high thermal conductivity.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Design</ListItemTitle>
              <ListItemText>Fins increase surface area for heat dissipation.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>TDP Range</ListItemTitle>
              <ListItemText>Effective for up to 150W systems.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Limitation</ListItemTitle>
              <ListItemText>Performance drops in high-TDP, compact setups.</ListItemText>
            </ListItem>
          </RelatedItemsList>
        </SectionContent>
      ),
      visualContent: <SectionImage src={heatsinkImg} alt="CPU Heat Sink" />
    },
    {
      id: 2,
      title: "Fans & Airflow",
      content: (
        <SectionContent>
          <SectionTitle>2- Air Cooling - Fans and Airflow Optimization</SectionTitle>
          <SectionText>
            Fans and airflow optimization are critical components of air cooling, enhancing the efficiency of heat dissipation in CPUs and GPUs. Fans actively move air across heat sinks, increasing convection to transfer heat away from the processor and out of the case. Airflow optimization involves strategic fan placement—intake fans bring in cool air, while exhaust fans expel hot air—ensuring a consistent flow path. High-performance systems often use PWM (Pulse Width Modulation) fans for dynamic speed control, balancing cooling and noise. This method is effective for TDPs up to 150W but may struggle with higher thermal loads.
          </SectionText>
          
          <RelatedItemsList>
            <ListTitle>Key Points</ListTitle>
            <ListItem>
              <ListItemTitle>Fan Role</ListItemTitle>
              <ListItemText>Moves air across heat sinks for convection.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Airflow Strategy</ListItemTitle>
              <ListItemText>Intake and exhaust fans for consistent flow.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>PWM Fans</ListItemTitle>
              <ListItemText>Adjust speed dynamically for noise control.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>TDP Limit</ListItemTitle>
              <ListItemText>Best for systems up to 150W.</ListItemText>
            </ListItem>
          </RelatedItemsList>
        </SectionContent>
      ),
      visualContent: <SectionImage src={cpuFanImg} alt="CPU Fan and Airflow" />
    },
    {
      id: 3,
      title: "Liquid Cooling",
      content: (
        <SectionContent>
          <SectionTitle>3- Liquid Cooling - AIO (All-In-One) Coolers</SectionTitle>
          <SectionText>
            All-In-One (AIO) liquid coolers are a popular thermal management solution for high-performance CPUs and GPUs, offering superior heat dissipation compared to air cooling. AIO systems consist of a water block that absorbs heat from the processor, a pump to circulate coolant, and a radiator with fans to release heat into the air. The sealed, pre-assembled design ensures easy installation and minimal maintenance, making AIOs ideal for TDPs above 200W. They provide lower temperatures and quieter operation, though they require sufficient case space for the radiator.
          </SectionText>
          
          <RelatedItemsList>
            <ListTitle>Key Points</ListTitle>
            <ListItem>
              <ListItemTitle>Components</ListItemTitle>
              <ListItemText>Water block, pump, radiator, and fans.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>TDP Range</ListItemTitle>
              <ListItemText>Effective for 200W+ high-performance systems.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Benefits</ListItemTitle>
              <ListItemText>Lower temperatures, quieter than air cooling.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Requirement</ListItemTitle>
              <ListItemText>Needs case space for radiator (e.g., 240mm).</ListItemText>
            </ListItem>
          </RelatedItemsList>
        </SectionContent>
      ),
      visualContent: <SectionImage src={aioWatercoolingImg} alt="AIO Water Cooling" />
    },
    {
      id: 4,
      title: "Custom Water Cooling",
      content: (
        <SectionContent>
          <SectionTitle>4- Liquid Cooling - Custom Water Cooling</SectionTitle>
          <SectionText>
            Custom water cooling is an advanced liquid cooling solution tailored for enthusiasts and high-performance systems, offering unparalleled thermal management for CPUs and GPUs. Unlike AIO coolers, custom loops are user-designed, featuring a reservoir, pump, water blocks for multiple components (CPU, GPU), tubing, and radiators with fans to dissipate heat. This setup provides exceptional cooling for TDPs exceeding 300W, allowing for overclocking and silent operation. However, custom water cooling requires significant expertise, space, and investment, along with regular maintenance to prevent leaks or coolant degradation.
          </SectionText>
          
          <RelatedItemsList>
            <ListTitle>Key Points</ListTitle>
            <ListItem>
              <ListItemTitle>Components</ListItemTitle>
              <ListItemText>Reservoir, pump, water blocks, tubing, radiators.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>TDP Range</ListItemTitle>
              <ListItemText>Ideal for 300W+ overclocked systems.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Advantages</ListItemTitle>
              <ListItemText>Superior cooling, silent operation, aesthetic appeal.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Challenges</ListItemTitle>
              <ListItemText>High cost, complex setup, maintenance needs.</ListItemText>
            </ListItem>
          </RelatedItemsList>
        </SectionContent>
      ),
      visualContent: <SectionImage src={customWatercoolingImg} alt="Custom Water Cooling" />
    },
    {
      id: 5,
      title: "Advanced Methods",
      content: (
        <SectionContent>
          <SectionTitle>5- Advanced Cooling Methods</SectionTitle>
          <SectionSubtitle>Phase Change Cooling, Thermoelectric Cooling, and Vapor Chamber Technology</SectionSubtitle>
          <SectionText>
            Advanced cooling methods like phase change cooling, thermoelectric cooling, and vapor chamber technology offer cutting-edge solutions for extreme thermal management in high-performance CPUs and GPUs. Phase change cooling uses a refrigerant that evaporates to absorb heat, achieving sub-zero temperatures. Thermoelectric cooling (TEC) employs the Peltier effect, transferring heat via electric current, ideal for spot cooling. Vapor chamber technology spreads heat evenly across a flat chamber using a liquid-vapor cycle, enhancing heat dissipation in compact devices. These methods are highly effective for TDPs above 300W but are costly and complex.
          </SectionText>
          
          <RelatedItemsList>
            <ListTitle>Key Points</ListTitle>
            <ListItem>
              <ListItemTitle>Phase Change Cooling</ListItemTitle>
              <ListItemText>Refrigerant-based, achieves sub-zero temperatures.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Thermoelectric Cooling</ListItemTitle>
              <ListItemText>Uses Peltier effect for spot cooling.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Vapor Chamber</ListItemTitle>
              <ListItemText>Spreads heat evenly in compact spaces.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemTitle>Use Case</ListItemTitle>
              <ListItemText>Best for 300W+ TDPs, overclocking scenarios.</ListItemText>
            </ListItem>
          </RelatedItemsList>
        </SectionContent>
      ),
      visualContent: <SectionImage src={phasechangeCoolerImg} alt="Phase Change Cooler" />
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

      {/* Visualization Section */}
      <ModelSection>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%', width: '100%' }}
          >
            {sections[activeSection].visualContent}
          </motion.div>
        </AnimatePresence>
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

const SectionSubtitle = styled.h4`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  font-family: var(--font-mono);
  font-style: italic;
  letter-spacing: 0.5px;
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

const SectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  background: #000814;
`;

export default ThermalManagement; 