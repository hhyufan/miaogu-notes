import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import FilesList from './components/FilesList';
import MarkdownViewer from './components/MarkdownViewer';
import { loadFileStats, loadFileSummaries } from './utils/fileUtils';
import { ThemeProvider, useTheme } from './theme';
import './App.css';

const { Content } = Layout;

// 主应用组件（包装在ThemeProvider内部）
function AppContent() {
  const { isDarkMode, theme: currentTheme } = useTheme();
  const [fileStats, setFileStats] = useState([]);
  const [totalChars, setTotalChars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('number-asc');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSummaries, setFileSummaries] = useState({});

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
      setLoading(true);

      // 加载文件概要信息
      const summaries = await loadFileSummaries();
      setFileSummaries(summaries);

      // 加载文件统计
      const { fileStats: stats, totalChars: total } = await loadFileStats(summaries);
      setFileStats(stats);
      setTotalChars(total);
    } catch (error) {
      console.error('加载文件统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 应用排序
  const applySorting = (newSortBy) => {
    setSortBy(newSortBy);
    const [sortField, sortOrder] = newSortBy.split('-');

    let sortedStats = [...fileStats];

    switch (sortField) {
      case 'modifyTime':
        sortedStats.sort((a, b) => {
          const timeA = new Date(a.modifyTime).getTime();
          const timeB = new Date(b.modifyTime).getTime();
          return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
        });
        break;
      case 'number':
        sortedStats.sort((a, b) => {
          return sortOrder === 'desc' ? b.fileNumber - a.fileNumber : a.fileNumber - b.fileNumber;
        });
        break;
      default:
        break;
    }

    setFileStats(sortedStats);
  };

  // 打开Markdown文件
  const openMarkdownFile = (fileName) => {
    const file = fileStats.find(f => f.name === fileName);
    if (file) {
      setSelectedFile(file);
    }
  };

  // 关闭Markdown查看器
  const closeMarkdownViewer = () => {
    setSelectedFile(null);
  };

  // 初始化加载
  useEffect(() => {
    loadStats();
  }, []);

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
            onBack={closeMarkdownViewer}
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
              <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
                <StatsGrid
                  fileStats={fileStats}
                  totalChars={totalChars}
                  loading={loading}
                />
                <FilesList
                  fileStats={fileStats}
                  loading={loading}
                  sortBy={sortBy}
                  onSortChange={applySorting}
                  onFileClick={openMarkdownFile}
                />
              </div>
            </Content>
          </>
        )}
      </Layout>
    </ConfigProvider>
  );
}

// 主应用组件（包装ThemeProvider）
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;