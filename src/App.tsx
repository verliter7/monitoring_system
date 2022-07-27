import BaseLayout from '@/components/BaseLayout';
import type { FC, ReactElement } from 'react';
import WebSdk from './utils/monitor/WebSdk';


new WebSdk({
  aid: '10086'
})
// const monitor = MonitorCore.getInstance('monitor_learn');
// monitor.init();

const App: FC = (): ReactElement => {
  return <BaseLayout />;
};

export default App;
