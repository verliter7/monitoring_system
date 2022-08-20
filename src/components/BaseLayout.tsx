/* @jsxImportSource @emotion/react */
import { useState, createElement } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Popover } from 'antd';
import { meunConfig } from '@/router/routerConfig';
import HomePageRouters from '@/router/HomePageRouters';
import { commonStyles, HandleLocalStorage } from '@/utils';
import type { FC, ReactElement } from 'react';

const { Header, Sider, Content } = Layout;

const BaseLayout: FC = (): ReactElement => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { username, aid } = HandleLocalStorage.get('userInfo');

  return (
    <Layout
      css={{
        height: '100%',
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed} css={{ backgroundColor: '#ffffff' }}>
        <Menu theme="light" mode="inline" selectedKeys={[pathname]} items={meunConfig} />
      </Sider>
      <Layout className="site-layout">
        <Header
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            padding: '0px',
            height: '48px',
            backgroundColor: '#ffffff',

            '& > .trigger': {
              padding: '0 12px',
              fontSize: '18px',
              lineHeight: '48px',
              cursor: 'pointer',
              transition: 'color 0.3s',
            },
          }}
        >
          {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <Popover
            content={
              <>
                <span>用户名: {username}</span>
                <br />
                <span>应用id: {aid}</span>
              </>
            }
            title="账户信息"
            placement="bottomRight"
          >
            <Avatar icon={<UserOutlined />} css={{ marginRight: '20px' }} />
          </Popover>
        </Header>
        <Content
          css={{
            ...commonStyles.scroll('Y'),
            overflowX: 'hidden',
            margin: '16px',
            marginRight: '0',
            padding: '16px',
            paddingRight: '0px',
            minHeight: '280px',
          }}
        >
          <HomePageRouters />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
