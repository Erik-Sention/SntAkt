'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Initiera temat vid första rendering på klientsidan
  useEffect(() => {
    setIsMounted(true);
    // Sätt alltid light mode
    setTheme('light');
    try {
      localStorage.setItem('theme', 'light');
    } catch (error) {
      console.error('Fel vid initiering av tema:', error);
    }
  }, []);

  // Uppdatera DOM när appen laddas
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      // Ta bort dark class för säkerhets skull
      document.documentElement.classList.remove('dark');
      
      // Uppdatera meta-taggen för mobila enheter
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#f8f9fa');
      }
    } catch (error) {
      console.error('Fel vid uppdatering av tema:', error);
    }
  }, [isMounted]);

  // Togglefunktion - gör egentligen ingenting i denna version
  const toggleTheme = () => {
    // Gör ingenting, vi håller oss till light mode
  };

  const contextValue = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme måste användas inom en ThemeProvider');
  }
  return context;
} 