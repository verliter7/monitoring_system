import React, { useState, useEffect, useContext } from 'react';
import type { FC, ReactElement } from 'react';
import { Bar } from '@ant-design/plots';
import { getResourceData } from '../../service';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useRequest } from '@/hooks';
import { DataType, waterFallType } from './type';

const Etype = {
  'dnsLookup': 'DNS解析',
  'initialConnect': '初始连接',
  'ssl': 'SSL握手',
  'contentDownload': '资源响应时间'
}

const handelData = (datas: Array<DataType & waterFallType>) => {
  const waterfallType: Array<keyof waterFallType> = ['dnsLookup', 'initialConnect', 'ssl', 'contentDownload']
  datas.forEach(data => {
    data.waterfall = waterfallType.map((type) => {
      return {
        timeStamp: data.timeStamp,
        value: data[type],
        type: Etype[type],
      }
    })
  })

  return datas
}

const ResourceBar: FC = (): ReactElement => {
  const [resourceData, setResourceData] = useState([])

  const { loading } = useRequest(() => getResourceData(), {
    onSuccess(res) {
      res.data.forEach((item: any) => {
        item.values = [item.startTime, item.responseEnd]
      })
      handelData(res.data)
      setResourceData(res.data)
    },
  })

  const config = {
    xField: 'value',
    yField: 'timeStamp',
    seriesField: 'type',
    height: 50,
    limitInPlot: false,
    isRange: true,
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'initiatorType',
      key: 'initiatorType',
    },
    {
      title: 'Size',
      dataIndex: 'transferSize',
      key: 'transferSize',
    },
    {
      title: 'Time',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Waterfall',
      dataIndex: 'waterfall',
      key: 'waterfall',
      render(value, record, index) {
        return (
          <Bar
            data={value}
            {...config}
          />
        )
      },
    }
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={resourceData}
        bordered
      />
    </>
  )
};

export default ResourceBar