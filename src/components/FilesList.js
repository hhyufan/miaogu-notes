import React, { useRef, useEffect, useCallback } from 'react';
import { Card, List, Select, Space, Typography, Tag, Button, Skeleton } from 'antd';
import { FileTextOutlined, CalendarOutlined, NumberOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { formatDisplayName, getFileExtension, formatFileSize, formatDate } from '../utils/formatUtils';
import { useTheme } from '../theme';
import { useSelector, useDispatch } from 'react-redux';
import { saveFileListScrollPosition } from '../store/appSlice';

const { Title, Text } = Typography;
const { Option } = Select;

const FilesList = ({ fileStats, loading, sortBy, onSortChange, onFileClick, onBackToFolders, currentFolder, folderSummaries }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const fileListScrollPositions = useSelector(state => state.app.fileListScrollPositions);
  
  // 滚动相关的refs
  const listContainerRef = useRef(null);
  const isRestoringRef = useRef(false);
  const hasRestoredRef = useRef(false);
  
  // 防抖处理滚动事件
  const handleScroll = useCallback(() => {
    if (isRestoringRef.current) {
      return; // 在恢复滚动位置时跳过保存
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const folderKey = currentFolder || 'root';
    
    // 防抖保存滚动位置
    clearTimeout(handleScroll.timeoutId);
    handleScroll.timeoutId = setTimeout(() => {
      dispatch(saveFileListScrollPosition({ folderKey, scrollTop }));
    }, 300);
  }, [dispatch, currentFolder]);
  
  // 恢复滚动位置
  const restoreScrollPosition = useCallback(() => {
    if (!listContainerRef.current || loading || hasRestoredRef.current) {
      return;
    }
    
    const folderKey = currentFolder || 'root';
    const savedPosition = fileListScrollPositions[folderKey];
    
    if (savedPosition && savedPosition.scrollTop > 0) {
      isRestoringRef.current = true;
      
      // 使用requestAnimationFrame确保DOM已更新
      requestAnimationFrame(() => {
        setTimeout(() => {
          const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
          
          if (maxScrollTop > 0) {
            // 直接设置scrollTop，避免触发滚动事件
            window.scrollTo(0, Math.min(savedPosition.scrollTop, maxScrollTop));
            hasRestoredRef.current = true;
          }
          
          // 重置恢复标志
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 100);
        }, 100);
      });
    }
  }, [fileListScrollPositions, currentFolder, loading]);
  
  // 在文件夹切换时重置恢复标志
  useEffect(() => {
    hasRestoredRef.current = false;
  }, [currentFolder]);
  
  // 添加window滚动事件监听
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (handleScroll.timeoutId) {
        clearTimeout(handleScroll.timeoutId);
      }
    };
  }, [handleScroll]);
  
  // 禁用FilesList的滚动恢复，使用App.js的页面级滚动恢复
  // useEffect(() => {
  //   if (!loading && fileStats.length > 0 && !hasRestoredRef.current) {
  //     const timer = setTimeout(() => {
  //       restoreScrollPosition();
  //     }, 300);
  //     
  //     return () => clearTimeout(timer);
  //   }
  // }, [loading, fileStats.length, restoreScrollPosition]);
  const getFileTypeColor = (fileName) => {
    const ext = getFileExtension(fileName);
    const colorMap = {
      'md': 'blue',
      'txt': 'green',
      'doc': 'orange',
      'docx': 'orange',
      'pdf': 'red'
    };
    return colorMap[ext] || 'default';
  };

  const sortOptions = [
    { value: 'number-asc', label: '文件编号 (升序)' },
    { value: 'number-desc', label: '文件编号 (降序)' },
    { value: 'modifyTime-desc', label: '修改时间 (最新)' },
    { value: 'modifyTime-asc', label: '修改时间 (最旧)' }
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {currentFolder && (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={onBackToFolders}
                style={{ color: theme.accent.primary }}
              >
              </Button>
            )}
            <FileTextOutlined style={{ color: theme.accent.primary }} />
            <Title level={4} style={{ margin: 0, color: theme.text.primary }}>
              {currentFolder ? (
                folderSummaries && typeof folderSummaries === 'object' && folderSummaries[currentFolder] && folderSummaries[currentFolder].title
                  ? folderSummaries[currentFolder].title
                  : currentFolder
              ) : '文件列表'}
            </Title>
            <Tag color="blue">{fileStats.length} 个文件</Tag>
          </Space>
          <Select
            value={sortBy}
            onChange={onSortChange}
            style={{ width: 200 }}
            placeholder="选择排序方式"
          >
            {sortOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      }
      style={{
        borderRadius: '12px',
        boxShadow: theme.shadow.md,
        background: theme.background.card,
        border: `1px solid ${theme.border.primary}`
      }}
    >
      {loading ? (
        <div>
          {[...Array(5)].map((_, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={listContainerRef}
        >
          <List
            dataSource={fileStats}
            renderItem={(file) => (
            <List.Item
              style={{
                padding: '16px',
                marginBottom: '8px',
                border: `1px solid ${theme.border.secondary}`,
                borderRadius: '8px',
                background: theme.background.secondary,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              className="file-list-item"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.background.tertiary;
                e.currentTarget.style.borderColor = theme.border.accent;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.shadow.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.background.secondary;
                e.currentTarget.style.borderColor = theme.border.secondary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              actions={[
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileClick(file.name);
                  }}
                  size="small"
                >
                  查看
                </Button>
              ]}
              onClick={() => onFileClick(file.name)}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${theme.accent.primary}, ${theme.accent.secondary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    {file.fileNumber}
                  </div>
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong style={{ fontSize: '16px', color: theme.text.primary }}>
                      {formatDisplayName(file.name)}
                    </Text>
                    <Tag color={getFileTypeColor(file.name)}>
                      {getFileExtension(file.name).toUpperCase()}
                    </Tag>
                  </div>
                }
                description={
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Space>
                      <CalendarOutlined style={{ color: theme.text.muted }} />
                      <Text style={{ color: theme.text.secondary }}>
                        修改时间: {formatDate(file.modifyTime)}
                      </Text>
                    </Space>
                    <Space>
                      <NumberOutlined style={{ color: theme.text.muted }} />
                      <Text style={{ color: theme.text.secondary }}>
                        文件大小: {formatFileSize(file.charCount)}
                      </Text>
                    </Space>
                    {file.summary && (
                      <Text
                        style={{
                          fontSize: '12px',
                          display: 'block',
                          marginTop: '4px',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: theme.text.secondary
                        }}
                      >
                        摘要: {file.summary}
                      </Text>
                    )}
                    {file.keywords && file.keywords.length > 0 && (
                      <div style={{ marginTop: '6px' }}>
                        <Text style={{ fontSize: '11px', marginRight: '6px', color: theme.text.secondary }}>关键词:</Text>
                        {file.keywords.slice(0, 4).map((keyword, index) => (
                          <Tag
                            key={index}
                            size="small"
                            color="geekblue"
                            style={{
                              fontSize: '10px',
                              marginBottom: '2px',
                              borderRadius: '4px'
                            }}
                          >
                            {keyword}
                          </Tag>
                        ))}
                        {file.keywords.length > 4 && (
                          <Tag size="small" color="default" style={{ fontSize: '10px' }}>
                            +{file.keywords.length - 4}
                          </Tag>
                        )}
                      </div>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
            locale={{
              emptyText: '暂无文件数据'
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default FilesList;
