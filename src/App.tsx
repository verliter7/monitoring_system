import BaseLayout from '@/components/BaseLayout';
import type { FC, ReactElement } from 'react';
import WebSdk from './utils/monitor';

new WebSdk({
  aid: '10086'
})


const App: FC = (): ReactElement => {
  return <BaseLayout />;
};

export default App;
