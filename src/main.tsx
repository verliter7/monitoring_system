import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Global, css } from '@emotion/react';
import App from './App';
import store from '@/redux/store';
import WebSdk from './monitor';

new WebSdk({
  aid: 'eMBYxfwKY7a6GJ4p',
});

const globalStyles = css`
  html,
  body {
    height: 100%;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  .user-modal-wrapper {
    overflow: hidden;
  }
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Global styles={globalStyles} />
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  </>,
);
