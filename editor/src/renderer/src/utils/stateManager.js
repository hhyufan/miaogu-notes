// 状态持久化管理工具
// 使用electron-store进行状态的保存和恢复

class StateManager {
  constructor() {
    this.isElectron = window.api && window.api.storeGet;
  }

  // 保存状态到electron-store
  async saveState(key, value) {
    if (!this.isElectron) {
      console.warn('Not in Electron environment, state will not be persisted');
      return false;
    }

    try {
      await window.api.storeSet(key, value);
      return true;
    } catch (error) {
      console.error('Failed to save state:', error);
      return false;
    }
  }

  // 从electron-store恢复状态
  async loadState(key, defaultValue = null) {
    if (!this.isElectron) {
      console.warn('Not in Electron environment, returning default value');
      return defaultValue;
    }

    try {
      const value = await window.api.storeGet(key);
      return value !== undefined ? value : defaultValue;
    } catch (error) {
      console.error('Failed to load state:', error);
      return defaultValue;
    }
  }

  // 删除指定状态
  async deleteState(key) {
    if (!this.isElectron) {
      console.warn('Not in Electron environment');
      return false;
    }

    try {
      await window.api.storeDelete(key);
      return true;
    } catch (error) {
      console.error('Failed to delete state:', error);
      return false;
    }
  }

  // 清空所有状态
  async clearAllStates() {
    if (!this.isElectron) {
      console.warn('Not in Electron environment');
      return false;
    }

    try {
      await window.api.storeClear();
      return true;
    } catch (error) {
      console.error('Failed to clear all states:', error);
      return false;
    }
  }

  // 获取所有状态
  async getAllStates() {
    if (!this.isElectron) {
      console.warn('Not in Electron environment');
      return {};
    }

    try {
      return await window.api.storeGetAll();
    } catch (error) {
      console.error('Failed to get all states:', error);
      return {};
    }
  }

  // 保存编辑器完整状态
  async saveEditorState(editorState) {
    const stateToSave = {
      currentFile: editorState.currentFile,
      treeData: editorState.treeData,
      expandedSections: editorState.expandedSections,
      isModified: editorState.isModified,
      lastSaved: Date.now()
    };

    return await this.saveState('editorState', stateToSave);
  }

  // 恢复编辑器完整状态
  async loadEditorState() {
    const defaultState = {
      currentFile: null,
      treeData: [],
      expandedSections: [],
      isModified: false
    };

    return await this.loadState('editorState', defaultState);
  }
}

// 创建单例实例
const stateManager = new StateManager();

export default stateManager;