import { lightTheme, darkTheme, THEME_TYPES } from './colors';

// 主题工具函数
export const themeUtils = {
  // 获取对比色
  getContrastColor: (backgroundColor, theme) => {
    // 简单的对比度计算
    const isLight = backgroundColor.includes('#fff') || backgroundColor.includes('255');
    return isLight ? theme.text.primary : theme.text.inverse;
  },

  // 获取悬停颜色
  getHoverColor: (baseColor, amount = 0.1) => {
    // 简单的颜色变暗/变亮处理
    if (baseColor.startsWith('#')) {
      const hex = baseColor.slice(1);
      const num = parseInt(hex, 16);
      const r = Math.max(0, Math.min(255, (num >> 16) + Math.round(255 * amount)));
      const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * amount)));
      const b = Math.max(0, Math.min(255, (num & 0x0000FF) + Math.round(255 * amount)));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    return baseColor;
  },

  // 获取透明度颜色
  getAlphaColor: (color, alpha) => {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  },

  // 检查是否为深色主题
  isDarkTheme: (themeType) => themeType === THEME_TYPES.DARK,

  // 获取主题特定的样式
  getThemeSpecificStyle: (lightStyle, darkStyle, isDark) => {
    return isDark ? { ...lightStyle, ...darkStyle } : lightStyle;
  },

  // 生成渐变背景
  generateGradient: (color1, color2, direction = '135deg') => {
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
  },

  // 获取阴影样式
  getShadowStyle: (theme, size = 'md', colored = false) => {
    if (colored) {
      return theme.shadow.colored;
    }
    return theme.shadow[size] || theme.shadow.md;
  },

  // 获取边框样式
  getBorderStyle: (theme, width = '1px', style = 'solid', type = 'primary') => {
    return `${width} ${style} ${theme.border[type]}`;
  },

  // 获取过渡动画
  getTransition: (properties = 'all', duration = '0.3s', easing = 'ease') => {
    const props = Array.isArray(properties) ? properties.join(', ') : properties;
    return `${props} ${duration} ${easing}`;
  },

  // 响应式断点
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px'
  },

  // 媒体查询生成器
  mediaQuery: (breakpoint) => `@media (min-width: ${themeUtils.breakpoints[breakpoint]})`,

  // 获取间距值
  getSpacing: (multiplier = 1) => `${8 * multiplier}px`,

  // 获取字体大小
  getFontSize: (size) => {
    const sizes = {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px'
    };
    return sizes[size] || sizes.md;
  },

  // 获取字体权重
  getFontWeight: (weight) => {
    const weights = {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    };
    return weights[weight] || weights.normal;
  },

  // 获取圆角值
  getBorderRadius: (size) => {
    const radii = {
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      xxl: '16px',
      full: '50%'
    };
    return radii[size] || radii.md;
  },

  // 获取z-index值
  getZIndex: (level) => {
    const levels = {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060,
      toast: 1070
    };
    return levels[level] || 1;
  }
};

// 主题混合器 - 用于创建自定义主题
export const createCustomTheme = (baseTheme, overrides = {}) => {
  const theme = baseTheme === THEME_TYPES.DARK ? darkTheme : lightTheme;

  const mergeDeep = (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = mergeDeep(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  return mergeDeep(theme, overrides);
};

// 主题验证器
export const validateTheme = (theme) => {
  const requiredKeys = ['background', 'text', 'border', 'shadow', 'accent'];
  const missingKeys = requiredKeys.filter(key => !theme[key]);

  if (missingKeys.length > 0) {
    console.warn(`主题缺少必需的键: ${missingKeys.join(', ')}`);
    return false;
  }

  return true;
};

export default themeUtils;