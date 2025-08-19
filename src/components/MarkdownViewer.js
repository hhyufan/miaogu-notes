import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Spin, Typography, Tag, Image } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, SunOutlined, MoonFilled } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/plugins/autoloader/prism-autoloader';
// 动态导入Prism主题，不在这里静态导入
import { toast } from '../plugins/toast.js';
import { loadMarkdownFile } from '../utils/fileUtils';
import { formatDisplayName } from '../utils/formatUtils';
import { useTheme } from '../theme';
import MermaidRenderer from './MermaidRenderer';

const { Title, Text } = Typography;

// 配置必须在模块作用域
Prism.plugins.autoloader.languages_path =
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
Prism.languages.vue = Prism.languages.html; // 提前注册扩展语言

// 基础样式函数，接收主题参数
const getBaseStyle = (theme) => ({
  color: theme.text.primary,
  fontFamily: "'Poppins', sans-serif"
});

const getTextStyle = (theme) => ({
  ...getBaseStyle(theme),
  fontSize: '1rem',
  lineHeight: 1.6
});

const getHeadingStyle = (theme) => ({
  ...getBaseStyle(theme),
  margin: '1.2em 0 0.6em',
  lineHeight: 1.2
});

const getQuoteStyle = (theme) => ({
  ...getBaseStyle(theme),
  borderLeft: `4px solid ${theme.border.accent}`,
  paddingLeft: '1rem',
  margin: '1rem 0',
  fontStyle: 'italic',
  background: theme.background.secondary,
  padding: '1rem',
  borderRadius: '4px'
});

const getListStyle = (theme) => ({
  ...getBaseStyle(theme),
  paddingLeft: '1.5rem',
  margin: '1rem 0'
});

const getListItemStyle = (theme) => ({
  ...getBaseStyle(theme),
  margin: '0.4rem 0'
});

const getLinkStyle = (theme) => ({
  ...getBaseStyle(theme),
  color: theme.accent.primary,
  textDecoration: 'underline'
});

const getHrStyle = (theme) => ({
  ...getBaseStyle(theme),
  border: 0,
  borderTop: `1px solid ${theme.border.primary}`,
  margin: '1.5rem 0'
});

const getTableStyle = (theme) => ({
  ...getBaseStyle(theme),
  borderCollapse: 'collapse',
  margin: '1rem 0',
  border: `1px solid ${theme.border.primary}`
});

const getTableHeadStyle = (theme) => ({
  backgroundColor: theme.background.secondary
});

const getTableCellStyle = (theme) => ({
  ...getBaseStyle(theme),
  border: `1px solid ${theme.border.primary}`,
  padding: '0.5rem'
});

const getTableHeaderStyle = (theme) => ({
  ...getTableCellStyle(theme),
  fontWeight: 600,
  backgroundColor: theme.background.secondary
});

// 语言显示名称映射表
const LANGUAGE_DISPLAY_MAP = {
  html: 'HTML',
  xml: 'XML',
  sql: 'SQL',
  css: 'CSS',
  cpp: 'C++',
  sass: 'Sass',
  scss: 'Sass',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  php: 'PHP',
  md: 'Markdown',
  yml: 'YAML',
  yaml: 'YAML',
  json: 'JSON',
  rb: 'Ruby',
  java: 'Java',
  c: 'C',
  go: 'Go',
  rust: 'Rust',
  kotlin: 'Kotlin',
  swift: 'Swift',
  mermaid: 'Mermaid'
};

const MarkdownRenderer = ({ content }) => {
  const containerRef = useRef(null);
  const { theme, isDarkMode } = useTheme();
  
  // 存储React根节点的引用
  const mermaidRootsRef = useRef(new Map());
  // 防抖定时器引用
  const copyDebounceRef = useRef(null);

  const renderMermaidDiagrams = () => {
    if (!containerRef?.current) return;

    const currentRoots = new Map(mermaidRootsRef.current);
    const processedIds = new Set();

    const mermaidBlocks = containerRef.current.querySelectorAll('pre > code.language-mermaid');

    mermaidBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentElement;
      if (!pre) return;

      // 获取或生成唯一ID
      let mermaidId = pre.getAttribute('data-mermaid-id');
      const code = codeBlock.textContent;
      if (!mermaidId) {
        mermaidId = `mermaid-${index}`;
        pre.setAttribute('data-mermaid-id', mermaidId);
      }
      processedIds.add(mermaidId);

      // 通过ID查找现有容器
      let mermaidContainer = document.querySelector(`[data-mermaid-container-id="${mermaidId}"]`);

      // 如果容器不存在再创建
      if (!mermaidContainer) {
        mermaidContainer = document.createElement('div');
        mermaidContainer.className = 'mermaid-container';
        mermaidContainer.setAttribute('data-mermaid-container-id', mermaidId);
        if (!document.querySelector(`[data-mermaid-container-id="${mermaidId}"]`)) {
          pre.parentNode.insertBefore(mermaidContainer, pre.nextSibling);
        }
      }

      pre.style.display = 'none';

      // 获取或创建React根节点
      let root = currentRoots.get(mermaidId);
      if (!root) {
        const existingRoot = mermaidContainer.querySelector('.mermaid-root');
        if (existingRoot) {
          // 复用现有DOM节点
          root = ReactDOM.createRoot(existingRoot);
        } else {
          // 创建新的根节点
          const mermaidRoot = document.createElement('div');
          mermaidRoot.className = 'mermaid-root';
          mermaidContainer.appendChild(mermaidRoot);
          root = ReactDOM.createRoot(mermaidRoot);
        }
        currentRoots.set(mermaidId, root);
      }

      root.render(
        <MermaidRenderer code={code} key={`${mermaidId}-${isDarkMode ? 'dark' : 'light'}`} />
      );
    });

    mermaidRootsRef.current = currentRoots;
  };

  // 动态加载Prism主题
  const loadPrismTheme = (isDark) => {
    // 移除现有的Prism主题
    const existingTheme = document.querySelector('link[data-prism-theme]');
    if (existingTheme) {
      existingTheme.remove();
    }

    // 创建新的主题链接
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-prism-theme', 'true');

    if (isDark) {
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-one-dark.min.css';
    } else {
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-one-light.min.css';
    }

    document.head.appendChild(link);
  };

  // 清理旧标签
  const cleanupLabels = () => {
    const existingTags = containerRef.current?.querySelectorAll('.lang-tag');
    existingTags?.forEach((tag) => tag.remove());
  };

  // 添加语言标签
  const addLanguageLabels = () => {
    cleanupLabels();

    const codeBlocks = containerRef.current?.querySelectorAll('code') || [];

    codeBlocks.forEach((code) => {
      const pre = code.closest('pre');
      if (!pre) return;

      // 提取语言类型
      const langClass = [...code.classList].find((c) => c.startsWith('language-'));
      const rawLang = langClass ? langClass.split('-')[1] || '' : '';
      const langKey = rawLang.toLowerCase();

      // 获取显示名称
      let displayLang = LANGUAGE_DISPLAY_MAP[langKey];

      // 处理未定义的特殊情况
      if (!displayLang) {
        const versionMatch = langKey.match(/^(\D+)(\d+)$/);
        if (versionMatch) {
          displayLang = `${versionMatch[1].charAt(0).toUpperCase()}${versionMatch[1].slice(
            1
          )} ${versionMatch[2]}`;
        } else {
          displayLang = langKey.charAt(0).toUpperCase() + langKey.slice(1);
        }
      }

      // 创建标签
      const tag = document.createElement('button');
      tag.className = 'lang-tag';
      Object.assign(tag.style, {
        position: 'absolute',
        top: '8px',
        right: '12px',
        color: theme.text.primary,
        fontSize: '0.9em',
        border: `1px solid ${theme.border.primary}`,
        background: theme.background.card,
        padding: '4px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        zIndex: 1,
        transition: 'all 0.2s ease',
        fontWeight: '500'
      });

      // 设置显示名称
      tag.textContent = displayLang;

      // 添加点击事件
      tag.addEventListener('click', () => copyToClipboard(code.textContent));

      // 添加悬停效果
      tag.addEventListener('mouseover', () => {
        tag.style.backgroundColor = theme.background.tertiary;
        tag.style.borderColor = theme.border.accent;
      });
      tag.addEventListener('mouseout', () => {
        tag.style.backgroundColor = theme.background.card;
        tag.style.borderColor = theme.border.primary;
      });

      // 确保 pre 元素有定位上下文
      pre.parentElement.style.position = 'relative';

      // 将标签添加到 pre 元素
      pre.parentElement.appendChild(tag);
    });
  };

  // 更新现有语言标签的样式
  const updateLanguageLabelsTheme = () => {
    const existingTags = containerRef.current?.querySelectorAll('.lang-tag');
    existingTags?.forEach((tag) => {
      Object.assign(tag.style, {
        color: theme.text.primary,
        fontSize: '0.9em',
        border: `1px solid ${theme.border.primary}`,
        background: theme.background.card,
        padding: '4px 12px',
        borderRadius: '6px',
        fontWeight: '500'
      });

      // 重新绑定悬停事件
      tag.onmouseover = () => {
        tag.style.backgroundColor = theme.background.tertiary;
        tag.style.borderColor = theme.border.accent;
      };
      tag.onmouseout = () => {
        tag.style.backgroundColor = theme.background.card;
        tag.style.borderColor = theme.border.primary;
      };
    });
  };

  // 高亮核心逻辑
  const highlightCode = () => {
    Prism.highlightAllUnder(containerRef.current);
    addLanguageLabels();
    renderMermaidDiagrams();
  };

  // 复制到剪贴板（带防抖）
  const copyToClipboard = (text) => {
    // 清除之前的定时器
    if (copyDebounceRef.current) {
      clearTimeout(copyDebounceRef.current);
    }
    
    // 设置新的防抖定时器
    copyDebounceRef.current = setTimeout(() => {
      navigator.clipboard
        .writeText(text)
        .then(async () => {
          await toast.success('内容已复制', { duration: 2 });
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    }, 300); // 300ms防抖延迟
  };

  useEffect(() => {
    const debounceTimer = setTimeout(highlightCode, 50); // 延迟确保 DOM 更新
    return () => clearTimeout(debounceTimer);
  }, [content]);

  // 监听主题变化，更新语言标签样式和Prism主题
  useEffect(() => {
    loadPrismTheme(isDarkMode);
    updateLanguageLabelsTheme();
  }, [theme, isDarkMode]);

  // 初始化时加载Prism主题
  useEffect(() => {
    loadPrismTheme(isDarkMode);
  }, []);

  return (
    <div ref={containerRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p style={getTextStyle(theme)}>{children}</p>,
          h1: ({ children }) => <h1 style={{ ...getHeadingStyle(theme), fontSize: '2rem' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ ...getHeadingStyle(theme), fontSize: '1.8rem' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ ...getHeadingStyle(theme), fontSize: '1.6rem' }}>{children}</h3>,
          h4: ({ children }) => <h4 style={{ ...getHeadingStyle(theme), fontSize: '1.4rem' }}>{children}</h4>,
          h5: ({ children }) => <h5 style={{ ...getHeadingStyle(theme), fontSize: '1.2rem' }}>{children}</h5>,
          h6: ({ children }) => <h6 style={{ ...getHeadingStyle(theme), fontSize: '1rem' }}>{children}</h6>,
          blockquote: ({ children }) => <blockquote style={getQuoteStyle(theme)}>{children}</blockquote>,
          ul: ({ children }) => <ul style={getListStyle(theme)}>{children}</ul>,
          ol: ({ children }) => <ol style={getListStyle(theme)}>{children}</ol>,
          li: ({ children }) => <li style={getListItemStyle(theme)}>{children}</li>,
          a: ({ children, href }) => (
            <a href={href} style={getLinkStyle(theme)}>
              {children}
            </a>
          ),
          em: ({ children }) => <em style={getTextStyle(theme)}>{children}</em>,
          strong: ({ children }) => <strong style={{ ...getTextStyle(theme), fontWeight: 600 }}>{children}</strong>,
          hr: () => <hr style={getHrStyle(theme)} />,
          table: ({ children }) => <table style={getTableStyle(theme)}>{children}</table>,
          thead: ({ children }) => <thead style={getTableHeadStyle(theme)}>{children}</thead>,
          td: ({ children }) => <td style={getTableCellStyle(theme)}>{children}</td>,
          th: ({ children }) => <th style={getTableHeaderStyle(theme)}>{children}</th>,
          img: ({ src, alt, ...props }) => {
            // 处理图片路径，将相对路径转换为绝对路径
            const imageSrc = src?.startsWith('images/') ? `/${src}` : src;
            return (
              <Image
                src={imageSrc}
                alt={alt}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '4px',
                  boxShadow: theme.shadow.md,
                  border: `1px solid ${theme.border.secondary}`,
                  margin: '1rem 0',
                  display: 'block'
                }}
                preview={{
                  mask: '点击预览',
                  maskClassName: 'custom-mask'
                }}
                {...props}
              />
            );
          },
          code({ className, children, ...props }) {
            const language = className?.replace('language-', '') || '';
            
            return language ? (
              <pre
                className={`language-${language}`}
                style={{
                  position: 'relative',
                  overflow: 'auto',
                  fontSize: '1rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  border: `1px solid ${theme.border.secondary}`,
                  borderRadius: '6px',
                  padding: '16px',
                  margin: '16px 0',
                  boxShadow: theme.shadow.sm
                }}
              >
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code style={{
                backgroundColor: isDarkMode ? '#1e3a5f' : '#e6f3ff',
                color: isDarkMode ? '#d1d5db' : '#374151',
                padding: '3px 6px',
                margin: '0 6px',
                borderRadius: '4px',
                fontSize: '0.9em',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '500',
                border: `1px solid ${isDarkMode ? '#2563eb' : '#93c5fd'}`
              }}{...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const MarkdownViewer = ({ fileName, onBack, currentFolder }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [fileStats, setFileStats] = useState(null);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const loadFile = async () => {
      setLoading(true);
      try {
        const fileContent = await loadMarkdownFile(fileName, currentFolder);
        setContent(fileContent);

        // 设置文件统计信息
        setFileStats({
          name: fileName,
          size: fileContent.length,
          lastModified: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('加载文件失败:', error);
        setContent('# 文件加载失败\n\n无法加载文件内容，请检查文件是否存在。');
      } finally {
        setLoading(false);
      }
    };

    if (fileName) {
      loadFile();
    }
  }, [fileName]);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('文件下载成功');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.background.primary
      }}>
        <Spin size="large" tip="加载中...">
          <div style={{ minHeight: '100px', width: '100px' }} />
        </Spin>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: theme.background.primary
    }}>
      {/* Fixed Header */}
      <div className="markdown-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: theme.background.card,
        boxShadow: theme.shadow.md,
        borderBottom: `1px solid ${theme.border.primary}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            type="text"
            style={{
              color: theme.text.primary,
              borderColor: theme.border.primary
            }}
          >
          </Button>
          <div>
            <Title level={3} style={{ margin: 0, color: theme.accent.primary }}>
              {formatDisplayName(fileName)}
            </Title>
            {fileStats && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
                <Text style={{ color: theme.text.secondary }}>大小: {fileStats.size} 字符</Text>
                <Text style={{ color: theme.text.secondary }}>修改时间: {fileStats.lastModified}</Text>
              </div>
            )}
          </div>
        </div>
        <div className="markdown-header-buttons" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            size="small"
            style={{
              color: theme.text.primary,
              borderColor: theme.border.primary,
              backgroundColor: 'transparent'
            }}
            title="下载文件"
          />
          <div className="theme-toggle">
            <Button
              type="text"
              icon={isDarkMode ? <MoonFilled /> : <SunOutlined />}
              onClick={toggleTheme}
              title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}
              className="theme-toggle-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                border: 'none',
                background: 'transparent'
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        backgroundColor: theme.background.card,
        padding: '24px 32px',
        margin: '24px 16px 16px 16px',
        borderRadius: '8px',
        boxShadow: theme.shadow.md,
        border: `1px solid ${theme.border.primary}`,
        minHeight: 'calc(100vh - 140px)',
        width: 'calc(100% - 32px)'
      }}>
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default MarkdownViewer;
