import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Tree,
  Button,
  Input,
  Space,
  Typography,
  message,
  Tooltip,
  Card,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  FileTextOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
  CloseCircleOutlined,
  MoonFilled,
  SunOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { useTheme } from "../theme/ThemeContext";
import AppHeader from "./AppHeader";
import { useAppDispatch, useCurrentFile, useTreeData, useExpandedSections, useSelectedKeys, useIsModified, useUnsavedContent } from "../store/hooks";
import { setCurrentFile, setTreeData, setExpandedSections, setSelectedKeys, setIsModified, setUnsavedContent } from "../store/slices/editorSlice";
import stateManager from "../utils/stateManager";
import "./TreeEditor.scss";

const { Text, Title } = Typography;

// 解析树形文本
const parseTreeText = (text) => {
  const lines = text.split("\n").filter((line) => line.trim());
  const root = { key: "root", title: "知识点脉络", children: [], level: -1 };
  const stack = [root];
  let keyCounter = 0;

  // 跟踪每种语言的最后一个跳转索引
  const lastJumpIndex = {};

  lines.forEach((line, _) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // 计算缩进级别
    const level = line.length - line.trimStart().length; // 假设每个缩进是1个tab或若干空格

    // 检查是否包含跳转信息
    // 先清理可能存在的回车符和换行符
    const cleanLine = trimmedLine.replace(/[\r\n]/g, "");

    // 支持多种跳转语法：
    // 1. >java[1] - 指定索引
    // 2. >java++ - 递增（上一个+1）
    // 3. >java - 同上一个索引
    // 4. >java+=n - 跳跃增加（上一个+n）
    const jumpMatchExplicit = cleanLine.match(/>([a-zA-Z]+)\[(\d+)]/);
    const jumpMatchJump = cleanLine.match(/>([a-zA-Z]+)\+=(\d+)/);
    const jumpMatchSame = cleanLine.match(/>([a-zA-Z]+)(?!\[|\+|=)\s*$/);

    // 使用字符串方法检测递增语法
    let jumpMatchIncrement = null;
    if (cleanLine.includes("++")) {
      const incrementMatch = cleanLine.match(/>([a-zA-Z]+)\+\+/);
      if (incrementMatch) {
        jumpMatchIncrement = incrementMatch;
      }
    }

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
      // 移除所有类型的跳转语法，按照从具体到一般的顺序
      cleanTitle = cleanTitle
        .replace(/\s*>([a-zA-Z]+)\[(\d+)]\s*$/, "") // >java[1]
        .replace(/\s*>([a-zA-Z]+)\+=(\d+)\s*$/, "") // >java+=n
        .replace(/\s*>([a-zA-Z]+)\+\+\s*$/, "") // >java++
        .replace(/\s*>([a-zA-Z]+)\s*$/, "") // >java
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
      children: [],
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

// 将树形数据转换为文本
const treeToText = (nodes, level = 0) => {
  let result = "";

  nodes.forEach((node) => {
    // 优先使用originalText来保持原始格式
    if (node.originalText) {
      const indent = "  ".repeat(level);
      result += indent + node.originalText + "\n";
    } else {
      // 如果没有originalText，只输出节点标题，不重新构建跳转语法
      const indent = "  ".repeat(level);
      result += indent + node.title + "\n";
    }

    if (node.children && node.children.length > 0) {
      result += treeToText(node.children, level + 1);
    }
  });

  return result;
};

const TreeEditor = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  // Redux状态
  const currentFile = useCurrentFile();
  const treeData = useTreeData();
  const expandedSections = useExpandedSections();
  const selectedKeys = useSelectedKeys();
  const isModified = useIsModified();
  const unsavedContent = useUnsavedContent();

  // 本地状态
  const [editingNode, setEditingNode] = useState(null);
  const [editValue, setEditValue] = useState("");

  // 生成新的节点key
  const generateNodeKey = () => {
    const allKeys = [];
    const collectKeys = (nodes) => {
      nodes.forEach((node) => {
        allKeys.push(node.key);
        if (node.children) collectKeys(node.children);
      });
    };
    collectKeys(treeData);

    let counter = 1;
    while (allKeys.includes(`node-${counter}`)) {
      counter++;
    }
    return `node-${counter}`;
  };

  // 主题已由ThemeContext管理，无需额外处理

  // 开始编辑节点
  const startEditNode = (node) => {
    setEditingNode(node.key);
    // 优先使用originalText保持原始格式，否则只使用title
    const value = node.originalText || node.title;
    setEditValue(value);
  };

  // 保存编辑
  const saveEdit = () => {
    if (!editingNode) return;

    const value = editValue.trim();
    if (!value) {
      message.error("节点内容不能为空");
      return;
    }

    // 解析编辑内容，支持多种跳转语法格式
    const jumpMatchExplicit = value.match(/^(.+?)\s*>([a-zA-Z]+)\[(\d+)\]\s*$/);
    const jumpMatchIncrement = value.match(/^(.+?)\s*>([a-zA-Z]+)\+\+\s*$/);
    const jumpMatchJump = value.match(/^(.+?)\s*>([a-zA-Z]+)\+=(\d+)\s*$/);
    const jumpMatchSame = value.match(/^(.+?)\s*>([a-zA-Z]+)\s*$/);

    let title,
      jumpLanguage = null,
      jumpIndex = null,
      hasJump = false,
      originalText = value; // 保持原始输入格式

    if (jumpMatchExplicit) {
      title = jumpMatchExplicit[1].trim();
      jumpLanguage = jumpMatchExplicit[2];
      jumpIndex = parseInt(jumpMatchExplicit[3]);
      hasJump = true;
    } else if (jumpMatchIncrement) {
      title = jumpMatchIncrement[1].trim();
      jumpLanguage = jumpMatchIncrement[2];
      hasJump = true;
      // 对于++语法，不设置具体的jumpIndex，保持原始格式
    } else if (jumpMatchJump) {
      title = jumpMatchJump[1].trim();
      jumpLanguage = jumpMatchJump[2];
      hasJump = true;
      // 对于+=语法，不设置具体的jumpIndex，保持原始格式
    } else if (jumpMatchSame) {
      title = jumpMatchSame[1].trim();
      jumpLanguage = jumpMatchSame[2];
      hasJump = true;
      // 对于同索引语法，不设置具体的jumpIndex，保持原始格式
    } else {
      title = value;
    }

    const updateNodeRecursive = (nodes) => {
      return nodes.map((node) => {
        if (node.key === editingNode) {
          return {
            ...node,
            title,
            hasJump,
            jumpLanguage,
            jumpIndex,
            originalText, // 保存原始文本格式
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNodeRecursive(node.children),
          };
        }
        return node;
      });
    };

    dispatch(setTreeData(updateNodeRecursive(treeData)));
    setEditingNode(null);
    setEditValue("");
    dispatch(setIsModified(true));
    message.success("节点更新成功");
  };

  // 取消编辑（自动保存）
  const cancelEdit = () => {
    if (editingNode && editValue.trim()) {
      saveEdit();
    } else {
      setEditingNode(null);
      setEditValue("");
    }
  };

  // 添加子节点
  const handleAddNode = (parentKey) => {
    const newNodeKey = generateNodeKey();
    const newNode = {
      key: newNodeKey,
      title: "",
      hasJump: false,
      jumpLanguage: null,
      jumpIndex: null,
      originalText: "", // 添加originalText属性
      children: [],
    };

    const addNodeRecursive = (nodes) => {
      return nodes.map((node) => {
        if (node.key === parentKey) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addNodeRecursive(node.children),
          };
        }
        return node;
      });
    };

    if (parentKey === "root") {
      dispatch(setTreeData([...treeData, newNode]));
    } else {
      dispatch(setTreeData(addNodeRecursive(treeData)));
    }

    // 展开父节点
    if (parentKey !== "root") {
      dispatch(setExpandedSections([...new Set([...expandedSections, parentKey])]));
    }

    // 立即开始编辑新节点
    setEditingNode(newNodeKey);
    setEditValue("");
    dispatch(setIsModified(true));
  };

  // 删除节点
  const handleDeleteNode = (nodeKey) => {
    const deleteNodeRecursive = (nodes) => {
      return nodes.filter((node) => {
        if (node.key === nodeKey) {
          return false;
        }
        if (node.children) {
          node.children = deleteNodeRecursive(node.children);
        }
        return true;
      });
    };

    dispatch(setTreeData(deleteNodeRecursive(treeData)));
    dispatch(setIsModified(true));
    message.success("节点删除成功");
  };

  // 渲染树节点
  const renderTreeNode = useCallback(
    (node) => {
      const isEditing = editingNode === node.key;

      if (isEditing) {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedSections.includes(node.key);
        const isClickable = node.hasJump;

        return {
          key: node.key,
          title: (
            <div className="tree-node-editing">
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpenOutlined
                    className="tree-icon folder-icon"
                    style={{
                      color: isClickable ? "#1890ff" : "#faad14",
                    }}
                  />
                ) : (
                  <FolderOutlined
                    className="tree-icon folder-icon"
                    style={{
                      color: isClickable ? "#1890ff" : "#faad14",
                    }}
                  />
                )
              ) : isClickable ? (
                <CodeOutlined
                  className="tree-icon file-icon code-indicator"
                  style={{
                    color: "#1890ff",
                  }}
                />
              ) : (
                <FileTextOutlined className="tree-icon file-icon" />
              )}
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onPressEnter={saveEdit}
                onBlur={cancelEdit}
                autoFocus
                size="small"
                placeholder="输入节点内容，支持跳转语法：标题 >language[index]"
              />
            </div>
          ),
          children: node.children?.map((child) => renderTreeNode(child)),
        };
      }

      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedSections.includes(node.key);
      const isClickable = node.hasJump;

      return {
        key: node.key,
        title: (
          <div
            className={`tree-node-content ${isClickable ? "tree-node-clickable" : ""}`}
          >
            <Space size="small">
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpenOutlined
                    className="tree-icon folder-icon"
                    style={
                      isClickable
                        ? {
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : {}
                    }
                  />
                ) : (
                  <FolderOutlined
                    className="tree-icon folder-icon"
                    style={
                      isClickable
                        ? {
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : {}
                    }
                  />
                )
              ) : isClickable ? (
                <CodeOutlined
                  className="tree-icon file-icon code-indicator"
                  style={{
                    color: "#1890ff",
                  }}
                />
              ) : (
                <FileTextOutlined className="tree-icon file-icon" />
              )}
              <span
                className={`node-title ${isClickable ? "has-code" : ""}`}
                onClick={() => startEditNode(node)}
              >
                {(() => {
                  const text = node.title || "(空节点)";
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
                    const codeStyle = isClickable
                      ? {
                          // 跳转节点：使用渐变色文字，背景样式与普通节点保持一致
                          backgroundColor: isDarkMode ? "#1e3a5f" : "#e6f3ff",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          padding: "3px 6px",
                          margin: "0 6px",
                          borderRadius: "4px",
                          fontSize: "1em",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: "500",
                          border: `1px solid ${isDarkMode ? "#2563eb" : "#93c5fd"}`,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }
                      : {
                          // 普通节点：使用常规样式
                          backgroundColor: isDarkMode ? "#1e3a5f" : "#e6f3ff",
                          color: isDarkMode ? "#d1d5db" : "#374151",
                          padding: "3px 6px",
                          margin: "0 6px",
                          borderRadius: "4px",
                          fontSize: "1em",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: "500",
                          border: `1px solid ${isDarkMode ? "#2563eb" : "#93c5fd"}`,
                          WebkitTextFillColor: "initial",
                          backgroundClip: "initial",
                          WebkitBackgroundClip: "initial",
                        };

                    parts.push(
                      <code key={match.index} style={codeStyle}>
                        {match[1]}
                      </code>,
                    );
                    lastIndex = codeRegex.lastIndex;
                  }

                  // 添加剩余的普通文本
                  if (lastIndex < text.length) {
                    parts.push(text.slice(lastIndex));
                  }

                  return parts;
                })()}
              </span>
            </Space>
            <Space className="node-actions">
              <Tooltip title="添加子节点">
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode(node.key);
                  }}
                />
              </Tooltip>
              <Tooltip title="删除节点">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNode(node.key);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        ),
        children: node.children?.map((child) => renderTreeNode(child)),
      };
    },
    [editingNode, editValue, expandedSections, isDarkMode],
  );

  // 处理文件加载
  const handleLoadFile = async () => {
    try {
      const result = await window.api.openFileDialog();
      if (result && !result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const content = await window.api.readFile(filePath);
        const parsedData = parseTreeText(content);
        dispatch(setTreeData(parsedData));
        dispatch(setCurrentFile(filePath));
        dispatch(setIsModified(false));
        message.success("文件加载成功");
      }
    } catch (error) {
      message.error("文件加载失败: " + error.message);
    }
  };

  // 直接加载指定文件路径的函数
  const loadSpecificFile = async (filePath) => {
    try {
      const content = await window.api.readFile(filePath);
      const parsedData = parseTreeText(content);
      dispatch(setTreeData(parsedData));
      dispatch(setCurrentFile(filePath));
      dispatch(setIsModified(false));
      message.success(`文件加载成功: ${filePath}`);
      return true;
    } catch (error) {
      message.error("文件加载失败: " + error.message);
      return false;
    }
  };

  // 暴露loadSpecificFile函数给外部组件使用
  useEffect(() => {
    window.treeEditor = {
      loadSpecificFile,
    };
    return () => {
      delete window.treeEditor;
    };
  }, []);

  // 状态恢复：当currentFile存在且treeData为空时，自动加载文件
  useEffect(() => {
    const restoreFileContent = async () => {
      if (currentFile && (!treeData || treeData.length === 0)) {
        try {
          const content = await window.api.readFile(currentFile);
          const parsedData = parseTreeText(content);
          dispatch(setTreeData(parsedData));
          dispatch(setIsModified(false));
          console.log(`状态恢复：成功加载文件 ${currentFile}`);
        } catch (error) {
          console.warn(`状态恢复失败：无法加载文件 ${currentFile}:`, error.message);
          // 如果文件不存在，清除当前文件状态
          dispatch(setCurrentFile(null));
        }
      }
    };

    restoreFileContent();
  }, [currentFile, treeData, dispatch]);

  // 自动保存状态到electron-store
  useEffect(() => {
    const saveStateToStore = async () => {
      try {
        await stateManager.saveEditorState({
          currentFile,
          treeData,
          expandedSections,
          isModified
        });
      } catch (error) {
        console.error('保存状态到electron-store失败:', error);
      }
    };

    // 防抖保存，避免频繁写入
    const timeoutId = setTimeout(saveStateToStore, 500);
    return () => clearTimeout(timeoutId);
  }, [currentFile, treeData, expandedSections, isModified]);

  // 处理文件保存
  const handleSaveFile = async () => {
    try {
      const content = treeToText(treeData);
      if (currentFile) {
        await window.api.writeFile(currentFile, content);
        message.success("文件保存成功");
      } else {
        const result = await window.api.saveFileDialog();
        if (result && !result.canceled && result.filePath) {
          await window.api.writeFile(result.filePath, content);
          dispatch(setCurrentFile(result.filePath));
          message.success("文件保存成功");
        }
      }
      dispatch(setIsModified(false));
    } catch (error) {
      message.error("文件保存失败: " + error.message);
    }
  };

  // 展开/折叠所有节点
  const handleExpandAll = () => {
    const getAllKeys = (nodes) => {
      let keys = [];
      nodes.forEach((node) => {
        keys.push(node.key);
        if (node.children) {
          keys = keys.concat(getAllKeys(node.children));
        }
      });
      return keys;
    };
    dispatch(setExpandedSections(getAllKeys(treeData)));
  };

  const handleCollapseAll = () => {
    dispatch(setExpandedSections([]));
  };

  // 树形数据
  const treeNodes = useMemo(() => {
    return treeData.map((node) => renderTreeNode(node));
  }, [treeData, renderTreeNode]);

  return (
    <div className={`tree-editor ${isDarkMode ? "dark" : "light"}`}>
      <AppHeader
        onOpenFile={handleLoadFile}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onSaveFile={handleSaveFile}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onAddRootNode={() => handleAddNode("root")}
      />
      <div className="editor-content">
        <Card
          className={`tree-viewer-card ${isDarkMode ? "dark" : "light"}`}
          title={
            <div className="tree-header">
              <Title level={4} style={{ margin: 0 }}>
                📝 树形编辑器
              </Title>
              <Space>
                <Tooltip title="展开所有">
                  <Button
                    onClick={handleExpandAll}
                    size="small"
                    icon={<ExpandAltOutlined />}
                    type="text"
                  />
                </Tooltip>
                <Tooltip title="折叠所有">
                  <Button
                    onClick={handleCollapseAll}
                    size="small"
                    icon={<ShrinkOutlined />}
                    type="text"
                  />
                </Tooltip>
                <Tooltip title="从文件加载">
                  <Button
                    onClick={handleLoadFile}
                    size="small"
                    icon={<FolderOpenOutlined />}
                    type="text"
                  />
                </Tooltip>
                <Tooltip title="保存到文件">
                  <Button
                    onClick={handleSaveFile}
                    size="small"
                    icon={<FileTextOutlined />}
                    type="text"
                  />
                </Tooltip>
                <Tooltip title="添加根节点">
                  <Button
                    onClick={() => handleAddNode("root")}
                    size="small"
                    icon={<PlusOutlined />}
                    type="text"
                  />
                </Tooltip>
              </Space>
            </div>
          }
          size="small"
        >
          <div className="tree-container">
            {treeNodes.length > 0 ? (
              <Tree
                treeData={treeNodes}
                expandedKeys={expandedSections}
                selectedKeys={selectedKeys}
                onExpand={(keys) => dispatch(setExpandedSections(keys))}
                onSelect={(keys) => dispatch(setSelectedKeys(keys))}
                showLine={{ showLeafIcon: false }}
                showIcon={false}
                className="editable-tree"
                blockNode
                switcherIcon={({ expanded }) => (
                  <div
                    className={`custom-switcher ${expanded ? "expanded" : "collapsed"}`}
                  >
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
            ) : (
              <div className="empty-tree">
                <FileTextOutlined
                  style={{ fontSize: 48, color: "#434343", marginBottom: 16 }}
                />
                <p>暂无数据，点击"添加根节点"开始创建</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TreeEditor;
