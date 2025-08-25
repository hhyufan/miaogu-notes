
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import { useCurrentFile, useAppDispatch } from "./store/hooks";
import { setCurrentFile, setTreeData, setSelectedKeys, setIsModified, setExpandedSections } from "./store/slices/editorSlice";
import TreeEditor from "./components/TreeEditor";
import StatusBar from "./components/StatusBar";
import stateManager from "./utils/stateManager";
import "./App.css";

const AppContent = () => {
  const { isDarkMode, theme: currentTheme } = useTheme();
  const currentFile = useCurrentFile();
  const dispatch = useAppDispatch();

  // 状态恢复功能
  useEffect(() => {
    const restoreState = async () => {
      try {
        // 从electron-store恢复编辑器状态
        const savedState = await stateManager.loadEditorState();
        
        if (savedState.currentFile) {
          // 验证文件是否仍然存在
          try {
            await window.api.readFile(savedState.currentFile);
            // 恢复所有状态
            dispatch(setCurrentFile(savedState.currentFile));
            dispatch(setTreeData(savedState.treeData || []));
            dispatch(setExpandedSections(savedState.expandedSections || []));
            dispatch(setIsModified(savedState.isModified || false));
            console.log(`状态已恢复: ${savedState.currentFile}`);
          } catch (error) {
            console.warn(`无法恢复文件 ${savedState.currentFile}:`, error.message);
            // 文件不存在时清除相关状态
            await stateManager.saveState('editorState', {
              currentFile: null,
              treeData: [],
              expandedKeys: [],
              isModified: false
            });
          }
        }
      } catch (error) {
        console.error('状态恢复失败:', error);
      }
    };

    restoreState();
  }, []); // 只在组件挂载时执行一次

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorBgContainer: currentTheme.background.card,
          colorBgElevated: currentTheme.background.tertiary,
          colorBorder: currentTheme.border.primary,
          colorText: currentTheme.text.primary,
        },
      }}
    >
      <div className="app-container">
        <TreeEditor />
        <StatusBar currentFile={currentFile} />
      </div>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
