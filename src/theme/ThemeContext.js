import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, getCSSVariables, THEME_TYPES } from './colors';

// 创建主题上下文
const ThemeContext = createContext();

// 主题提供者组件
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(getTheme(false));

  // 切换主题
  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    updateTheme(newIsDarkMode);
  };

  // 设置主题
  const setThemeMode = (isDark) => {
    setIsDarkMode(isDark);
    updateTheme(isDark);
  };

  // 更新主题
  const updateTheme = (isDark) => {
    const newTheme = getTheme(isDark);
    setTheme(newTheme);

    // 更新CSS变量
    const cssVariables = getCSSVariables(newTheme);
    const root = document.documentElement;

    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // 更新data-theme属性
    root.setAttribute('data-theme', isDark ? THEME_TYPES.DARK : THEME_TYPES.LIGHT);

    // 保存到localStorage
    localStorage.setItem('theme', isDark ? THEME_TYPES.DARK : THEME_TYPES.LIGHT);
  };

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === THEME_TYPES.DARK : prefersDark;

    setThemeMode(shouldUseDark);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // 只有在没有手动设置主题时才跟随系统
      if (!localStorage.getItem('theme')) {
        setThemeMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    isDarkMode,
    theme,
    toggleTheme,
    setThemeMode,
    themeType: isDarkMode ? THEME_TYPES.DARK : THEME_TYPES.LIGHT
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 使用主题的Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 获取主题样式的Hook
export const useThemeStyles = () => {
  const { theme, isDarkMode } = useTheme();

  return {
    theme,
    isDarkMode,
    // 常用样式组合
    cardStyle: {
      background: theme.background.card,
      border: `1px solid ${theme.border.primary}`,
      borderRadius: '8px',
      boxShadow: theme.shadow.sm,
      color: theme.text.primary
    },
    buttonStyle: {
      background: theme.accent.primary,
      color: theme.text.inverse,
      border: 'none',
      borderRadius: '6px',
      transition: 'all 0.3s ease'
    },
    inputStyle: {
      background: theme.background.secondary,
      border: `1px solid ${theme.border.primary}`,
      color: theme.text.primary,
      borderRadius: '6px'
    }
  };
};

export default ThemeContext;