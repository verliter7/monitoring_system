/* @jsxImportSource @emotion/react */
import { DualAxes } from '@ant-design/charts';
import type { FC, ReactElement } from 'react';
import type { IActiveListItemInfo } from './type';

interface IProps {
  activeListItemInfo: IActiveListItemInfo;
}

const HttpChart: FC<IProps> = ({ activeListItemInfo }): ReactElement => {
  const config: any = {
    theme: 'dark',
    meta: {
      successRate: {
        alias: '成功率',
        formatter: (value: number) => `${value}%`,
      },
      callCount: {
        alias: '调用次数',
      },
    },
    data: [activeListItemInfo.chartData ?? [], activeListItemInfo.chartData ?? []],
    xField: 'time',
    yField: ['successRate', 'callCount'],
    yAxis: {
      successRate: {
        title: {
          text: '成功率',
        },
        min: 0,
        tickInterval: 20,
      },
      callCount: {
        title: {
          text: '调用次数',
        },
        tickInterval: 5,
      },
    },
    geometryOptions: [
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
        },
        color: '#5AD5AB',
      },
      {
        geometry: 'column',
        color: '#6395F9',
      },
    ],
    legend: {
      layout: 'horizontal',
      position: 'top',
    },
    interactions: [
      {
        type: 'element-highlight',
      },
      {
        type: 'active-region',
      },
    ],
  };

  return <DualAxes {...config} />;
};

export default HttpChart;
