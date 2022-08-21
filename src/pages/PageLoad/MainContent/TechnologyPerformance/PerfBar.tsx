import React, { useState, useEffect } from 'react';
import type { FC, ReactElement } from 'react';
import { Bar } from '@ant-design/plots';
import { ITimingData } from './type';
import { Spin, Card } from 'antd';

interface IProps {
  data: ITimingData[]
  loading: boolean
}


function handelData(data: ITimingData[]) {
  let returnData: Array<any> = []
  let start: number = 0, end: number = 12;
  while (end <= data.length) {
    returnData.push(data.slice(start, end))
    start += 12;
    end += 12;
  }
  return returnData
}

const PerfBar: FC<IProps> = ({ data, loading }): ReactElement => {
  const [currentData, setCurrentData] = useState([])


  useEffect(() => {
    let LastData = handelData(data)
    LastData[LastData.length - 1]?.forEach((item: any) => {
      item.values = [item.start, item.end]
    });
    setCurrentData(LastData[LastData.length - 1])
  }, [data])

  const config = {
    data: currentData,
    xField: 'values',
    yField: 'describe',
    isRange: true,
    tooltip: {
      fields: ['start', 'end', 'during'],
    },
  };

  return (
    <Spin tip="图表加载中..." spinning={loading} size="large">
      <Card css={{ backgroundColor: '#fff' }} >
        <Bar {...config} />
      </Card>
    </Spin>
  )
};

export default PerfBar