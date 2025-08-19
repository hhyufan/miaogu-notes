// 主题颜色配置
export const lightTheme = {
  // 背景色
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#f1f3f4',
    card: '#ffffff',
    overlay: 'rgba(255, 255, 255, 0.95)'
  },

  // 文字颜色
  text: {
    primary: '#262626',
    secondary: '#595959',
    muted: '#8c8c8c',
    inverse: '#ffffff',
    accent: '#1890ff'
  },

  // 边框颜色
  border: {
    primary: '#d9d9d9',
    secondary: '#f0f0f0',
    muted: '#fafafa',
    accent: '#1890ff'
  },

  // 阴影
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.2)',
    xl: '0 25px 50px rgba(0, 0, 0, 0.25)',
    colored: '0 8px 25px rgba(24, 144, 255, 0.15)'
  },

  // 强调色
  accent: {
    primary: '#1890ff',
    secondary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#13c2c2'
  }
};

export const darkTheme = {
  // 背景色
  background: {
    primary: '#0f1419',
    secondary: '#1c2128',
    tertiary: '#262c36',
    card: '#1c2128',
    overlay: 'rgba(15, 20, 25, 0.95)'
  },

  // 文字颜色
  text: {
    primary: '#f0f6fc',
    secondary: '#c9d1d9',
    muted: '#8b949e',
    inverse: '#0f1419',
    accent: '#58a6ff'
  },

  // 边框颜色
  border: {
    primary: '#30363d',
    secondary: '#21262d',
    muted: '#1c2128',
    accent: '#58a6ff'
  },

  // 阴影
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
    md: '0 4px 12px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.6)',
    xl: '0 25px 50px rgba(0, 0, 0, 0.7)',
    colored: '0 8px 25px rgba(88, 166, 255, 0.3)'
  },

  // 强调色
  accent: {
    primary: '#58a6ff',
    secondary: '#a5a2ff',
    success: '#3fb950',
    warning: '#d29922',
    error: '#f85149',
    info: '#39c5cf'
  }
};

// 统计卡片固定主题（不响应主题变化）
export const statsCardTheme = {
  gradients: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ],
  iconColors: ['#1890ff', '#52c41a', '#faad14', '#722ed1'],
  textColor: '#ffffff',
  titleColor: 'rgba(255, 255, 255, 0.9)',
  shadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
};

// 主题常量
export const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// 获取当前主题
export const getTheme = (isDark) => isDark ? darkTheme : lightTheme;

// CSS变量映射
export const getCSSVariables = (theme) => ({
  '--bg-primary': theme.background.primary,
  '--bg-secondary': theme.background.secondary,
  '--bg-tertiary': theme.background.tertiary,
  '--bg-card': theme.background.card,
  '--bg-overlay': theme.background.overlay,

  '--text-primary': theme.text.primary,
  '--text-secondary': theme.text.secondary,
  '--text-muted': theme.text.muted,
  '--text-inverse': theme.text.inverse,
  '--text-accent': theme.text.accent,

  '--border-primary': theme.border.primary,
  '--border-secondary': theme.border.secondary,
  '--border-muted': theme.border.muted,
  '--border-accent': theme.border.accent,

  '--shadow-sm': theme.shadow.sm,
  '--shadow-md': theme.shadow.md,
  '--shadow-lg': theme.shadow.lg,
  '--shadow-xl': theme.shadow.xl,
  '--shadow-colored': theme.shadow.colored,

  '--accent-primary': theme.accent.primary,
  '--accent-secondary': theme.accent.secondary,
  '--accent-success': theme.accent.success,
  '--accent-warning': theme.accent.warning,
  '--accent-error': theme.accent.error,
  '--accent-info': theme.accent.info
});