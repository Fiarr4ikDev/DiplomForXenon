import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: number;
  density: 'comfortable' | 'compact' | 'spacious';
  animations: boolean;
  roundedCorners: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  theme: 'system',
  primaryColor: '#1976d2', // Стандартный синий цвет Material-UI
  fontSize: 16,
  density: 'comfortable',
  animations: true,
  roundedCorners: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Обновляем класс темы на body
    document.body.classList.remove('light-theme', 'dark-theme');
    if (settings.theme !== 'system') {
      document.body.classList.add(`${settings.theme}-theme`);
    }

    // Применяем размер шрифта
    document.documentElement.style.fontSize = `${settings.fontSize}px`;

    // Применяем плотность интерфейса
    document.body.classList.remove('density-comfortable', 'density-compact', 'density-spacious');
    document.body.classList.add(`density-${settings.density}`);

    // Применяем анимации
    document.body.classList.toggle('animations-disabled', !settings.animations);

    // Применяем скругленные углы
    document.body.classList.toggle('rounded-corners-disabled', !settings.roundedCorners);
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 