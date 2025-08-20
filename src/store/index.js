import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 使用localStorage
import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';

// 根级别的Redux Persist配置
const persistConfig = {
  key: 'react-md-stats',
  storage
};

// app slice的持久化配置
const appPersistConfig = {
  key: 'app',
  storage,
  // 指定需要持久化的状态字段
  whitelist: [
    'currentView',
    'currentFolder', 
    'sortBy',
    'sidebarCollapsed',
    'lastUpdated',
    'fileStats',
    'allFileStats',
    'totalChars',
    'fileSummaries',
    'folderSummaries',
    'readingPositions',
    'fileListScrollPositions',
    'pageScrollPosition'
  ],
  // 排除不需要持久化的字段
  blacklist: [
    'loading',
    'selectedFile' // 不持久化当前选中的文件，避免刷新后直接打开文件
  ]
};

// 创建持久化的app reducer
const persistedAppReducer = persistReducer(appPersistConfig, appReducer);

// 合并所有reducer
const rootReducer = combineReducers({
  app: persistedAppReducer
});

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略Redux Persist的action类型
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER'
        ]
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

// 创建persistor
export const persistor = persistStore(store);

// 导出类型定义（用于TypeScript，这里是JavaScript所以注释掉）
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;