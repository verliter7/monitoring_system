import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Global, css } from '@emotion/react';
import App from './App';

const globalStyles = css`
  html,
  body {
    height: 100%;
  }

  #root {
    height: 100%;
    width: 100%;
  }
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Global styles={globalStyles} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
);
