/* @jsxImportSource @emotion/react */
import { useState, createElement } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Descriptions, Layout, Menu, Modal, notification, Popconfirm } from 'antd';
import { meunConfig } from '@/router/routerConfig';
import HomePageRouters from '@/router/HomePageRouters';
import { useMount } from '@/hooks';
import { commonStyles, HandleLocalStorage } from '@/utils';
import { notLoginPagePath, userInfoKey } from '@/utils/constant';
import type { FC, ReactElement } from 'react';

const { Header, Sider, Content } = Layout;

const BaseLayout: FC = (): ReactElement => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { username, aid } = HandleLocalStorage.get('userInfo');

  const handleAvatarClick = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const logout = () => {
    HandleLocalStorage.remove([userInfoKey]);
    window.location.replace(notLoginPagePath);
  };

  useMount(() => {
    notification.info({
      message: '点击右上角头像查看用户信息',
      placement: 'top',
      duration: 6,
    });
  });

  return (
    <Layout
      css={{
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed} css={{ backgroundColor: '#ffffff' }}>
        <Menu theme="light" mode="inline" selectedKeys={[pathname]} items={meunConfig} />
      </Sider>
      <Layout className="site-layout">
        <Modal
          title="用户信息"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          maskClosable
          wrapClassName="user-modal-wrapper"
        >
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="用户名">{username}</Descriptions.Item>
            <Descriptions.Item label="应用id">{aid}</Descriptions.Item>
          </Descriptions>
        </Modal>
        <Header
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            padding: '0px',
            height: '48px',
            lineHeight: '48px',
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
          <div css={{ display: 'flex', alignItems: 'center', gap: '20px', paddingRight: '20px' }}>
            <Popconfirm
              placement="bottomRight"
              title="确定退出登录吗?"
              onConfirm={logout}
              okText="确定"
              cancelText="取消"
            >
              <Button>退出登录</Button>
            </Popconfirm>
            <span css={{ lineHeight: '28px', cursor: 'pointer' }} onClick={handleAvatarClick}>
              <Avatar icon={<UserOutlined />} />
            </span>
          </div>
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
