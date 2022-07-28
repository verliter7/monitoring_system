/* @jsxImportSource @emotion/react */
import { useState, createElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import meunConfig from '@/router/meunConfig';
import HomePageRouters from '@/router/HomePageRouters';
import IconFont from '@/components/Iconfont';
import { commonStyles } from '@/utils';
import type { FC, ReactElement } from 'react';

const { Header, Sider, Content } = Layout;

const BaseLayout: FC = (): ReactElement => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <Layout
      css={{
        height: '100%',
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed} css={{ backgroundColor: '#fff' }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={meunConfig.map(({ pathname, icon, label }) => ({
            key: pathname,
            icon: <IconFont type={icon} />,
            label: <Link to={pathname}>{label}</Link>,
          }))}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          css={{
            padding: '0px',
            height: '48px',
            lineHeight: '48px',
            backgroundColor: '#fff',
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
        </Header>
        <Content
          css={{
            ...commonStyles.scroll(),
            margin: '16px',
            padding: '16px',
            minHeight: '280px',
            background: '#fff',
          }}
        >
          <HomePageRouters />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
