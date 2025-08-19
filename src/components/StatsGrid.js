import React from 'react';
import { Row, Col, Card, Statistic, Skeleton } from 'antd';
import { FileTextOutlined, NumberOutlined, CalendarOutlined } from '@ant-design/icons';
import { statsCardTheme } from '../theme';

const StatsGrid = ({ fileStats, totalChars, loading }) => {
  // 计算统计数据
  const totalFiles = fileStats.length;
  const avgCharsPerFile = totalFiles > 0 ? Math.round(totalChars / totalFiles) : 0;

  // 获取最新修改时间
  const latestModifyTime = fileStats.length > 0
    ? fileStats.reduce((latest, file) => {
      const fileTime = new Date(file.modifyTime);
      return fileTime > latest ? fileTime : latest;
    }, new Date(0))
    : new Date();

  const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const statsData = [
    {
      title: '文件总数',
      value: totalFiles,
      icon: <FileTextOutlined style={{ color: statsCardTheme.iconColors[0] }} />,
      gradient: statsCardTheme.gradients[0]
    },
    {
      title: '总字符数',
      value: totalChars,
      icon: <NumberOutlined style={{ color: statsCardTheme.iconColors[1] }} />,
      gradient: statsCardTheme.gradients[1]
    },
    {
      title: '平均字符数',
      value: avgCharsPerFile,
      icon: <NumberOutlined style={{ color: statsCardTheme.iconColors[2] }} />,
      gradient: statsCardTheme.gradients[2]
    },
    {
      title: '最新修改',
      value: formatDate(latestModifyTime),
      icon: <CalendarOutlined style={{ color: statsCardTheme.iconColors[3] }} />,
      gradient: statsCardTheme.gradients[3],
    }
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <Row gutter={[8, 8]} className="stats-grid">
        {statsData.map((stat, index) => (
          <Col xs={12} sm={12} md={8} lg={6} key={index}>
            <Card
              style={{
                background: stat.gradient,
                border: 'none',
                borderRadius: '12px',
                boxShadow: statsCardTheme.shadow,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="stats-card"
              styles={{ body: { padding: '24px' } }}
              hoverable
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '12px', fontSize: '24px' }}>
                    {stat.icon}
                  </div>
                  <Statistic
                    title={
                      <span style={{ color: statsCardTheme.titleColor, fontSize: '14px' }}>
                        {stat.title}
                      </span>
                    }
                    value={stat.value}
                    valueStyle={{
                      color: statsCardTheme.textColor,
                      fontSize: stat.valueStyle?.fontSize || '24px',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      ...stat.valueStyle
                    }}
                  />
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StatsGrid;