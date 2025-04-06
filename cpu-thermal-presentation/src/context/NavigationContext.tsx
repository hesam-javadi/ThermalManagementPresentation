import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of our navigation context
interface NavigationContextType {
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  currentSlide: number;
  totalSlides: number;
}

// Create the context with default placeholder values
export const NavigationContext = createContext<NavigationContextType>({
  goToNextSlide: () => {},
  goToPrevSlide: () => {},
  currentSlide: 0,
  totalSlides: 0
});

// Provider component to wrap around the app
interface NavigationProviderProps {
  children: ReactNode;
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  currentSlide,
  totalSlides,
  onNext,
  onPrevious
}) => {
  const value = {
    goToNextSlide: onNext,
    goToPrevSlide: onPrevious,
    currentSlide,
    totalSlides
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for easy access to the navigation context
export const useNavigation = () => useContext(NavigationContext); 