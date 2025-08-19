import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { MoonFilled, SunOutlined, FileTextOutlined } from '@ant-design/icons';
import { useTheme } from '../theme';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  return (
    <AntHeader
      style={{
        background: theme.background.card,
        boxShadow: theme.shadow.md,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        borderBottom: `1px solid ${theme.border.primary}`
      }}
    >
      <Space align="center">
        <FileTextOutlined
          style={{
            fontSize: '24px',
            color: theme.accent.primary
          }}
        />
        <Title
          level={3}
          style={{
            margin: 0,
              marginLeft: 20,
            color: theme.text.primary,
            fontWeight: 600
          }}
        >
            喵咕 の Markdown笔记
        </Title>
      </Space>

      <div className="theme-toggle">
        <Button
          type="text"
          icon={isDarkMode ? <MoonFilled /> : <SunOutlined />}
          onClick={toggleTheme}
          title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}
          className="theme-toggle-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            border: 'none',
            background: 'transparent'
          }}
        />
      </div>
    </AntHeader>
  );
};

export default Header;
