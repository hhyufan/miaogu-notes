import React from 'react';
import { Card, Row, Col, Typography, Badge } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { useTheme } from '../theme';

const { Title, Text } = Typography;

const FoldersList = ({ folderSummaries, allFileStats, loading, onFolderClick }) => {
  const { theme: currentTheme } = useTheme();

  // 计算每个文件夹的文件数量
  const getFolderStats = (folderName) => {
    const folderFiles = allFileStats.filter(file => file.folder === folderName);
    return {
      fileCount: folderFiles.length,
      totalChars: folderFiles.reduce((total, file) => total + file.charCount, 0)
    };
  };

  const folders = Object.keys(folderSummaries).map(folderName => {
    const folderInfo = folderSummaries[folderName];
    const stats = getFolderStats(folderName);
    return {
      name: folderName,
      ...folderInfo,
      ...stats
    };
  }).sort((a, b) => (a.order || 999) - (b.order || 999));

  return (
    <div style={{ marginTop: '24px' }}>
      <Title level={3} style={{ color: currentTheme.text.primary, marginBottom: '24px' }}>
        教程目录
      </Title>
      <Row gutter={[16, 16]}>
        {folders.map((folder, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={folder.name}>
            <Card
              hoverable
              loading={loading}
              onClick={() => onFolderClick(folder.name)}
              style={{
                borderRadius: '12px',
                border: `1px solid ${currentTheme.border.primary}`,
                background: currentTheme.background.card,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              styles={{
                body: { padding: '20px' }
              }}
            >
              <div style={{ textAlign: 'center' }}>
                {/* 文件夹图标 */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: folder.color || '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {folder.icon || 'F'}
                </div>

                {/* 文件夹标题 */}
                <Title
                  level={4}
                  style={{
                    color: currentTheme.text.primary,
                    marginBottom: '8px',
                    fontSize: '16px'
                  }}
                >
                  {folder.title || folder.name}
                </Title>

                {/* 文件夹描述 */}
                <Text
                  style={{
                    color: currentTheme.text.secondary,
                    fontSize: '12px',
                    display: 'block',
                    marginBottom: '12px',
                    lineHeight: '1.4'
                  }}
                >
                  {folder.description || '暂无描述'}
                </Text>

                {/* 统计信息 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge
                    count={folder.fileCount}
                    style={{ backgroundColor: folder.color || '#1890ff' }}
                    showZero
                  />
                  <Text
                    style={{
                      color: currentTheme.text.tertiary,
                      fontSize: '11px'
                    }}
                  >
                    {Math.round(folder.totalChars / 1000)}K 字符
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FoldersList;