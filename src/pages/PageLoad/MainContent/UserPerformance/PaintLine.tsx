import { Line } from '@ant-design/plots';
import type { FC, ReactElement } from 'react';
import type { IPaintData } from './type';

interface IProps {
  paintData: IPaintData[];
  type: "FP" | "FCP" | "FMP" | "LCP" | "FID"
  title: string
}

const PaintLine: FC<IProps> = ({ paintData, type, title }): ReactElement => {
  const config = {
    meta: {
      timeStamp: {
        alias: '时间'
      },
      [type]: {
        alias: title,
      },
    },
    data: paintData,
    padding: 'auto' as 'auto',
    xField: 'timeStamp',
    yField: type,
    xAxis: {
      tickCount: 5,
    },
  };

  return <Line {...config} />;
};

export default PaintLine;
