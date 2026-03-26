import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  theme: 'light' | 'dark';
  language: 'en' | 'pt' | 'es' | 'ca';
  age: number;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'pt' | 'es' | 'ca') => void;
  setAge: (age: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<'en' | 'pt' | 'es' | 'ca'>('en');
  const [age, setAgeState] = useState<number>(6);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('cc-theme') as 'light' | 'dark' | null;
    const savedLanguage = localStorage.getItem('cc-language') as 'en' | 'pt' | 'es' | 'ca' | null;
    const savedAge = localStorage.getItem('cc-age');

    if (savedTheme) setThemeState(savedTheme);
    if (savedLanguage) setLanguageState(savedLanguage);
    if (savedAge) setAgeState(parseInt(savedAge));
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('cc-theme', newTheme);
  };

  const setLanguage = (newLanguage: 'en' | 'pt' | 'es' | 'ca') => {
    setLanguageState(newLanguage);
    localStorage.setItem('cc-language', newLanguage);
  };

  const setAge = (newAge: number) => {
    setAgeState(newAge);
    localStorage.setItem('cc-age', newAge.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        language,
        age,
        setTheme,
        setLanguage,
        setAge,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
