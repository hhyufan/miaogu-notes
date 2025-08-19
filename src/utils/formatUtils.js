// 文件名格式化工具函数

/**
 * 格式化文件名显示，去掉前缀序号和后缀扩展名
 * @param {string} fileName - 原始文件名
 * @returns {string} - 格式化后的文件名
 */
export const formatDisplayName = (fileName) => {
  if (!fileName) return '';
  
  // 去掉 .md 后缀
  let name = fileName.replace(/\.md$/, '');
  
  // 去掉开头的数字和连字符（如 "1-", "10-" 等）
  name = name.replace(/^\d+-/, '');
  
  return name;
};

/**
 * 获取文件扩展名
 * @param {string} fileName - 文件名
 * @returns {string} - 文件扩展名（不含点号）
 */
export const getFileExtension = (fileName) => {
  if (!fileName) return '';
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/**
 * 格式化文件大小显示
 * @param {number} chars - 字符数
 * @returns {string} - 格式化后的文件大小
 */
export const formatFileSize = (chars) => {
  if (chars < 1000) return `${chars} 字符`;
  if (chars < 1000000) return `${(chars / 1000).toFixed(1)}K 字符`;
  return `${(chars / 1000000).toFixed(1)}M 字符`;
};

/**
 * 格式化日期显示
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {string} - 格式化后的日期
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};