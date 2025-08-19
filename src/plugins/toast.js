import { message } from 'antd';

// Toast 插件，基于 Ant Design 的 message 组件
export const toast = {
  success: (content, options = {}) => {
    return message.success({
      content,
      duration: options.duration || 3,
      ...options
    });
  },
  
  error: (content, options = {}) => {
    return message.error({
      content,
      duration: options.duration || 3,
      ...options
    });
  },
  
  warning: (content, options = {}) => {
    return message.warning({
      content,
      duration: options.duration || 3,
      ...options
    });
  },
  
  info: (content, options = {}) => {
    return message.info({
      content,
      duration: options.duration || 3,
      ...options
    });
  }
};