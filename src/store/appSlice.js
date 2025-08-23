import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 文件统计相关状态
  fileStats: [],
  allFileStats: [],
  totalChars: 0,
  loading: true,
  sortBy: 'number-asc',
  
  // 文件和文件夹摘要
  fileSummaries: {},
  folderSummaries: {},
  
  // 视图状态
  currentView: 'folders', // 'folders' or 'files'
  currentFolder: null,
  selectedFile: null,
  
  // 阅读位置状态
  readingPositions: {}, // 存储每个文件的阅读位置 { 'folder/filename': { scrollTop: number, timestamp: number } }
  
  // 文件列表滚动位置状态
  fileListScrollPositions: {}, // 存储每个文件夹的文件列表滚动位置 { 'folder': { scrollTop: number, timestamp: number } }
  
  // 页面滚动位置状态
  pageScrollPosition: 0, // 存储页面的滚动位置
  
  // UI状态
  sidebarCollapsed: false,
  lastUpdated: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // 设置文件统计数据
    setFileStats: (state, action) => {
      // 如果当前在文件夹视图中，需要保持过滤状态
      if (state.currentView === 'files' && state.currentFolder) {
        // 不直接设置fileStats，而是更新allFileStats然后重新过滤
        state.allFileStats = action.payload;
        const folderFiles = action.payload.filter(file => file.folder === state.currentFolder);
        state.fileStats = folderFiles;
        state.totalChars = folderFiles.reduce((total, file) => total + file.charCount, 0);
      } else {
        state.fileStats = action.payload;
      }
    },
    
    setAllFileStats: (state, action) => {
      state.allFileStats = action.payload;
    },
    
    setTotalChars: (state, action) => {
      state.totalChars = action.payload;
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    // 设置摘要数据
    setFileSummaries: (state, action) => {
      state.fileSummaries = action.payload;
    },
    
    setFolderSummaries: (state, action) => {
      state.folderSummaries = action.payload;
    },
    
    // 视图控制
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    
    // 打开文件夹
    openFolder: (state, action) => {
      const folderName = action.payload;
      state.currentFolder = folderName;
      state.currentView = 'files';
      
      // 过滤当前文件夹的文件
      const folderFiles = state.allFileStats.filter(file => file.folder === folderName);
      state.fileStats = folderFiles;
      
      // 计算当前文件夹的总字符数
      state.totalChars = folderFiles.reduce((total, file) => total + file.charCount, 0);
    },
    
    // 返回文件夹列表
    backToFolders: (state) => {
      state.currentView = 'folders';
      state.currentFolder = null;
      state.fileStats = state.allFileStats;
      
      // 恢复所有文件的总字符数
      state.totalChars = state.allFileStats.reduce((total, file) => total + file.charCount, 0);
    },
    
    // 打开Markdown文件
    openMarkdownFile: (state, action) => {
      const fileName = action.payload;
      const file = state.fileStats.find(f => f.name === fileName);
      if (file) {
        state.selectedFile = file;
      }
    },
    
    // 关闭Markdown查看器
    closeMarkdownViewer: (state) => {
      state.selectedFile = null;
    },
    
    // 应用排序
    applySorting: (state, action) => {
      const newSortBy = action.payload;
      state.sortBy = newSortBy;
      
      const [sortField, sortOrder] = newSortBy.split('-');
      let sortedStats = [...state.fileStats];
      
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
      
      state.fileStats = sortedStats;
    },
    
    // UI状态控制
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    // 阅读位置管理
    saveReadingPosition: (state, action) => {
      const { fileKey, scrollTop } = action.payload;
      if (!state.readingPositions) {
        state.readingPositions = {};
      }
      state.readingPositions[fileKey] = {
        scrollTop,
        timestamp: new Date().toISOString()
      };
    },
    
    getReadingPosition: (state, action) => {
      const { fileKey } = action.payload;
      return state.readingPositions[fileKey] || null;
    },
    
    clearReadingPosition: (state, action) => {
      const { fileKey } = action.payload;
      if (state.readingPositions && state.readingPositions[fileKey]) {
        delete state.readingPositions[fileKey];
      }
    },
    
    // 文件列表滚动位置管理
    saveFileListScrollPosition: (state, action) => {
      const { folderKey, scrollTop } = action.payload;
      if (!state.fileListScrollPositions) {
        state.fileListScrollPositions = {};
      }
      state.fileListScrollPositions[folderKey] = {
        scrollTop,
        timestamp: new Date().toISOString()
      };
    },
    
    getFileListScrollPosition: (state, action) => {
      const { folderKey } = action.payload;
      return state.fileListScrollPositions[folderKey] || null;
    },
    
    clearFileListScrollPosition: (state, action) => {
      const { folderKey } = action.payload;
      if (state.fileListScrollPositions && state.fileListScrollPositions[folderKey]) {
        delete state.fileListScrollPositions[folderKey];
      }
    },
    
    // 保存页面滚动位置
    savePageScrollPosition: (state, action) => {
      state.pageScrollPosition = action.payload;
    },
    
    // 获取页面滚动位置
    getPageScrollPosition: (state) => {
      return state.pageScrollPosition;
    },
    
    // 更新最后更新时间
    updateLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
    
    // 翻页相关actions
    navigateToNextFile: (state) => {
      if (!state.selectedFile) return;
      
      const currentFiles = state.currentFolder 
        ? state.allFileStats.filter(file => file.folder === state.currentFolder)
        : state.allFileStats;
      
      const currentIndex = currentFiles.findIndex(file => file.name === state.selectedFile.name);
      if (currentIndex !== -1 && currentIndex < currentFiles.length - 1) {
        state.selectedFile = currentFiles[currentIndex + 1];
      }
    },

    navigateToPrevFile: (state) => {
      if (!state.selectedFile) return;
      
      const currentFiles = state.currentFolder 
        ? state.allFileStats.filter(file => file.folder === state.currentFolder)
        : state.allFileStats;
      
      const currentIndex = currentFiles.findIndex(file => file.name === state.selectedFile.name);
      if (currentIndex > 0) {
        state.selectedFile = currentFiles[currentIndex - 1];
      }
    },
    
    // 重置所有状态
    resetState: () => initialState
  }
});

export const {
  setFileStats,
  setAllFileStats,
  setTotalChars,
  setLoading,
  setSortBy,
  setFileSummaries,
  setFolderSummaries,
  setCurrentView,
  setCurrentFolder,
  setSelectedFile,
  openFolder,
  backToFolders,
  openMarkdownFile,
  closeMarkdownViewer,
  applySorting,
  saveReadingPosition,
  getReadingPosition,
  clearReadingPosition,
  saveFileListScrollPosition,
  getFileListScrollPosition,
  clearFileListScrollPosition,
  savePageScrollPosition,
  getPageScrollPosition,
  setSidebarCollapsed,
  updateLastUpdated,
  navigateToNextFile,
  navigateToPrevFile,
  resetState
} = appSlice.actions;

export default appSlice.reducer;