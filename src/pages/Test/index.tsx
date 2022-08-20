/* @jsxImportSource @emotion/react */
import { Button } from 'antd';
import type { FC, ReactElement } from 'react';

const getRandomStr = () => Math.random().toString(36).slice(2);

const Test: FC = (): ReactElement => {
  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '0 100px' }}>
      <Button
        block
        type="primary"
        onClick={() => {
          throw new TypeError('jsError');
        }}
      >
        抛出js错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          Promise.reject(1);
        }}
      >
        抛出prmosie错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', '/api/v1/test?status=200');
          xhr.send(null);
        }}
      >
        正常ajax请求
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', '/api/v1/test?status=500');
          xhr.send(null);
        }}
      >
        抛出ajax错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          setTimeout(() => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/v1/test?status=500');
            xhr.send(null);
          }, 5000);
        }}
      >
        抛出ajax network错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', 'https://www.baidu.com/sugrec');
          xhr.send(null);
        }}
      >
        抛出ajax 跨域错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          const xhr = new XMLHttpRequest();

          xhr.timeout = 1;
          xhr.open('GET', '/api/v1/test?status=200');
          xhr.send(null);
        }}
      >
        抛出ajax超时错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          const xhr = new XMLHttpRequest();

          xhr.open('GET', '/api/v1/test?status=200');
          xhr.send(null);
          xhr.abort();
        }}
      >
        抛出ajax取消错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          fetch('/api/v1/test?status=200');
        }}
      >
        正常fetch请求
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          fetch('/api/v1/test?status=500');
        }}
      >
        抛出fetch错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          setTimeout(() => {
            fetch('/api/v1/test?status=500');
          }, 5000);
        }}
      >
        抛出fetch网络错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          fetch('https://www.baidu.com/sugrec');
        }}
      >
        抛出fetch跨域错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          const controller = new AbortController();
          const { signal } = controller;

          fetch('/api/v1/test?status=200', { signal });

          controller.abort();
        }}
      >
        抛出fetch取消错误
      </Button>
      <Button
        block
        type="primary"
        onClick={() => {
          const script = document.createElement('script');
          script.src = `http://bilibili.com/resources/${getRandomStr()}.js`;
          document.head.appendChild(script);
        }}
      >
        抛出资源加载错误
      </Button>
    </div>
  );
};

export default Test;
