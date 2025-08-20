import { useDispatch, useSelector } from 'react-redux';

// 导出类型化的hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// 常用的selector hooks
export const useFileStats = () => useAppSelector(state => state.app.fileStats);
export const useAllFileStats = () => useAppSelector(state => state.app.allFileStats);
export const useTotalChars = () => useAppSelector(state => state.app.totalChars);
export const useLoading = () => useAppSelector(state => state.app.loading);
export const useSortBy = () => useAppSelector(state => state.app.sortBy);
export const useFileSummaries = () => useAppSelector(state => state.app.fileSummaries);
export const useFolderSummaries = () => useAppSelector(state => state.app.folderSummaries);
export const useCurrentView = () => useAppSelector(state => state.app.currentView);
export const useCurrentFolder = () => useAppSelector(state => state.app.currentFolder);
export const useSelectedFile = () => useAppSelector(state => state.app.selectedFile);
export const useReadingPositions = () => useAppSelector(state => state.app.readingPositions);
export const useSidebarCollapsed = () => useAppSelector(state => state.app.sidebarCollapsed);
export const useLastUpdated = () => useAppSelector(state => state.app.lastUpdated);

// 获取特定文件的阅读位置
export const useReadingPosition = (fileKey) => useAppSelector(state => 
  state.app.readingPositions?.[fileKey] || null
);

// 组合selector
export const useAppState = () => useAppSelector(state => state.app);