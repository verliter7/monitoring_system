/* @jsxImportSource @emotion/react */
import MonitorCore from '@/utils/monitor';
import type { FC, ReactElement } from 'react';

const monitor = MonitorCore.getInstance('monitor_learn');
monitor.init();

const App: FC = (): ReactElement => {
  return (
    <div
      css={{
        display: 'flex',
      }}
    >
      App
    </div>
  );
};

export default App;
