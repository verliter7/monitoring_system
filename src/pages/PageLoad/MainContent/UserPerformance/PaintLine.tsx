import { Line } from '@ant-design/plots';
import { Spin, Card } from 'antd';
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
  };

  return (
    <Spin tip="图表加载中..." spinning={loading} size="large">
      <Card css={{ backgroundColor: '#fff' }} >
        <Line {...config} />
      </Card>
    </Spin>
  )
};

export default PaintLine;
