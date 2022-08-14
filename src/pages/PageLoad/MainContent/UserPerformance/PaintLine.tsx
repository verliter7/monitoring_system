import { Line } from '@ant-design/plots';
import { Spin } from 'antd';
import type { FC, ReactElement } from 'react';
import type { HPaintData } from './type';

interface IProps {
  paintData: HPaintData[];
  type: "FP" | "FCP" | "FMP" | "LCP" | "FID" | "CLS"
  title: string
  loading: boolean
}

const PaintLine: FC<IProps> = ({ paintData, type, title, loading }): ReactElement => {
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
      // tickCount: 5,
      // tickInterval: 4,
    },
  };

  return (
    <Spin tip="图表加载中..." spinning={loading} size="large">
      <Line {...config} />
    </Spin>
  )
};

export default PaintLine;
