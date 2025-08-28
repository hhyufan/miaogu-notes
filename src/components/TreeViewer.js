import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Skeleton, Space, Tooltip, Tree, Typography } from 'antd';
import {
  CodeOutlined,
  DownloadOutlined,
  ExpandAltOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  ShrinkOutlined
} from '@ant-design/icons';
import { useTheme } from '../theme';
import { exportTreeToPNG } from '../utils/exportUtils';
import './TreeViewer.css';

const { Text, Title } = Typography;

// 解析树状文本为树形数据结构
const parseTreeText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  const root = { key: 'root', title: '知识点脉络', children: [], level: -1 };
  const stack = [root];
  let keyCounter = 0;

  // 跟踪每种语言的最后一个跳转索引
  const lastJumpIndex = {};

  lines.forEach((line, _) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // 计算缩进级别
    const level = (line.length - line.trimStart().length); // 假设每个缩进是1个tab或若干空格

    // 检查是否包含跳转信息
    // 先清理可能存在的回车符和换行符
    const cleanLine = trimmedLine.replace(/[\r\n]/g, '');

    // 支持多种跳转语法：
    // 1. >java[1] - 指定索引
    // 2. >java++ - 递增（上一个+1）
    // 3. >java - 同上一个索引
    // 4. >java+=n - 跳跃增加（上一个+n）
    const jumpMatchExplicit = cleanLine.match(/>([a-zA-Z]+)\[(\d+)]/);
    const jumpMatchIncrement = cleanLine.match(/>([a-zA-Z]+)\+\+/);
    const jumpMatchJump = cleanLine.match(/>([a-zA-Z]+)\+=(\d+)/);
    const jumpMatchSame = cleanLine.match(/>([a-zA-Z]+)(?!\[|\+)/);

    let hasJump = false;
    let jumpLanguage = null;
    let jumpIndex = null;

    if (jumpMatchExplicit) {
      // 显式指定索引：>java[1]
      hasJump = true;
      jumpLanguage = jumpMatchExplicit[1];
      jumpIndex = parseInt(jumpMatchExplicit[2]);
      lastJumpIndex[jumpLanguage] = jumpIndex;
    } else if (jumpMatchIncrement) {
      // 递增语法：>java++
      hasJump = true;
      jumpLanguage = jumpMatchIncrement[1];
      jumpIndex = (lastJumpIndex[jumpLanguage] || 0) + 1;
      lastJumpIndex[jumpLanguage] = jumpIndex;
    } else if (jumpMatchJump) {
      // 跳跃增加语法：>java+=n
      hasJump = true;
      jumpLanguage = jumpMatchJump[1];
      const jumpAmount = parseInt(jumpMatchJump[2]);
      jumpIndex = (lastJumpIndex[jumpLanguage] || 0) + jumpAmount;
      lastJumpIndex[jumpLanguage] = jumpIndex;
    } else if (jumpMatchSame) {
      // 同上一个索引：>java
      hasJump = true;
      jumpLanguage = jumpMatchSame[1];
      jumpIndex = lastJumpIndex[jumpLanguage] || 1; // 如果没有上一个，默认为1
      // 不更新lastJumpIndex，保持原值
    }

    // 清理标题，移除跳转信息但保留代码块标记
    let cleanTitle = cleanLine;
    if (hasJump) {
      // 移除所有类型的跳转语法
      cleanTitle = cleanTitle
        .replace(/\s*>([a-zA-Z]+)\[(\d+)]\s*$/, '')   // >java[1]
        .replace(/\s*>([a-zA-Z]+)\+\+\s*$/, '')        // >java++
        .replace(/\s*>([a-zA-Z]+)\+=(\d+)\s*$/, '')   // >java+=n
        .replace(/\s*>([a-zA-Z]+)(?!\[|\+)\s*$/, '')   // >java
        .trim();
    }

    const node = {
      key: `node-${keyCounter++}`,
      title: cleanTitle,
      level: level,
      originalText: trimmedLine,
      hasJump: hasJump,
      isClickable: hasJump,
      jumpLanguage: jumpLanguage,
      jumpIndex: jumpIndex,
      children: []
    };

    // 找到正确的父节点
    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    parent.children.push(node);
    stack.push(node);
  });

  return root.children;
};

// 渲染树节点
const renderTreeNode = (node, onJumpToCode, isDarkMode, expandedKeys, onToggleExpand) => {
  const isClickable = node.isClickable;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedKeys.includes(node.key);

  const handleNodeClick = (e) => {
    if (isClickable && onJumpToCode) {
      // 跳转节点：执行跳转功能
      e.stopPropagation();
      onJumpToCode(node.jumpLanguage, node.jumpIndex);
    } else if (hasChildren && !isClickable && onToggleExpand) {
      // 非跳转的目录节点：执行展开折叠功能
      e.stopPropagation();
      onToggleExpand(node.key, isExpanded);
    }
  };

  return {
    key: node.key,
    title: (
      <div
        className={`tree-node-content ${isClickable ? 'tree-node-clickable' : ''}`}
        onClick={handleNodeClick}
      >
        <Space size="small">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpenOutlined
                className="tree-icon folder-icon"
                style={isClickable ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                } : {}}
              />
            ) : (
              <FolderOutlined
                className="tree-icon folder-icon"
                style={isClickable ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                } : {}}
              />
            )
          ) : (
            isClickable ? (
              <CodeOutlined
                className="tree-icon file-icon code-indicator"
                style={{
                  color: '#1890ff'
                }}
              />
            ) : (
              <FileTextOutlined className="tree-icon file-icon" />
            )
          )}
          <Text className={`tree-node-text ${isClickable ? 'has-code' : ''}`}>
            {(() => {
              const text = node.title;
              const codeRegex = /`([^`]+)`/g;

              // 如果文本中没有反引号，直接返回原始文本
              if (!codeRegex.test(text)) {
                return text;
              }

              // 重置正则表达式
              codeRegex.lastIndex = 0;

              const parts = [];
              let lastIndex = 0;
              let match;

              while ((match = codeRegex.exec(text)) !== null) {
                // 添加代码块前的普通文本
                if (match.index > lastIndex) {
                  parts.push(text.slice(lastIndex, match.index));
                }



                // 添加行内代码，根据是否为跳转节点使用不同样式
                const codeStyle = isClickable ? {
                  // 跳转节点：使用渐变色文字，背景样式与普通节点保持一致
                  backgroundColor: isDarkMode ? '#1e3a5f' : '#e6f3ff',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  padding: '3px 6px',
                  margin: '0 6px',
                  borderRadius: '4px',
                  fontSize: '1em',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '500',
                  border: `1px solid ${isDarkMode ? '#2563eb' : '#93c5fd'}`
                } : {
                  // 普通节点：使用常规样式
                  backgroundColor: isDarkMode ? '#1e3a5f' : '#e6f3ff',
                  color: isDarkMode ? '#d1d5db' : '#374151',
                  padding: '3px 6px',
                  margin: '0 6px',
                  borderRadius: '4px',
                  fontSize: '1em',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '500',
                  border: `1px solid ${isDarkMode ? '#2563eb' : '#93c5fd'}`,
                  WebkitTextFillColor: 'initial',
                  backgroundClip: 'initial',
                  WebkitBackgroundClip: 'initial'
                };

                parts.push(
                  <code key={match.index} style={codeStyle}>
                    {match[1]}
                  </code>
                );
                lastIndex = codeRegex.lastIndex;
              }

              // 添加剩余的普通文本
              if (lastIndex < text.length) {
                parts.push(text.slice(lastIndex));
              }

              return parts;
            })()}
          </Text>

        </Space>
      </div>
    ),
    children: node.children?.map(child => renderTreeNode(child, onJumpToCode, isDarkMode, expandedKeys, onToggleExpand))
  };
};

const TreeViewer = ({ treeFilePath, treeContent, className = '', onJumpToCode, currentFileName }) => {

  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFileKey, setCurrentFileKey] = useState(null);
  const { isDarkMode, theme } = useTheme();

  // 生成localStorage的key
  const getStorageKey = useCallback((fileName) => {
    return `treeViewer_expanded_${fileName || 'default'}`;
  }, []);

  // 保存展开状态到localStorage
  const saveExpandedState = useCallback((keys, fileName) => {
    if (!fileName) return;
    try {
      const storageKey = getStorageKey(fileName);
      localStorage.setItem(storageKey, JSON.stringify(keys));
    } catch (error) {
      console.warn('保存树状图展开状态失败:', error);
    }
  }, [getStorageKey]);

  // 从localStorage恢复展开状态
  const loadExpandedState = useCallback((fileName) => {
    if (!fileName) return [];
    try {
      const storageKey = getStorageKey(fileName);
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('恢复树状图展开状态失败:', error);
      return [];
    }
  }, [getStorageKey]);

  // 处理树状数据
  const processTreeData = useCallback((text, fileName) => {
    try {
      const parsedData = parseTreeText(text);
      setTreeData(parsedData);

      // 检查是否是文件切换（排除初始化情况）
      const isFileChanged = currentFileKey !== null && currentFileKey !== fileName;

      if (isFileChanged) {
        // 文件切换时重置为全折叠状态
        setExpandedKeys([]);
        setCurrentFileKey(fileName);
        // 保存重置状态
        saveExpandedState([], fileName);
      } else {
        // 初始化或同一文件时恢复之前的展开状态
        const savedKeys = loadExpandedState(fileName);
        setExpandedKeys(savedKeys);
        setCurrentFileKey(fileName);
      }
    } catch (err) {
      console.error('解析树状数据失败:', err);
      setError(err.message);
    }
  }, [currentFileKey, loadExpandedState, saveExpandedState]);

  // 加载树状文件内容或处理直接传入的内容
  useEffect(() => {

    if (treeContent) {
      // 直接使用传入的内容
      setLoading(false);
      setError(null);
      processTreeData(treeContent, currentFileName);
      return;
    }

    if (!treeFilePath) return;

    const loadTreeFile = async () => {
      setLoading(true);
      setError(null);

      try {
        // 构建完整的文件路径
        const fullPath = treeFilePath.startsWith('http')
          ? treeFilePath
          : `/markdown-files/JavaFundamentals/trees/${treeFilePath}`;

        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`无法加载文件: ${response.status}`);
        }

        const text = await response.text();
        processTreeData(text, currentFileName);

      } catch (err) {
        console.error('加载树状文件失败:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTreeFile().then();
  }, [treeFilePath, treeContent, processTreeData, currentFileName]);

  // 展开/折叠处理
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    // 自动保存展开状态
    saveExpandedState(expandedKeysValue, currentFileName);
  };

  // 切换单个节点的展开状态
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onToggleExpand = (nodeKey, isCurrentlyExpanded) => {
    let newKeys;
    if (isCurrentlyExpanded) {
      newKeys = expandedKeys.filter(key => key !== nodeKey);
      setExpandedKeys(newKeys);
    } else {
      newKeys = [...expandedKeys, nodeKey];
      setExpandedKeys(newKeys);
    }
    // 自动保存展开状态
    saveExpandedState(newKeys, currentFileName);
  };

  // 渲染树形数据
  const renderedTreeData = useMemo(() => {
    return treeData.map(node => renderTreeNode(node, onJumpToCode, isDarkMode, expandedKeys, onToggleExpand));
  }, [treeData, onJumpToCode, isDarkMode, expandedKeys, onToggleExpand]);

  // 全部展开
  const expandAll = () => {
    const allKeys = [];
    const collectAllKeys = (nodes) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          allKeys.push(node.key);
          collectAllKeys(node.children);
        }
      });
    };
    collectAllKeys(treeData);
    setExpandedKeys(allKeys);
    // 自动保存展开状态
    saveExpandedState(allKeys, currentFileName);
  };

  // 全部折叠
  const collapseAll = () => {
    setExpandedKeys([]);
    // 自动保存展开状态
    saveExpandedState([], currentFileName);
  };

  // PNG导出功能
  const handleExportToPNG = async () => {
    try {
      // 确定文件名
      const fileName = currentFileName ? 
        currentFileName.replace(/\.(md|mgtree)$/, '') : 
        'knowledge-tree';
      
      // 在导出前先展开所有节点
      const allKeys = [];
      const collectKeys = (nodes) => {
        nodes.forEach(node => {
          if (node.key) {
            allKeys.push(node.key);
          }
          if (node.children && node.children.length > 0) {
            collectKeys(node.children);
          }
        });
      };
      
      if (treeData && treeData.length > 0) {
        collectKeys(treeData);
        setExpandedKeys(allKeys);
        
        // 等待DOM更新
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // 调用导出函数
      await exportTreeToPNG('.tree-container', fileName, theme);
    } catch (error) {
      console.error('PNG导出失败:', error);
    }
  };

  if (loading) {
    return (
      <Card
        className={`tree-viewer-card loading ${className}`}
        title={
          <div className="tree-header">
            <Title level={4} style={{ margin: 0 }}>📊 知识点脉络</Title>
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
    );
  }

  if (error) {
    return (
      <Card className={`tree-viewer-card error ${className}`}>
        <div className="tree-error">
          <Text type="danger">加载失败: {error}</Text>
        </div>
      </Card>
    );
  }

  if (!treeData.length) {
    return null;
  }

  return (
    <Card
      className={`tree-viewer-card ${className}`}
      title={
        <div className="tree-header">
          <Title level={4} style={{ margin: 0 }}>📊 知识点脉络</Title>
          <Space>
            <Tooltip title="导出PNG">
              <Button
                onClick={handleExportToPNG}
                size="small"
                icon={<DownloadOutlined />}
                type="text"
              />
            </Tooltip>
            <Tooltip title="全部展开">
              <Button
                onClick={expandAll}
                size="small"
                icon={<ExpandAltOutlined />}
                type="text"
              />
            </Tooltip>
            <Tooltip title="全部折叠">
              <Button
                onClick={collapseAll}
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
        <Tree
          showLine={{ showLeafIcon: false }}
          showIcon={false}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          treeData={renderedTreeData}
          switcherIcon={({ expanded }) => (
            <div className={`custom-switcher ${expanded ? 'expanded' : 'collapsed'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          )}
        />
      </div>
    </Card>
  );
};

export default TreeViewer;
