'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  // Initialize theme from localStorage (if available)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
        document.documentElement.setAttribute('data-theme', stored);
      } else if (stored !== null) {
        // Invalid value detected - remove it immediately (prevents XSS via localStorage)
        window.localStorage.removeItem('theme');
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        // FIX: Log potential XSS attempt (in development only)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('Invalid theme value detected and removed:', stored);
        }
      } else {
        // No stored value - default to dark
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (error) {
      // FIX: localStorage unavailable (private browsing, etc.) - only log in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('localStorage unavailable:', error);
      }
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      document.documentElement.setAttribute('data-theme', theme);
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      // FIX: localStorage unavailable (private browsing, etc.) - only log in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('localStorage unavailable:', error);
      }
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}