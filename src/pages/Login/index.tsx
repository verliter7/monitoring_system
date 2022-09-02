/* @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Tabs } from 'antd';
import { login, register } from './service';
import { useRequest } from '@/hooks';
import { HandleLocalStorage, getQueryObj } from '@/utils';
import { loginPagePath } from '@/utils/constant';
import monitor from '@/assets/monitor.png';
import loginBg from '@/assets/login-bg.svg';
import type { FC, ReactElement } from 'react';
import type { TabKey } from './type';

const { TabPane } = Tabs;
const Login: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState<TabKey>('login');
  const { loading: registerLoading, run: registerRun } = useRequest(register, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 200) {
        message.success('注册成功,快去登陆吧');
      }
    },
  });
  const { loading: loginLoading, run: loginRun } = useRequest(login, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 200) {
        message.success('登录成功!');
        HandleLocalStorage.set({ userInfo: res.data });

        const { redirect } = getQueryObj(window.location.search);
        navigate(redirect ?? loginPagePath);
      }
    },
  });

  const onChange = (tabKey: string) => {
    setTabKey(tabKey as TabKey);
  };
  const onFinish = async (formData: Record<string, any>) => {
    const { username, password } = formData;

    tabKey === 'login' ? loginRun(username, password) : registerRun(username, password);
  };
  const getTabContent = (btnMark: string) => {
    return (
      <Form onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input.Password prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={registerLoading || loginLoading}>
            {btnMark}
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div css={{ display: 'flex', justifyContent: 'center', height: '100vh', backgroundImage: `url(${loginBg})` }}>
      <div
        css={{
          marginTop: '100px',
          padding: '20px',
          borderRadius: '8px',
          width: '400px',
          height: '400px',
          boxShadow: 'rgba(100, 116, 139, 30%) 0px 0px 15px',
        }}
      >
        <div css={{ textAlign: 'center' }}>
          <img src={monitor} alt="logo" width={64} />
        </div>
        <h1 css={{ marginTop: '10px', color: 'rgba(0,0,0,.45)', fontSize: '14px', textAlign: 'center' }}>
          监控平台后台管理
        </h1>
        <Tabs defaultActiveKey="login" onChange={onChange} centered activeKey={tabKey} size="large">
          <TabPane tab="登录" key="login">
            {getTabContent('登录')}
          </TabPane>
          <TabPane tab="注册" key="register">
            {getTabContent('注册')}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
