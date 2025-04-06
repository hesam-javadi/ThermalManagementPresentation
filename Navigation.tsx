import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  currentPage: number;
  totalPages: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, totalPages }) => {
  const navigate = useNavigate();

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const path = currentPage === 2 ? '/' : `/section/${currentPage - 1}`;
      navigate(path);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      navigate(`/section/${currentPage + 1}`);
    }
  };

  return (
    <NavigationContainer>
      <NavButton 
        disabled={currentPage === 1}
        onClick={goToPreviousPage}
        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
      >
        Previous
      </NavButton>
      <PageIndicator>{currentPage} / {totalPages}</PageIndicator>
      <NavButton 
        disabled={currentPage === totalPages}
        onClick={goToNextPage}
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
      >
        Next
      </NavButton>
    </NavigationContainer>
  );
};

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem 0;
`;

const NavButton = styled(motion.button)`
  background: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-weight: 600;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: var(--secondary);
  }
`;

const PageIndicator = styled.div`
  font-size: 1rem;
`;

export default Navigation; 