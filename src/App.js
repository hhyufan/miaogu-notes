import React, { useEffect, useState } from 'react';
import { Layout, ConfigProvider, theme, FloatButton } from 'antd';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import FilesList from './components/FilesList';
import FoldersList from './components/FoldersList';
import MarkdownViewer from './components/MarkdownViewer';
import { loadFileStats, loadFileSummaries, loadFolderSummaries } from './utils/fileUtils';
import { ThemeProvider, useTheme } from './theme';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  setFileStats,
  setAllFileStats,
  setTotalChars,
  setLoading,
  setFileSummaries,
  setFolderSummaries,
  applySorting,
  openFolder,
  backToFolders,
  openMarkdownFile,
  closeMarkdownViewer,
  updateLastUpdated,
  savePageScrollPosition
} from './store/appSlice';
import './App.css';

const { Content } = Layout;

// 主应用组件（包装在ThemeProvider内部）
function AppContent() {
  const { isDarkMode, theme: currentTheme } = useTheme();
  const dispatch = useAppDispatch();

  // 从Redux store获取状态
  const {
    fileStats,
    allFileStats,
    totalChars,
    loading,
    sortBy,
    selectedFile,
    fileSummaries,
    folderSummaries,
    currentView,
    currentFolder,
    pageScrollPosition
  } = useAppSelector(state => state.app);

  // 实时跟踪当前滚动位置
  const [currentScrollPos, setCurrentScrollPos] = useState(0);

  // Ant Design主题配置
  const antdThemeConfig = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: currentTheme.accent.primary,
      borderRadius: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
      colorBgContainer: currentTheme.background.card,
      colorText: currentTheme.text.primary,
      colorBorder: currentTheme.border.primary,
    },
  };

  // 加载文件统计数据
  const loadStats = async () => {
    try {
      dispatch(setLoading(true));

      // 加载文件夹摘要信息
      const folderSums = await loadFolderSummaries();
      dispatch(setFolderSummaries(folderSums));

      // 加载文件概要信息
      const summaries = await loadFileSummaries();
      dispatch(setFileSummaries(summaries));

      // 加载文件统计
      const { fileStats: stats, totalChars: total } = await loadFileStats(summaries);
      dispatch(setAllFileStats(stats));
      dispatch(setFileStats(stats));
      dispatch(setTotalChars(total));

      // 更新最后更新时间
      dispatch(updateLastUpdated());
    } catch (error) {
      console.error('加载文件统计失败:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 应用排序
  const handleApplySorting = (newSortBy) => {
    dispatch(applySorting(newSortBy));
  };

  // 打开Markdown文件
  const handleOpenMarkdownFile = (fileName) => {
    dispatch(openMarkdownFile(fileName));
  };

  // 关闭Markdown查看器
  const handleCloseMarkdownViewer = () => {
    dispatch(closeMarkdownViewer());
  };

  // 打开文件夹
  const handleOpenFolder = (folderName) => {
    dispatch(openFolder(folderName));
  };

  // 返回文件夹列表
  const handleBackToFolders = () => {
    dispatch(backToFolders());
  };

  // 初始化加载
  useEffect(() => {
    loadStats();
  }, []);

  // 恢复页面滚动位置相关状态
  const [hasRestoredScroll, setHasRestoredScroll] = useState(false);
  const [previousLoading, setPreviousLoading] = useState(false); // 初始为false，这样页面刷新时能检测到loading从true变为false
  const [isRestoring, setIsRestoring] = useState(false);

  // 页面滚动事件处理
  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // 实时更新当前滚动位置
      setCurrentScrollPos(scrollTop);

      // 只在loading为false且不在恢复过程中时才保存滚动位置
      if (!loading && !isRestoring) {
        // 防抖保存滚动位置
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          dispatch(savePageScrollPosition(scrollTop));
        }, 300);
      }
    };

    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch, loading, isRestoring]);

  // 恢复页面滚动位置 - 只在loading从true变为false时执行一次

  useEffect(() => {
    // 当loading从true变为false时恢复滚动位置
    if (!loading && pageScrollPosition > 0 && !hasRestoredScroll) {
      // 设置恢复状态，阻止滚动事件保存位置
      setIsRestoring(true);

      // 延迟恢复滚动位置，确保页面内容已渲染
      const timer = setTimeout(() => {
        // 使用立即滚动，不使用smooth动画
        window.scrollTo(0, pageScrollPosition);

        // 延迟验证并解除恢复状态，确保不与滚动事件防抖冲突
         setTimeout(() => {
           setHasRestoredScroll(true);
           setIsRestoring(false);
         }, 500); // 延长时间，避免与滚动事件防抖(300ms)冲突
      }, 300); // 增加延迟确保页面完全渲染

      return () => {
        clearTimeout(timer);
        setIsRestoring(false);
      };
    }

    // 更新previousLoading状态
    setPreviousLoading(loading);
  }, [loading, pageScrollPosition, hasRestoredScroll, previousLoading]);

  return (
    <ConfigProvider theme={antdThemeConfig}>
      <Layout
        className="app-layout"
        style={{
          minHeight: '100vh',
          background: currentTheme.background.primary,
          transition: 'background 0.3s ease'
        }}
      >
        {selectedFile ? (
          <MarkdownViewer
            fileName={selectedFile.name}
            onBack={handleCloseMarkdownViewer}
            currentFolder={currentFolder}
          />
        ) : (
          <>
            <Header />
            <Content
              style={{
                padding: '24px',
                background: currentTheme.background.primary
              }}
            >
              {/* 调试信息显示 - 保留代码的原因是方便下次调试页面信息使用 */}
              {/*
              <div style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 9999
              }}>
                <div>当前滚动位置: {Math.round(currentScrollPos)}</div>
                <div>Redux中保存的位置: {pageScrollPosition}</div>
                <div>Loading状态: {loading ? 'true' : 'false'}</div>
                <div>恢复状态: {isRestoring ? 'true' : 'false'}</div>
              </div>
              */}
              <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
                <StatsGrid
                  fileStats={fileStats}
                  totalChars={totalChars}
                  loading={loading}
                  currentView={currentView}
                  currentFolder={currentFolder}
                  folderSummaries={folderSummaries}
                  allFileStats={allFileStats}
                />
                {currentView === 'folders' ? (
                  <FoldersList
                    folderSummaries={folderSummaries}
                    allFileStats={allFileStats}
                    loading={loading}
                    onFolderClick={handleOpenFolder}
                  />
                ) : (
                  <FilesList
                    fileStats={fileStats}
                    loading={loading}
                    sortBy={sortBy}
                    onSortChange={handleApplySorting}
                    onFileClick={handleOpenMarkdownFile}
                    onBackToFolders={handleBackToFolders}
                    currentFolder={currentFolder}
                    folderSummaries={folderSummaries}
                  />
                )}
              </div>
            </Content>
          </>
        )}
        {/* 返回顶部悬浮按钮 */}
        <FloatButton.BackTop
          tooltip="返回顶部"
          visibilityHeight={10}
        />
      </Layout>
    </ConfigProvider>
  );
}

// 主应用组件（包装Redux Provider和ThemeProvider）
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
