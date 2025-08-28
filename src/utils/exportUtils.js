import html2canvas from 'html2canvas';
import { message } from 'antd';

/**
 * 使用html2canvas导出元素为PNG图片
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {string} filename - 导出的文件名（不含扩展名）
 * @param {Object} options - 导出选项
 * @param {string} options.backgroundColor - 背景颜色
 * @param {number} options.scale - 缩放比例
 * @param {number} options.width - 输出宽度
 * @param {number} options.height - 输出高度
 * @returns {Promise<void>}
 */
export const exportWithHtml2Canvas = async (element, filename = 'tree-export', options = {}) => {
  try {
    if (!element) {
      throw new Error('未找到要导出的元素');
    }

    const defaultOptions = {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      ...options
    };

    // 显示导出进度提示
    const hideLoading = message.loading('正在生成PNG图片...', 0);

    try {
      // 使用html2canvas生成canvas
      const canvas = await html2canvas(element, defaultOptions);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      hideLoading();
      message.success('PNG图片导出成功！');
    } catch (error) {
      hideLoading();
      throw error;
    }
  } catch (error) {
    console.error('PNG导出失败:', error);
    message.error(`PNG导出失败: ${error.message}`);
    throw error;
  }
};

/**
 * 导出树形图为PNG
 * @param {string} containerId - 树形图容器的ID或类名
 * @param {string} filename - 文件名
 * @param {Object} theme - 主题对象
 * @returns {Promise<void>}
 */
export const exportTreeToPNG = async (containerId = '.tree-container', filename = 'knowledge-tree', theme = null) => {
  try {
    // 查找树形图容器
    const container = document.querySelector(containerId);
    if (!container) {
      throw new Error('未找到树形图容器');
    }

    // 确定背景颜色
    let backgroundColor = '#ffffff';
    if (theme && theme.background && theme.background.primary) {
      backgroundColor = theme.background.primary;
    }

    // 临时展开所有节点以确保完整导出
    const originalOverflow = container.style.overflow;
    const originalMaxHeight = container.style.maxHeight;
    const originalPaddingBottom = container.style.paddingBottom;
    
    // 临时移除滚动限制并添加底部空间
    container.style.overflow = 'visible';
    container.style.maxHeight = 'none';
    container.style.paddingBottom = '40px'; // 添加底部空间防止文字截断
    
    // 临时移除跳跃节点的渐变背景样式
    const jumpNodes = container.querySelectorAll('.tree-node-text.has-code');
    const originalStyles = [];
    
    jumpNodes.forEach((node, index) => {
      // 保存原始样式
      originalStyles[index] = {
        background: node.style.background,
        webkitBackgroundClip: node.style.webkitBackgroundClip,
        webkitTextFillColor: node.style.webkitTextFillColor,
        backgroundClip: node.style.backgroundClip
      };
      
      // 移除渐变背景，使用与普通文本相同的颜色
      node.style.background = 'none';
      node.style.webkitBackgroundClip = 'initial';
      node.style.webkitTextFillColor = 'initial';
      node.style.backgroundClip = 'initial';
      node.style.color = backgroundColor === '#ffffff' ? '#262626' : '#f0f0f0';
    });
    
    // 临时移除行内代码的渐变样式
    const inlineCodeNodes = container.querySelectorAll('code');
    const originalCodeStyles = [];
    
    inlineCodeNodes.forEach((codeNode, index) => {
      // 保存原始样式
      originalCodeStyles[index] = {
        background: codeNode.style.background,
        webkitBackgroundClip: codeNode.style.webkitBackgroundClip,
        webkitTextFillColor: codeNode.style.webkitTextFillColor,
        backgroundClip: codeNode.style.backgroundClip,
        color: codeNode.style.color
      };
      
      // 移除渐变背景，使用与普通文本相同的颜色
      codeNode.style.background = 'none';
      codeNode.style.webkitBackgroundClip = 'initial';
      codeNode.style.webkitTextFillColor = 'initial';
      codeNode.style.backgroundClip = 'initial';
      codeNode.style.color = backgroundColor === '#ffffff' ? '#262626' : '#f0f0f0';
    });
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100));

    // 导出选项
    const exportOptions = {
      backgroundColor,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: container.scrollWidth,
      height: container.scrollHeight,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight
    };

    try {
      await exportWithHtml2Canvas(container, filename, exportOptions);
    } finally {
      // 恢复原始样式
      container.style.overflow = originalOverflow;
      container.style.maxHeight = originalMaxHeight;
      container.style.paddingBottom = originalPaddingBottom;
      
      // 恢复跳跃节点的原始样式
      jumpNodes.forEach((node, index) => {
        if (originalStyles[index]) {
          node.style.background = originalStyles[index].background;
          node.style.webkitBackgroundClip = originalStyles[index].webkitBackgroundClip;
          node.style.webkitTextFillColor = originalStyles[index].webkitTextFillColor;
          node.style.backgroundClip = originalStyles[index].backgroundClip;
          node.style.color = ''; // 清除临时设置的颜色
        }
      });
      
      // 恢复行内代码的原始样式
      inlineCodeNodes.forEach((codeNode, index) => {
        if (originalCodeStyles[index]) {
          codeNode.style.background = originalCodeStyles[index].background;
          codeNode.style.webkitBackgroundClip = originalCodeStyles[index].webkitBackgroundClip;
          codeNode.style.webkitTextFillColor = originalCodeStyles[index].webkitTextFillColor;
          codeNode.style.backgroundClip = originalCodeStyles[index].backgroundClip;
          codeNode.style.color = originalCodeStyles[index].color;
        }
      });
    }
  } catch (error) {
    console.error('树形图PNG导出失败:', error);
    throw error;
  }
};