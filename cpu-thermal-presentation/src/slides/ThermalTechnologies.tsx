import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ReferenceLine } from 'recharts';
import { ResponsiveContainer } from 'recharts';

// Import the useNavigation hook
import { useNavigation } from '../context/NavigationContext';
import { CircuitThermalVisualization } from '../components/CircuitThermalVisualization';

// Define slide sections
interface Section {
  id: number;
  title: string;
  content: React.ReactNode;
}

// Main component
const ThermalTechnologies: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [inSectionMode, setInSectionMode] = useState(true);
  
  // Use the navigation hook
  const { goToNextSlide, goToPrevSlide } = useNavigation();
  
  // Define the sections 
  const sections: Section[] = [
    {
      id: 0,
      title: "Thermal Technologies",
      content: (
        <TitleContent>
          <MainTitle>Understanding Heat Generation</MainTitle>
          <MainSubtitle>How processors generate heats?</MainSubtitle>
        </TitleContent>
      )
    },
    {
      id: 1,
      title: "Heat Generation",
      content: (
        <SectionContent>
          <SectionTitle>How CPUs and GPUs Generate Heat</SectionTitle>
          <SectionText>
            CPUs and GPUs generate heat as a byproduct of their computational processes, driven by the flow of electric 
            current through billions of transistors. These transistors, acting as tiny switches, rapidly toggle on and off 
            to perform calculations, consuming power in the process. In high-performance chips, higher clock speeds and 
            increased transistor density (e.g., in 3nm nodes) amplify this effect, producing more heat.
          </SectionText>
          
          <SectionText>
            Additionally, leakage currents in modern architectures contribute to thermal output, especially under heavy workloads 
            like gaming or rendering, making efficient heat dissipation critical.
          </SectionText>
          
          <HighlightCards>
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardIcon>⚡</CardIcon>
              <CardTitle>Transistor Activity</CardTitle>
              <CardText>
                Billions toggle on/off, consuming power
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardIcon>⏱️</CardIcon>
              <CardTitle>Clock Speed Impact</CardTitle>
              <CardText>
                Higher speeds (e.g., 5 GHz) increase heat
              </CardText>
            </HighlightCard>
          </HighlightCards>
          
          <HighlightCards style={{ marginTop: '20px' }}>
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <CardIcon>🔌</CardIcon>
              <CardTitle>Leakage Currents</CardTitle>
              <CardText>
                Modern chips lose energy as heat
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <CardIcon>🔬</CardIcon>
              <CardTitle>Transistor Density</CardTitle>
              <CardText>
                Smaller nodes (e.g., 3nm) concentrate heat in tiny areas
              </CardText>
            </HighlightCard>
          </HighlightCards>
        </SectionContent>
      )
    },
    {
      id: 2,
      title: "Thermal Design Power",
      content: (
        <SectionContent>
          <SectionTitle>Thermal Design Power (TDP)</SectionTitle>
          <SectionText>
            Thermal Design Power (TDP) quantifies the maximum heat a CPU or GPU generates under peak workload, measured in 
            watts (W).
          </SectionText>
          
          <QuoteCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <QuoteIcon>"</QuoteIcon>
            <QuoteText>
              The time-averaged power dissipation that the processor is validated to not 
              exceed during manufacturing while executing an Intel-specified high complexity workload at Base Frequency and 
              at the maximum junction temperature.
            </QuoteText>
            <QuoteSource>— Intel's official definition of TDP</QuoteSource>
          </QuoteCard>
          
          <SectionText style={{ marginTop: '30px' }}>
            For high-performance chips, TDPs often exceed 200W, requiring advanced cooling. TDP guides thermal management 
            design but is a theoretical maximum, with actual heat varying by usage.
          </SectionText>
          
          <HighlightCards style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ minWidth: 'unset' }}
            >
              <CardIcon>⚡</CardIcon>
              <CardTitle>Unit</CardTitle>
              <CardText>
                Measured in watts (e.g., 200W for high-performance chips)
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{ minWidth: 'unset' }}
            >
              <CardIcon>🎯</CardIcon>
              <CardTitle>Purpose</CardTitle>
              <CardText>
                Guides cooling system design for heat dissipation
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ minWidth: 'unset' }}
            >
              <CardIcon>🔥</CardIcon>
              <CardTitle>High-Performance TDPs</CardTitle>
              <CardText>
                Often exceed 200W (e.g., RTX 4090 at 450W)
              </CardText>
            </HighlightCard>
            
            <HighlightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              style={{ minWidth: 'unset' }}
            >
              <CardIcon>📊</CardIcon>
              <CardTitle>Limitation</CardTitle>
              <CardText>
                Theoretical value; real heat varies with workload
              </CardText>
            </HighlightCard>
          </HighlightCards>
        </SectionContent>
      )
    },
    {
      id: 3,
      title: "Power Density",
      content: (
        <SectionContent>
          <SectionTitle>What is Power Density?</SectionTitle>
          <SectionText>
            Power density refers to the amount of power (energy per unit time) generated or dissipated per unit volume 
            or area in a CPU or GPU, typically measured in watts per cubic meter (W/m³) or watts per square centimeter (W/cm²). 
            It's a critical metric in thermal management as it indicates how concentrated heat generation is within a chip, 
            directly influencing cooling requirements.
          </SectionText>
          
          <FormulaContainer>
            <Formula>
              Power Density (W/cm²) = 
              <FractionContainer>
                <Numerator>Power (W)</Numerator>
                <FractionLine />
                <Denominator>Die Area (cm²)</Denominator>
              </FractionContainer>
            </Formula>
          </FormulaContainer>
          
          <SectionText>
            Over the years, power density has increased due to shrinking chip sizes and rising TDPs, a trend driven by 
            Moore's Law and the demand for higher performance in smaller packages.
          </SectionText>
          
          <ChartContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ChartTitle>Power Density Trends Over the Years</ChartTitle>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart
                data={[
                  { year: 1995, density: 1.5, node: "350 nm", processor: "Intel Pentium Pro" },
                  { year: 2005, density: 10, node: "90 nm", processor: "Intel Pentium 4" },
                  { year: 2015, density: 50, node: "14 nm", processor: "Intel Skylake (i7-6700K)" },
                  { year: 2020, density: 100, node: "7 nm", processor: "AMD Ryzen 9 5950X" },
                  { year: 2024, density: 150, node: "3 nm", processor: "NVIDIA Grace Blackwell" }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="var(--text-secondary)"
                  tick={{ fill: 'var(--text-secondary)' }}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  domain={[0, 160]}
                  tick={{ fill: 'var(--text-secondary)' }}
                  label={{ 
                    value: 'Power Density (W/cm²)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: 'var(--text-secondary)' }
                  }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltip>
                          <p className="label">{`Year: ${label}`}</p>
                          <p className="value">{`Power Density: ${payload[0].value} W/cm²`}</p>
                          <p className="info">{`Process Node: ${payload[0].payload.node}`}</p>
                          <p className="info">{`Processor: ${payload[0].payload.processor}`}</p>
                        </ChartTooltip>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="density" 
                  name="Power Density"
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  dot={{ 
                    r: 6, 
                    strokeWidth: 2, 
                    fill: "#000", 
                    stroke: "var(--primary)" 
                  }}
                  activeDot={{ 
                    r: 8, 
                    stroke: "var(--primary)",
                    fill: "#000",
                    strokeWidth: 3
                  }}
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

      {/* Visualization Section - replaced 3D model with 2D heat map */}
      <ModelSection>
        <CPUPowerDensityVisualization />
      </ModelSection>
    </SlideContainer>
  );
};

// New component for the 2D heat map visualization
const CPUPowerDensityVisualization = () => {
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number, value: number} | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Power density heatmap data - higher values = more heat
  const heatData = [
    [20, 30, 50, 40, 30, 20, 10, 5],
    [30, 80, 120, 100, 90, 60, 40, 10],
    [40, 100, 200, 180, 160, 90, 50, 20],
    [50, 120, 220, 250, 200, 120, 70, 30],
    [40, 100, 190, 210, 170, 90, 50, 20],
    [30, 70, 110, 100, 80, 50, 30, 15],
    [20, 50, 70, 60, 50, 30, 20, 10],
    [10, 20, 30, 30, 20, 15, 10, 5]
  ];
  
  // Handle cell hover with mouse position
  const handleCellHover = (row: number, col: number, value: number, e: React.MouseEvent) => {
    setHoveredCell({ row, col, value });
    // Get mouse position for tooltip
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Helper function to get color based on heat value
  const getHeatColor = (value: number) => {
    // Min and max values in the heat data
    const min = 5;
    const max = 250;
    
    // Normalize the value between 0 and 1
    const normalized = (value - min) / (max - min);
    
    // Colors for gradient (cool to hot)
    const colors = [
      [0, 0, 80],      // Dark blue
      [0, 50, 170],    // Blue
      [0, 200, 255],   // Cyan
      [0, 255, 150],   // Teal
      [255, 255, 0],   // Yellow
      [255, 150, 0],   // Orange
      [255, 50, 0],    // Red
      [255, 0, 0]      // Bright red
    ];
    
    // Find the appropriate color range
    const colorPos = normalized * (colors.length - 1);
    const colorIndex = Math.floor(colorPos);
    const colorRatio = colorPos - colorIndex;
    
    // If at the last index, return the last color
    if (colorIndex >= colors.length - 1) {
      return `rgb(${colors[colors.length - 1][0]}, ${colors[colors.length - 1][1]}, ${colors[colors.length - 1][2]})`;
    }
    
    // Interpolate between the two closest colors
    const r = Math.round(colors[colorIndex][0] + colorRatio * (colors[colorIndex + 1][0] - colors[colorIndex][0]));
    const g = Math.round(colors[colorIndex][1] + colorRatio * (colors[colorIndex + 1][1] - colors[colorIndex][1]));
    const b = Math.round(colors[colorIndex][2] + colorRatio * (colors[colorIndex + 1][2] - colors[colorIndex][2]));
    
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  return (
    <HeatmapContainer>
      <HeatmapTitle>CPU Die Power Density Heat Map</HeatmapTitle>
      <HeatmapGrid>
        {heatData.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} style={{ display: 'flex' }}>
            {row.map((value, colIndex) => (
              <HeatCell 
                key={`cell-${rowIndex}-${colIndex}`}
                $heatColor={getHeatColor(value)}
                onMouseEnter={(e) => handleCellHover(rowIndex, colIndex, value, e)}
                onMouseMove={(e) => setTooltipPosition({ x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHoveredCell(null)}
              />
            ))}
          </div>
        ))}
        
        {/* CPU Die Labels */}
        <DieLabels>
          <DieLabel $position="top">I/O and Cache</DieLabel>
          <DieLabel $position="right">Memory Controller</DieLabel>
          <DieLabel $position="bottom">PCIe Lanes</DieLabel>
          <DieLabel $position="left">Core Cluster</DieLabel>
          <DieLabel $position="center">Core Execution Units</DieLabel>
        </DieLabels>
      </HeatmapGrid>
      
      {/* Heat Value Tooltip */}
      {hoveredCell && (
        <HeatTooltip 
          style={{ 
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 40}px` 
          }}
        >
          <strong>Power Density:</strong> {hoveredCell.value} W/cm²
        </HeatTooltip>
      )}
      
      {/* Legend */}
      <HeatmapLegend>
        <LegendGradient />
        <LegendLabels>
          <span>5 W/cm²</span>
          <span>250 W/cm²</span>
        </LegendLabels>
      </HeatmapLegend>
    </HeatmapContainer>
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
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

const QuoteCard = styled(motion.div)`
  background: rgba(10, 10, 36, 0.7);
  padding: 40px 30px 30px;
  border-left: 4px solid var(--primary);
  position: relative;
  margin: 30px 0;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 60px;
  color: var(--primary);
  opacity: 0.4;
  font-family: Georgia, serif;
  line-height: 1;
`;

const QuoteText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
  font-style: italic;
  margin: 0;
  text-indent: 20px;
`;

const QuoteSource = styled.p`
  text-align: right;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 15px;
  font-style: italic;
`;

const TableContainer = styled(motion.div)`
  margin: 30px 0;
  background: rgba(10, 10, 36, 0.7);
  border: 1px solid var(--primary);
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
  overflow-x: auto;
`;

const TableTitle = styled.h4`
  font-size: 18px;
  text-align: center;
  margin-bottom: 15px;
  color: var(--primary);
  font-family: var(--font-mono);
  letter-spacing: 1px;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  font-size: 14px;
`;

const TableHeader = styled.thead`
  background: rgba(0, 255, 255, 0.1);
`;

const TableHeaderCell = styled.th`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--primary);
  color: var(--primary);
  font-weight: bold;
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(0, 255, 255, 0.03);
  }
  
  &:hover {
    background: rgba(0, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
`;

const TableCaption = styled.p`
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 10px;
  font-style: italic;
`;

const ChartContainer = styled(motion.div)`
  margin: 30px 0 10px;
  background: rgba(10, 10, 36, 0.7);
  border: 1px solid var(--primary);
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
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
  }

  p.label {
    color: var(--primary);
    font-weight: bold;
  }

  p.value {
    color: var(--text-primary);
    font-size: 14px;
  }

  p.info {
    color: var(--text-secondary);
  }
`;

const FormulaContainer = styled.div`
  width: 100%;
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 4px solid var(--primary);
`;

const Formula = styled.p`
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: bold;
  color: var(--primary);
  margin: 0;
`;

// Add new styled components for the mathematical fraction
const FractionContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  vertical-align: middle;
  position: relative;
`;

const Numerator = styled.div`
  margin-bottom: 5px;
  padding: 0 10px;
`;

const FractionLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: var(--primary);
  box-shadow: 0 0 5px var(--primary);
`;

const Denominator = styled.div`
  margin-top: 5px;
  padding: 0 10px;
`;

// New styled components for heat map
const HeatmapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.4);
`;

const HeatmapTitle = styled.h3`
  font-family: var(--font-mono);
  color: var(--primary);
  font-size: 22px;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const HeatmapGrid = styled.div`
  width: 80%;
  aspect-ratio: 1;
  border: 2px solid var(--primary);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  position: relative;
`;

const HeatCell = styled.div<{ $heatColor: string }>`
  flex: 1;
  aspect-ratio: 1;
  background-color: ${props => props.$heatColor};
  transition: transform 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    z-index: 10;
    box-shadow: 0 0 15px ${props => props.$heatColor};
  }
`;

const HeatTooltip = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  border: 1px solid var(--primary);
  font-family: var(--font-mono);
  z-index: 100;
  transform: translate(-50%, -100%);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, 0.8);
  }
`;

const HeatmapLegend = styled.div`
  margin-top: 30px;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LegendGradient = styled.div`
  height: 20px;
  width: 100%;
  background: linear-gradient(to right, 
    rgb(0, 0, 80),
    rgb(0, 50, 170),
    rgb(0, 200, 255),
    rgb(0, 255, 150), 
    rgb(255, 255, 0),
    rgb(255, 150, 0),
    rgb(255, 50, 0),
    rgb(255, 0, 0)
  );
  border: 1px solid var(--text-secondary);
`;

const LegendLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
  
  span {
    font-size: 14px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
  }
`;

const DieLabels = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const DieLabel = styled.div<{ $position: 'top' | 'right' | 'bottom' | 'left' | 'center' }>`
  position: absolute;
  color: rgba(255, 255, 255, 0.9);
  font-family: var(--font-mono);
  font-size: 14px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.5);
  padding: 3px 8px;
  border-radius: 2px;
  white-space: nowrap;
  z-index: 5;
  
  ${props => {
    switch (props.$position) {
      case 'top':
        return `
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'right':
        return `
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
        `;
      case 'bottom':
        return `
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return `
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
        `;
      case 'center':
        return `
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          color: var(--primary);
        `;
      default:
        return '';
    }
  }}
`;

export default ThermalTechnologies; 