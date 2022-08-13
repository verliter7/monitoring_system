/* @jsxImportSource @emotion/react */
import { useState, createElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Popconfirm } from 'antd';
import meunConfig from '@/router/meunConfig';
import HomePageRouters from '@/router/HomePageRouters';
import IconFont from '@/components/Iconfont';
import { Eventemit, commonStyles } from '@/utils';
import { useAppSelector } from '@/redux/hooks';
import type { FC, ReactElement } from 'react';

const { Header, Sider, Content } = Layout;

const BaseLayout: FC = (): ReactElement => {
  const reduxState = useAppSelector((state) => state);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <Layout
      css={{
        height: '100%',
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed} css={{ backgroundColor: '#ffffff' }}>
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
            display: 'flex',
            alignItems: 'center',
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
          <Popconfirm
            placement="bottom"
            title="确认重载该页面的数据吗？"
            onConfirm={() => {
              Eventemit.dispatchEvent('HttpMonitor', { allListItemInfo: reduxState.httpMonitor });
            }}
            okText="确认"
            cancelText="取消"
            disabled={!reduxState.httpMonitor.successRate || true}
          >
            <Button type="default">reload</Button>
          </Popconfirm>
        </Header>
        <Content
          css={{
            ...commonStyles.scroll('Y'),
            overflowX: 'hidden',
            margin: '16px',
            padding: '16px',
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
