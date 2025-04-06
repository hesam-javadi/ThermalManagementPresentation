import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';

const Introduction: React.FC = () => {
  return (
    <IntroContainer>
      <ContentWrapper>
        <TitleSection
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>Thermal Management in High-Performance CPUs and GPUs</Title>
          <Subtitle>Keeping your hardware cool in the heat of computation</Subtitle>
        </TitleSection>

        <Section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <SectionTitle>The Growing Importance of Thermal Management</SectionTitle>
          <SectionContent>
            <LeftContent>
              <p>
                As computing power continues to increase exponentially, effective thermal 
                management has become more critical than ever. Modern CPUs and GPUs are 
                pushing the boundaries of performance, with transistor counts in the billions 
                and power densities approaching physical limits.
              </p>
              <p>
                Thermal management is no longer just about preventing hardware failure—it's 
                about maintaining optimal performance, extending component lifespan, and 
                ensuring system stability under heavy workloads.
              </p>
            </LeftContent>
            <RightContent>
              <InfoCard
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <h3>Did You Know?</h3>
                <p>
                  A modern high-end CPU can generate more heat per square cm than a 
                  household cooking hotplate!
                </p>
              </InfoCard>
            </RightContent>
          </SectionContent>
        </Section>

        <Section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <SectionTitle>Impact of Heat on Performance and Reliability</SectionTitle>
          <SectionContent>
            <LeftContent>
              <p>
                Excessive heat is the enemy of electronic components. When temperatures rise 
                beyond design specifications, processors begin to throttle their performance 
                to prevent damage. This thermal throttling can significantly impact system 
                performance during resource-intensive tasks.
              </p>
              <p>
                Additionally, sustained high temperatures accelerate component degradation, 
                reducing the lifespan of expensive hardware and potentially leading to 
                premature system failure.
              </p>
            </LeftContent>
            <RightContent>
              <PerformanceChart
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.7, ease: "easeOut" }}
              >
                <ChartBar height="90%" label="70°C" />
                <ChartBar height="80%" label="75°C" />
                <ChartBar height="65%" label="80°C" />
                <ChartBar height="45%" label="85°C" />
                <ChartBar height="30%" label="90°C" />
                <ChartLabel>Performance vs. Temperature</ChartLabel>
              </PerformanceChart>
            </RightContent>
          </SectionContent>
        </Section>

        <Section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <SectionTitle>Real-World Examples of Thermal Throttling</SectionTitle>
          <SectionContent>
            <LeftContent>
              <p>
                Thermal throttling isn't just a theoretical concern—it's a common issue that 
                affects real-world computing experiences. For example, many laptops struggle 
                to maintain performance during gaming or rendering tasks due to inadequate 
                cooling solutions.
              </p>
              <p>
                Even high-end desktop systems can experience thermal limitations under sustained 
                workloads if proper cooling is not implemented. This is particularly relevant 
                in applications like 3D rendering, AI training, and data processing.
              </p>
            </LeftContent>
            <RightContent>
              <Examples>
                <Example
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <ExampleTitle>Gaming Laptops</ExampleTitle>
                  <p>Performance drops after 30 minutes of intensive gaming</p>
                </Example>
                <Example
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <ExampleTitle>Workstations</ExampleTitle>
                  <p>Rendering times increase as thermal throttling occurs</p>
                </Example>
                <Example
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <ExampleTitle>Data Centers</ExampleTitle>
                  <p>Cooling costs can exceed electricity costs for computation</p>
                </Example>
              </Examples>
            </RightContent>
          </SectionContent>
        </Section>

        <Navigation currentPage={1} totalPages={10} />
      </ContentWrapper>
    </IntroContainer>
  );
};

// Styled Components
const IntroContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const TitleSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-secondary);
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Section = styled(motion.section)`
  margin-bottom: 3rem;
  background: var(--card-bg);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: var(--shadow);
`;

const SectionTitle = styled.h2`
  color: var(--primary);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftContent = styled.div`
  flex: 1;
`;

const RightContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoCard = styled(motion.div)`
  background: var(--gradient-1);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: var(--shadow);
  
  h3 {
    margin-bottom: 0.5rem;
  }
`;

const PerformanceChart = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-top: 1rem;
  position: relative;
`;

const ChartBar = styled.div<{ height: string; label: string }>`
  width: 40px;
  height: ${props => props.height};
  background: var(--gradient-1);
  border-radius: 5px 5px 0 0;
  position: relative;
  
  &:after {
    content: '${props => props.label}';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
  }
`;

const ChartLabel = styled.div`
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const Examples = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const Example = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid var(--secondary);
  padding: 1rem;
  border-radius: 0 5px 5px 0;
`;

const ExampleTitle = styled.h4`
  color: var(--secondary);
  margin-bottom: 0.5rem;
`;

export default Introduction; 