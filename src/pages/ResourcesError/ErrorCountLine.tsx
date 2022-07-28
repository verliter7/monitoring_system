import { Line } from '@ant-design/plots';
import type { FC, ReactElement } from 'react';
import type { IErorCountData } from './type';

interface IProps {
  errorCountData: IErorCountData[];
}

const ErrorCountLine: FC<IProps> = ({ errorCountData }): ReactElement => {
  const config = {
    meta: {
      time: {
        alias: '时间',
      },
      errorCount: {
        alias: '错误数量',
      },
    },
    data: errorCountData,
    padding: 'auto' as 'auto',
    xField: 'time',
    yField: 'errorCount',
    yAxis: {
      tickInterval: 1,
    },
  };

  return <Line {...config} />;
};

export default ErrorCountLine;
