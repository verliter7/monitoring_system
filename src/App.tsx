import MonitorCore from '@/utils/monitor';
import type { FC, ReactElement } from 'react';

const monitor = MonitorCore.getInstance();
monitor.init('monitor_learn', 'http://localhost:8080/api/v1/error');

const App: FC = (): ReactElement => {
  return <div>App</div>;
};

export default App;
