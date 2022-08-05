import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import App from './App';
import WebSdk from './utils/monitor';

new WebSdk({
  aid: '10086',
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
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Global styles={globalStyles} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
);
