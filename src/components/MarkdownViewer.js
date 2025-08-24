import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Spin, Typography, Image, FloatButton, Card, Skeleton, Space, Tooltip } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, SunOutlined, MoonFilled, LeftOutlined, RightOutlined, ExpandAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/plugins/autoloader/prism-autoloader';
import { theme } from 'antd';
import { toast } from '../plugins/toast.js';
import { loadMarkdownFile } from '../utils/fileUtils';
import { formatDisplayName } from '../utils/formatUtils';
import { useTheme } from '../theme';
import { useAppDispatch, useAppSelector, useReadingPosition } from '../store/hooks';
import { saveReadingPosition, navigateToNextFile, navigateToPrevFile } from '../store/appSlice';
import MermaidRenderer from './MermaidRenderer';
import TreeViewer from './TreeViewer';

// AutoTreeH1 组件：自动检测并渲染对应的 TreeViewer
const AutoTreeH1 = ({ titleText, isDarkMode, containerRef, children, currentFileName }) => {
  const [treeFilePath, setTreeFilePath] = useState(null);
  const [isCheckingFile, setIsCheckingFile] = useState(false);
  
  useEffect(() => {
    const checkTreeFile = async () => {
      // 提取并清理标题文本
      const cleanTitle = titleText.trim();
      
      // 构建可能的 mgtree 文件路径
       const possiblePaths = [
         `trees/${cleanTitle}.mgtree`,
         `${cleanTitle}.mgtree`
       ];
       
       // 快速检查是否存在对应的 mgtree 文件
       for (const path of possiblePaths) {
         try {
           const response = await fetch(`/markdown-files/JavaFundamentals/${path}`);
           if (response.ok) {
             // 检查响应内容类型和实际内容
             const contentType = response.headers.get('content-type');
             const text = await response.text();
             
             // 确保不是HTML错误页面，且有实际内容
               if (!contentType?.includes('text/html') && text.trim().length > 0 && !text.includes('<!DOCTYPE')) {
                 // 文件存在且有效，立即显示骨架屏
                 setIsCheckingFile(true);
                 // 如果文件在trees目录下，只传递文件名给TreeViewer
                 const fileName = path.startsWith('trees/') ? path.replace('trees/', '') : path;
                 // 短暂延迟后设置文件路径，模拟加载过程
                 setTimeout(() => {
                   setTreeFilePath(fileName);
                   setIsCheckingFile(false);
                 }, 300);
                 return;
               }
           }
         } catch (error) {
            // 继续检查下一个路径
          }
       }
      // 没有找到有效文件，不显示任何内容
      setTreeFilePath(null);
      setIsCheckingFile(false);
    };
    
    if (titleText) {
      checkTreeFile();
    } else {
      setTreeFilePath(null);
      setIsCheckingFile(false);
    }
  }, [titleText]);
  
  const handleJumpToCode = useCallback((jumpLanguage, jumpIndex) => {
    // 查找对应语言和索引的代码块
    const codeBlocks = containerRef.current?.querySelectorAll(`pre.language-${jumpLanguage}`) || [];

    if (codeBlocks.length >= jumpIndex && jumpIndex > 0) {
      const targetPre = codeBlocks[jumpIndex - 1]; // 索引从1开始，数组从0开始

      // 滚动到目标代码块
      targetPre.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // 添加高亮效果
      targetPre.style.transition = 'all 0.3s ease';
      targetPre.style.boxShadow = '0 0 20px rgba(24, 144, 255, 0.5)';

      // 3秒后移除高亮效果
      setTimeout(() => {
        targetPre.style.boxShadow = '';
      }, 3000);
    } 
  }, [containerRef, isDarkMode]);
  
  return (
    <div>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: isDarkMode ? '#f9fafb' : '#111827',
        borderBottom: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        paddingBottom: '0.5rem'
      }}>
        {children}
      </h1>
      {isCheckingFile && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Card
            className="tree-viewer-card loading"
            title={
              <div className="tree-header">
                <Typography.Title level={4} style={{ margin: 0 }}>📊 知识点脉络</Typography.Title>
                <Space>
                  <Tooltip title="全部展开">
                    <Button
                      disabled
                      size="small"
                      icon={<ExpandAltOutlined />}
                      type="text"
                    />
                  </Tooltip>
                  <Tooltip title="全部折叠">
                    <Button
                      disabled
                      size="small"
                      icon={<ShrinkOutlined />}
                      type="text"
                    />
                  </Tooltip>
                </Space>
              </div>
            }
            size="small"
          >
            <div className="tree-container">
              <Skeleton
                active
                paragraph={{ rows: 8, width: ['100%', '90%', '95%', '85%', '92%', '88%', '96%', '82%'] }}
                title={false}
              />
            </div>
          </Card>
        </div>
      )}
      {!isCheckingFile && treeFilePath && treeFilePath !== null && treeFilePath !== '' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <TreeViewer treeFilePath={treeFilePath} onJumpToCode={handleJumpToCode} currentFileName={currentFileName} />
        </div>
      )}
    </div>
  );
};


const { Title, Text } = Typography;
const { useToken } = theme;

// 配置必须在模块作用域
Prism.plugins.autoloader.languages_path =
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
Prism.languages.vue = Prism.languages.html; // 提前注册扩展语言

// 导入本地主题样式

// 基础样式函数，接收token参数
const getBaseStyle = (token) => ({
  color: token.colorText,
  fontFamily: "'Poppins', sans-serif"
});

const getTextStyle = (token) => ({
  ...getBaseStyle(token),
  fontSize: '1rem',
  lineHeight: 1.6
});

const getHeadingStyle = (token) => ({
  ...getBaseStyle(token),
  margin: '1.2em 0 0.6em',
  lineHeight: 1.2
});

const getQuoteStyle = (token) => ({
  ...getBaseStyle(token),
  borderLeft: `4px solid ${token.colorPrimary}`,
  paddingLeft: '1rem',
  margin: '1rem 0',
  fontStyle: 'italic',
  background: token.colorBgContainer,
  padding: '1rem',
  borderRadius: '4px'
});

const getListStyle = (token) => ({
  ...getBaseStyle(token),
  paddingLeft: '1.5rem',
  margin: '1rem 0'
});

const getListItemStyle = (token) => ({
  ...getBaseStyle(token),
  margin: '0.4rem 0'
});

const getLinkStyle = (token) => ({
  ...getBaseStyle(token),
  color: token.colorPrimary,
  textDecoration: 'underline'
});

const getHrStyle = (token) => ({
  ...getBaseStyle(token),
  border: 0,
  borderTop: `1px solid ${token.colorBorder}`,
  margin: '1.5rem 0'
});

const getTableStyle = (token) => ({
  ...getBaseStyle(token),
  borderCollapse: 'collapse',
  margin: '1rem 0',
  border: `1px solid ${token.colorBorder}`
});

const getTableHeadStyle = (token) => ({
  backgroundColor: token.colorBgContainer
});

const getTableCellStyle = (token) => ({
  ...getBaseStyle(token),
  border: `1px solid ${token.colorBorder}`,
  padding: '0.5rem'
});

const getTableHeaderStyle = (token) => ({
  ...getTableCellStyle(token),
  fontWeight: 600,
  backgroundColor: token.colorBgContainer
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

const MarkdownRenderer = React.memo(({ content, copyToClipboard, currentFileName }) => {

  const containerRef = useRef(null);
  const { token } = useToken();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  // 使用useMemo来稳定content，避免不必要的重新渲染
  const memoizedContent = useMemo(() => content, [content]);



  // 存储React根节点的引用
  const mermaidRootsRef = useRef(new Map());

  const renderMermaidDiagrams = useCallback(() => {


    if (!containerRef?.current) {
      return;
    }

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
  }, [isDarkMode]);

  // 监听主题变化并更新样式
  useEffect(() => {


    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');


          setIsDarkMode(newTheme === 'dark');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // 样式标签将在updateTheme函数中创建

    // 更新主题样式
    const updateTheme = () => {


      // 移除现有的主题样式
      const existingStyle = document.getElementById('prism-theme');
      if (existingStyle) {

        existingStyle.remove();
      }

      // 创建link元素来加载CSS文件
      const link = document.createElement('link');
      link.id = 'prism-theme';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = isDarkMode ? '/prism-one-dark.css' : '/prism-one-light.css';
      document.head.appendChild(link);


    };

    updateTheme();

    return () => {
      observer.disconnect();
    };
  }, [isDarkMode]);

  // 优化主题切换处理
  useEffect(() => {
    const timer = setTimeout(renderMermaidDiagrams, 100);
    return () => clearTimeout(timer);
  }, [isDarkMode, renderMermaidDiagrams]);

  // 清理旧标签
  const cleanupLabels = () => {
    const existingTags = containerRef.current?.querySelectorAll('.lang-tag');
    existingTags?.forEach((tag) => tag.remove());
  };

  // 添加语言标签
  const addLanguageLabels = useCallback(() => {


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
        color: token['colorText'],
        fontSize: '0.8em',
        border: 'none',
        background: token['colorBgElevated'],
        padding: '2px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        zIndex: 1
      });

      // 设置显示名称
      tag.textContent = displayLang;

      // 添加点击事件
      tag.addEventListener('click', () => copyToClipboard(code.textContent));

      // 添加悬停效果
      tag.addEventListener('mouseover', () => {
        tag.style.backgroundColor = token['colorBgElevated'];
      });
      tag.addEventListener('mouseout', () => {
        tag.style.backgroundColor = token['colorBgElevated'];
      });

      // 确保 pre 元素有定位上下文
      pre.parentElement.style.position = 'relative';

      // 将标签添加到 pre 元素
      pre.parentElement.appendChild(tag);
    });
  }, [token]);



  // 高亮核心逻辑
  const highlightCode = useCallback(() => {
    renderMermaidDiagrams();

    if (containerRef?.current) {
      Prism.highlightAllUnder(containerRef?.current);
    }

    addLanguageLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode, renderMermaidDiagrams, addLanguageLabels, token]);



  // 修改 useEffect 依赖项
  useEffect(() => {
    const debouncedHighlight = setTimeout(() => {
      highlightCode();
    }, 50);

    return () => {
      clearTimeout(debouncedHighlight);
    };
  }, [highlightCode]); // 只在 content 变化时执行

  // 优化主题切换处理
  useEffect(() => {
    const timer = setTimeout(() => {
      renderMermaidDiagrams();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [renderMermaidDiagrams]);

  // 存储@tree()引用的映射
  const treeRefsRef = useRef(new Map());
  
  // 预处理markdown内容，处理@tree()语法
  const preprocessContent = useCallback((content) => {
    
    const treeRefs = new Map();
    let counter = 0;
    
    // 匹配@tree()语法，支持单独一行的情况
    const processedContent = content.replace(/^@tree\(([^)]+)\)$/gm, (match, treeName) => {
      
      // 如果没有扩展名，自动添加.mgtree
      const fileName = treeName.trim().includes('.') ? treeName.trim() : `${treeName.trim()}.mgtree`;
      const placeholder = `{{TREE_REF_${counter}}}`;
      treeRefs.set(placeholder, fileName);
      

      counter++;
      return placeholder;
    });
    
    treeRefsRef.current = treeRefs;
    
    
    
    return processedContent;
  }, []);

  const processedContent = useMemo(() => preprocessContent(memoizedContent), [memoizedContent, preprocessContent]);

  return (
    <div ref={containerRef}>
      {React.useMemo(() => (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          skipHtml={false}
          components={{
            // 添加根组件处理器来捕获所有可能的占位符
              // 添加多种组件处理器来捕获占位符
              span: ({ children }) => {
               
               if (typeof children === 'string' && children.includes('{{TREE_REF_')) {
                   
                   const treeRefMatch = children.match(/^{{TREE_REF_(\d+)}}$/);
                 if (treeRefMatch) {
                   const placeholder = children;
                   const treeFilePath = treeRefsRef.current.get(placeholder);
                   if (treeFilePath) {
                     const handleJumpToCode = (jumpLanguage, jumpIndex) => {
                       
                       // 查找对应语言和索引的代码块
                       const codeBlocks = containerRef.current?.querySelectorAll(`pre.language-${jumpLanguage}`) || [];
                       

                       if (codeBlocks.length >= jumpIndex && jumpIndex > 0) {
                      const targetPre = codeBlocks[jumpIndex - 1]; // 索引从1开始，数组从0开始

                      // 滚动到目标代码块
                      targetPre.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                      });

                      // 添加高亮效果
                      targetPre.style.transition = 'all 0.3s ease';
                      targetPre.style.boxShadow = '0 0 20px rgba(24, 144, 255, 0.5)';

                      // 3秒后移除高亮效果
                      setTimeout(() => {
                        targetPre.style.boxShadow = '';
                      }, 3000);

                      // 跳转成功，不显示提示
                    } else {
                         toast.error(`未找到${jumpLanguage}代码示例#${jumpIndex}`);
                       }
                     };
                     return <TreeViewer treeFilePath={treeFilePath} onJumpToCode={handleJumpToCode} currentFileName={currentFileName} />;
                   }
                 }
               }
               return <span>{children}</span>;
             },
             div: ({ children }) => {
              
              // 检查是否包含占位符
              if (typeof children === 'string' && children.includes('{{TREE_REF_')) {
                 
                 const treeRefMatch = children.match(/^{{TREE_REF_(\d+)}}$/);
                if (treeRefMatch) {
                  const placeholder = children;
                  const treeFilePath = treeRefsRef.current.get(placeholder);
                  if (treeFilePath) {
                    const handleJumpToCode = (jumpLanguage, jumpIndex) => {
                      
                      // 查找对应语言和索引的代码块
                      const codeBlocks = containerRef.current?.querySelectorAll(`pre.language-${jumpLanguage}`) || [];
                      

                      if (codeBlocks.length >= jumpIndex && jumpIndex > 0) {
                         const targetPre = codeBlocks[jumpIndex - 1]; // 索引从1开始，数组从0开始

                         // 滚动到目标代码块
                         targetPre.scrollIntoView({
                           behavior: 'smooth',
                           block: 'center'
                         });

                         // 添加高亮效果
                         targetPre.style.transition = 'all 0.3s ease';
                         targetPre.style.boxShadow = '0 0 20px rgba(24, 144, 255, 0.5)';

                         // 3秒后移除高亮效果
                         setTimeout(() => {
                           targetPre.style.boxShadow = '';
                         }, 3000);

                         // 跳转成功，不显示提示
                       } else {
                        toast.error(`未找到${jumpLanguage}代码示例#${jumpIndex}`);
                      }
                    };
                    return <TreeViewer treeFilePath={treeFilePath} onJumpToCode={handleJumpToCode} currentFileName={currentFileName} />;
                  }
                }
              }
              return <div>{children}</div>;
            },
            p: ({ children }) => {
              // 检查段落中是否包含tree引用占位符
              const checkForTreeRef = (child) => {
                 if (typeof child === 'string' && child.includes('{{TREE_REF_')) {
                  const treeRefMatch = child.match(/^{{TREE_REF_(\d+)}}$/);
                   if (treeRefMatch) {
                     const placeholder = child;
                     const treeFilePath = treeRefsRef.current.get(placeholder);
                     
                     if (treeFilePath) {
                      // 处理跳转到代码的回调函数
                      const handleJumpToCode = (jumpLanguage, jumpIndex) => {
                        
                        // 查找对应语言和索引的代码块
                        const codeBlocks = containerRef.current?.querySelectorAll(`pre.language-${jumpLanguage}`) || [];
                        
                        

                        if (codeBlocks.length >= jumpIndex && jumpIndex > 0) {
                          const targetPre = codeBlocks[jumpIndex - 1]; // 索引从1开始，数组从0开始

                          // 滚动到目标代码块
                          targetPre.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                          });

                          // 添加高亮效果
                          targetPre.style.transition = 'all 0.3s ease';
                          targetPre.style.boxShadow = '0 0 20px rgba(24, 144, 255, 0.5)';

                          // 3秒后移除高亮效果
                          setTimeout(() => {
                            targetPre.style.boxShadow = '';
                          }, 3000);

                          // 跳转成功，不显示提示
                        } else {
                          toast.error(`未找到${jumpLanguage}代码示例#${jumpIndex}`);
                        }
                      };
                      
                      return <TreeViewer treeFilePath={treeFilePath} onJumpToCode={handleJumpToCode} />;
                    }
                  }
                }
                return null;
              };
              
              // 处理单个字符串children
              if (typeof children === 'string') {
                const treeComponent = checkForTreeRef(children);
                if (treeComponent) return treeComponent;
              }
              
              // 处理数组children
              if (Array.isArray(children)) {
                for (const child of children) {
                  const treeComponent = checkForTreeRef(child);
                  if (treeComponent) return treeComponent;
                }
              }
              
              return <p style={getTextStyle(token)}>{children}</p>;
             },
             text: ({ children }) => {
               // 检查文本节点中是否包含tree引用占位符
               
               if (typeof children === 'string' && children.includes('{{TREE_REF_')) {
                
                const treeRefMatch = children.match(/^{{TREE_REF_(\d+)}}$/);
                 if (treeRefMatch) {
                   const placeholder = children;
                   const treeFilePath = treeRefsRef.current.get(placeholder);
                   
                   if (treeFilePath) {
                     // 处理跳转到代码的回调函数
                     const handleJumpToCode = (jumpLanguage, jumpIndex) => {
                       
                       // 查找对应语言和索引的代码块
                       const codeBlocks = containerRef.current?.querySelectorAll(`pre.language-${jumpLanguage}`) || [];
                       

                       if (codeBlocks.length >= jumpIndex && jumpIndex > 0) {
                         const targetPre = codeBlocks[jumpIndex - 1]; // 索引从1开始，数组从0开始

                         // 滚动到目标代码块
                         targetPre.scrollIntoView({
                           behavior: 'smooth',
                           block: 'center'
                         });

                         // 添加高亮效果
                         targetPre.style.transition = 'all 0.3s ease';
                         targetPre.style.boxShadow = '0 0 20px rgba(24, 144, 255, 0.5)';

                         // 3秒后移除高亮效果
                         setTimeout(() => {
                           targetPre.style.boxShadow = '';
                         }, 3000);

                         // 跳转成功，不显示提示
                       } else {
                         toast.error(`未找到${jumpLanguage}代码示例#${jumpIndex}`);
                       }
                     };
                     
                     return <TreeViewer treeFilePath={treeFilePath} onJumpToCode={handleJumpToCode} />;
                   }
                 }
               }
               return children;
             },
            h1: ({ children }) => {
              // 提取 h1 标题文本
              const titleText = typeof children === 'string' ? children : 
                Array.isArray(children) ? children.join('') : 
                children?.props?.children || '';
              
              return <AutoTreeH1 titleText={titleText} isDarkMode={isDarkMode} containerRef={containerRef} currentFileName={currentFileName}>{children}</AutoTreeH1>;
            },
            h2: ({ children }) => <h2 style={{ ...getHeadingStyle(token), fontSize: '1.8rem' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ ...getHeadingStyle(token), fontSize: '1.6rem' }}>{children}</h3>,
            h4: ({ children }) => <h4 style={{ ...getHeadingStyle(token), fontSize: '1.4rem' }}>{children}</h4>,
            h5: ({ children }) => <h5 style={{ ...getHeadingStyle(token), fontSize: '1.2rem' }}>{children}</h5>,
            h6: ({ children }) => <h6 style={{ ...getHeadingStyle(token), fontSize: '1rem' }}>{children}</h6>,
            blockquote: ({ children }) => <blockquote style={getQuoteStyle(token)}>{children}</blockquote>,
            ul: ({ children }) => <ul style={getListStyle(token)}>{children}</ul>,
            ol: ({ children }) => <ol style={getListStyle(token)}>{children}</ol>,
            li: ({ children }) => <li style={getListItemStyle(token)}>{children}</li>,
            a: ({ children, href }) => (
              <a href={href} style={getLinkStyle(token)}>
                {children}
              </a>
            ),
            em: ({ children }) => <em style={getTextStyle(token)}>{children}</em>,
            strong: ({ children }) => {
              
              if (typeof children === 'string' && children.includes('{{TREE_REF_')) {
                
                const treeRefMatch = children.match(/^{{TREE_REF_(\d+)}}$/);
                if (treeRefMatch) {
                  const placeholder = children;
                  const treeFilePath = treeRefsRef.current.get(placeholder);
                  if (treeFilePath) {
                    const handleJumpToCode = (jumpLanguage, jumpIndex) => {
                      
                      // 查找对应语言和索引的代码块
                      const codeBlocks = containerRef.current?.querySelectorAll(`pre.language-${jumpLanguage}`) || [];
                      

                      if (codeBlocks.length >= jumpIndex && jumpIndex > 0) {
                         const targetPre = codeBlocks[jumpIndex - 1]; // 索引从1开始，数组从0开始

                         // 滚动到目标代码块
                         targetPre.scrollIntoView({
                           behavior: 'smooth',
                           block: 'center'
                         });

                         // 添加高亮效果
                         targetPre.style.transition = 'all 0.3s ease';
                         targetPre.style.boxShadow = '0 0 20px rgba(24, 144, 255, 0.5)';

                         // 3秒后移除高亮效果
                         setTimeout(() => {
                           targetPre.style.boxShadow = '';
                         }, 3000);

                         // 跳转成功，不显示提示
                       } else {
                        toast.error(`未找到${jumpLanguage}代码示例#${jumpIndex}`);
                      }
                    };
                    return <TreeViewer treeFilePath={treeFilePath} onJumpToCode={handleJumpToCode} />;
                  }
                }
              }
              return <strong style={{ ...getTextStyle(token), fontWeight: 600 }}>{children}</strong>;
            },
            hr: () => <hr style={getHrStyle(token)} />,
            table: ({ children }) => <table style={getTableStyle(token)}>{children}</table>,
            thead: ({ children }) => <thead style={getTableHeadStyle(token)}>{children}</thead>,
            td: ({ children }) => <td style={getTableCellStyle(token)}>{children}</td>,
            th: ({ children }) => <th style={getTableHeaderStyle(token)}>{children}</th>,
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
                    boxShadow: token.boxShadow,
                    border: `1px solid ${token.colorBorder}`,
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
            code: ({ className, children, inline, ...props }) => {
              // 使用闭包捕获isDarkMode，避免作为依赖项
              const language = className?.replace('language-', '') || '';

              // 处理树状图
              if (!inline && language === 'tree') {
                const treeContent = String(children).replace(/\n$/, '');

                // 创建跳转到代码块的回调函数
                const handleJumpToCode = (jumpLanguage, jumpIndex) => {
                  
                  // 查找对应语言和索引的代码块
                  const codeBlocks = containerRef.current?.querySelectorAll(`pre.language-${jumpLanguage}`) || [];
                  
                  

                  if (codeBlocks.length >= jumpIndex && jumpIndex > 0) {
                    const targetCodeBlock = codeBlocks[jumpIndex - 1]; // 索引从1开始，数组从0开始
                    const targetPre = targetCodeBlock.closest('pre');

                    if (targetPre) {
                      // 滚动到目标代码块
                      targetPre.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                      });

                      // 添加高亮效果
                      targetPre.style.transition = 'all 0.3s ease';
                      targetPre.style.boxShadow = '0 0 20px rgba(24, 144, 255, 0.5)';

                      // 3秒后移除高亮效果
                      setTimeout(() => {
                        targetPre.style.boxShadow = '';
                      }, 3000);

                      // 跳转成功，不显示提示
                    }
                  } else {
                    toast.error(`未找到${jumpLanguage}代码示例#${jumpIndex}`);
                  }
                };

                const trimmedContent = treeContent.trim();
                
                // 检查是否是@tree()引用语法
                const refMatch = trimmedContent.match(/^@tree\((.+)\)$/);
                if (refMatch) {
                  // @tree()语法支持外部文件引用
                  let refPath = refMatch[1].trim();
                  // 如果没有扩展名，自动添加.mgtree
                  if (!refPath.includes('.')) {
                    refPath += '.mgtree';
                  }
                  return <TreeViewer treeFilePath={refPath} onJumpToCode={handleJumpToCode} currentFileName={currentFileName} />;
                } else {
                  // ```tree代码块只支持内容渲染
                  return <TreeViewer treeContent={treeContent} onJumpToCode={handleJumpToCode} currentFileName={currentFileName} />;
                }
              }

              return !inline && language ? (
                <pre
                  className={`language-${language}`}
                  style={{
                    position: 'relative',
                    overflow: 'auto',
                    fontSize: '1rem',
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Fira Mono', Consolas, Menlo, Courier, monospace !important"
                  }}
                >
                  <code className={className} {...props} style={{
                    fontSize: '0.9rem',
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Fira Mono', Consolas, Menlo, Courier, monospace !important"
                  }}>
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
                  fontSize: '1em',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '500',
                  border: `1px solid ${isDarkMode ? '#2563eb' : '#93c5fd'}`
                }}{...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {processedContent}
        </ReactMarkdown>
      ), [processedContent, token, isDarkMode])}
    </div>
  );
});

const MarkdownViewer = ({ fileName, onBack, currentFolder }) => {

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [fileStats, setFileStats] = useState(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  // 使用防抖来减少content变化时的重新渲染
  const debouncedContent = useMemo(() => content, [content]);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // Redux hooks
  const dispatch = useAppDispatch();
  const { allFileStats } = useAppSelector(state => state.app);
  const fileKey = currentFolder ? `${currentFolder}/${fileName}` : fileName;
  const readingPosition = useReadingPosition(fileKey);

  // 获取当前文件列表和索引
  const currentFiles = currentFolder
    ? allFileStats.filter(file => file.folder === currentFolder)
    : allFileStats;
  const currentIndex = currentFiles.findIndex(file => file.name === fileName);
  const hasPrevFile = currentIndex > 0;
  const hasNextFile = currentIndex < currentFiles.length - 1;

  // Refs
  const contentRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isRestoringRef = useRef(false);
  const hasRestoredRef = useRef(false);
  const copyDebounceRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  // 翻页处理函数
  const handlePrevFile = useCallback(() => {
    if (hasPrevFile) {
      dispatch(navigateToPrevFile());
    }
  }, [hasPrevFile, dispatch]);

  const handleNextFile = useCallback(() => {
    if (hasNextFile) {
      dispatch(navigateToNextFile());
    }
  }, [hasNextFile, dispatch]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (event) => {
      // 只在没有输入框聚焦时响应键盘事件
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (event.key === 'ArrowLeft' && hasPrevFile) {
        event.preventDefault();
        handlePrevFile();
      } else if (event.key === 'ArrowRight' && hasNextFile) {
        event.preventDefault();
        handleNextFile();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevFile, handleNextFile, hasPrevFile, hasNextFile]);

  // 触摸手势处理
  const handleTouchStart = useCallback((event) => {
    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback((event) => {
    if (!touchStartRef.current) return;

    touchEndRef.current = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
      time: Date.now()
    };

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.time - touchStartRef.current.time;

    // 检查是否为有效的水平滑动
    const minSwipeDistance = 50; // 最小滑动距离
    const maxSwipeTime = 300; // 最大滑动时间
    const maxVerticalDistance = 100; // 最大垂直偏移

    if (Math.abs(deltaX) > minSwipeDistance &&
      Math.abs(deltaY) < maxVerticalDistance &&
      deltaTime < maxSwipeTime) {

      if (deltaX > 0 && hasPrevFile) {
        // 向右滑动，显示上一个文件
        handlePrevFile();
      } else if (deltaX < 0 && hasNextFile) {
        // 向左滑动，显示下一个文件
        handleNextFile();
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [handlePrevFile, handleNextFile, hasPrevFile, hasNextFile]);

  // 鼠标移动事件处理，控制翻页按钮显示
  const handleMouseMove = useCallback((event) => {
    const { clientX } = event;
    const windowWidth = window.innerWidth;
    const halfWidth = windowWidth / 2;

    // 鼠标在左半边时显示左箭头
    if (clientX <= halfWidth) {
      setShowLeftButton(true);
      setShowRightButton(false);
    }
    // 鼠标在右半边时显示右箭头
    else {
      setShowLeftButton(false);
      setShowRightButton(true);
    }
  }, []);

  // 鼠标离开页面时隐藏按钮
  const handleMouseLeave = useCallback(() => {
    setShowLeftButton(false);
    setShowRightButton(false);
  }, []);

  // 复制到剪贴板功能（带防抖处理）
  const copyToClipboard = (text) => {
    // 清除之前的防抖定时器
    if (copyDebounceRef.current) {
      clearTimeout(copyDebounceRef.current);
    }

    navigator.clipboard
      .writeText(text)
      .then(async () => {
        // 防抖处理：300ms内只显示一次提示
        copyDebounceRef.current = setTimeout(async () => {
          await toast.success('内容已复制', { duration: 2 });
        }, 300);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  // 滚动监听函数
  const handleScroll = useCallback(() => {
    // 如果正在恢复滚动位置，跳过处理
    if (isRestoringRef.current) {
      return;
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 防抖处理，避免频繁保存
    scrollTimeoutRef.current = setTimeout(() => {
      if (contentRef.current && !isRestoringRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        dispatch(saveReadingPosition({ fileKey, scrollTop }));
      }
    }, 500); // 500ms防抖
  }, [dispatch, fileKey]);

  // 恢复滚动位置
  const restoreScrollPosition = useCallback(() => {
    if (readingPosition && contentRef.current && !hasRestoredRef.current && !loading) {
      isRestoringRef.current = true;
      hasRestoredRef.current = true;

      // 确保内容已完全渲染
      const restore = () => {
        if (contentRef.current && contentRef.current.scrollHeight > 0) {
          contentRef.current.scrollTop = readingPosition.scrollTop;
          // 恢复完成后重置标志位
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 100);
        }
      };

      // 使用requestAnimationFrame确保DOM更新完成
      requestAnimationFrame(() => {
        setTimeout(restore, 50);
      });
    }
  }, [readingPosition, loading]);

  useEffect(() => {
    const loadFile = async () => {
      setLoading(true);
      // 重置恢复标志位，允许新文件恢复滚动位置
      hasRestoredRef.current = false;

      try {
        const fileContent = await loadMarkdownFile(fileName, currentFolder);
        setContent(fileContent);

        // 设置文件统计信息
        setFileStats({
          name: fileName,
          size: fileContent.length,
          lastModified: new Date().toLocaleString()
        });

        // 不在这里直接恢复滚动位置，而是通过单独的useEffect处理
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
  }, [fileName, currentFolder]);

  // 内容加载完成后恢复滚动位置
  useEffect(() => {
    if (!loading && content && !hasRestoredRef.current) {
      const timer = setTimeout(() => {
        restoreScrollPosition();
      }, 300); // 延迟确保内容完全渲染

      return () => clearTimeout(timer);
    }
  }, [loading, content, restoreScrollPosition]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: theme.background.primary,
        position: 'relative'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
      <div
        ref={contentRef}
        onScroll={handleScroll}
        style={{
          backgroundColor: theme.background.card,
          padding: '24px 32px',
          margin: '24px 16px 16px 16px',
          borderRadius: '8px',
          boxShadow: theme.shadow.md,
          border: `1px solid ${theme.border.primary}`,
          minHeight: 'calc(100vh - 140px)',
          width: 'calc(100% - 32px)',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 140px)'
        }}>
        <MarkdownRenderer content={debouncedContent} copyToClipboard={copyToClipboard} currentFileName={fileName} />
      </div>

      {/* 翻页按钮 */}
      {hasPrevFile && (
        <div
          style={{
            position: 'fixed',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            opacity: showLeftButton ? 1 : 0,
            visibility: showLeftButton ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
            pointerEvents: showLeftButton ? 'auto' : 'none'
          }}
        >
          <div
            onClick={handlePrevFile}
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            title="上一个文件"
          >
            <LeftOutlined
              style={{
                fontSize: 24,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(128, 128, 128, 0.4)',
                filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2)) blur(0.5px)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
      )}

      {hasNextFile && (
        <div
          style={{
            position: 'fixed',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            opacity: showRightButton ? 1 : 0,
            visibility: showRightButton ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
            pointerEvents: showRightButton ? 'auto' : 'none'
          }}
        >
          <div
            onClick={handleNextFile}
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            title="下一个文件"
          >
            <RightOutlined
              style={{
                fontSize: 24,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(128, 128, 128, 0.4)',
                filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2)) blur(0.5px)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <FloatButton.BackTop
        target={() => contentRef.current}
        visibilityHeight={100}
        tooltip="返回顶部"
      />
    </div>
  );
};

export default MarkdownViewer;
