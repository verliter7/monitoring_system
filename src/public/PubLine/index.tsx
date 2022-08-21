import { Line } from '@ant-design/plots';
import { Spin, Card } from 'antd';
import type { FC, ReactElement } from 'react';
import { IProps } from './type'

const PubLine: FC<IProps> = ({ paintData, type, title, loading, ...moreconfig }): ReactElement => {
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
    ...moreconfig
  };

  return (
    <Spin tip="图表加载中..." spinning={loading} size="large">
      <Card css={{ backgroundColor: '#fff' }} >
        <Line {...config} />
      </Card>
    </Spin>
  )
};

export default PubLine;