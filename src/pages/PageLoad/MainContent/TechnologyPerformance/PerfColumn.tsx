import { FC, ReactElement, useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import { Spin, Card } from 'antd';
import { ITimingData } from './type';

interface IProps {
  data: ITimingData[]
  loading: boolean
}
const PerfColumn: FC<IProps> = ({ data, loading }): ReactElement => {
  const [currentData, setCurrentData] = useState(data)

  useEffect(() => {
    setCurrentData(data)
  })

  const config = {
    data: currentData,
    meta: {
      timeStamp: {
        alias: '时间',
        formatter: (value: any) => {
          return new Date(value).toLocaleString(undefined, { year: "numeric", month: "numeric", day: "numeric", hour: 'numeric', minute: 'numeric', second: 'numeric' })
        },
      },
      during: {
        alias: '耗时',
        formatter: (value: any) => {
          return Number(value)
        },
      }
    },
    xField: 'timeStamp',
    yField: 'during',
    isGroup: true,
    isStack: true,
    seriesField: 'timingType',
    groupField: 'osName',
    tooltip: {
      formatter: (datum: Record<string, any>) => ({
        name: datum.timingType,
        value: datum.during,
      }),
    },
  };

  return (
    <Spin tip="图表加载中..." spinning={loading} size="large">
      <Card css={{ backgroundColor: '#fff' }} >
        <Column {...config} />
      </Card>
    </Spin>
  )
};

export default PerfColumn

