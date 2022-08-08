/* @jsxImportSource @emotion/react */
import type { FC, ReactElement } from 'react'
import { useState } from 'react';
import PubTabs from '@/public/PubTabs';
import useMount from '@/hooks/useMount';
import PaintLine from './PaintLine';
import { getPerformanceData, getUservitalsData } from '../../service';
import type { ITab } from '@/public/PubTabs/type';
import { useRequest } from '@/hooks';

const RenderingMetrics: FC = (): ReactElement => {
  const [paintData, setPaintData] = useState([]);

  const { loading } = useRequest(() => getPerformanceData('paint'), {
    onSuccess(res) {
      res.data.forEach((item: any) => {
        item.FP = parseInt(item.FP) || 0
        item.FCP = parseInt(item.FCP) || 0
        item.FMP = parseInt(item.FMP) || 0
        item.LCP = parseInt(item.LCP) || 0
        item.FID = parseInt(item.FID) || 0
        item.timeStamp = new Date(item.timeStamp).toLocaleString();
      })
      setPaintData(res.data)
    },

  });

  getUservitalsData((res:any) => {
    console.log(res);

  })

  const tabs: ITab[] = [
    {
      title: '首次绘制时间(FP)',
      middle: 123,
      bottomCenter: 233,
      unit: '',
      content: <PaintLine paintData={paintData} title="首次绘制时间(FP)" type='FP' loading={loading} />,
    },
    {
      title: '首次内容绘制时间(FCP)',
      middle: 4.05,
      bottomCenter: 4.08,
      unit: '%',
      content: <PaintLine paintData={paintData} title='首次内容绘制时间(FCP)' type='FCP' loading={loading} />,
    },
    {
      title: '首次有效绘制时间(FMP)',
      middle: 276,
      bottomCenter: 346,
      unit: '',
      content: <PaintLine paintData={paintData} title='首次有效绘制时间(FMP)' type='FMP' loading={loading} />,
    },
    {
      title: '最大内容绘画时间(LCP)',
      middle: 3.96,
      bottomCenter: 2.42,
      unit: '%',
      content: <PaintLine paintData={paintData} title='最大内容绘画时间(LCP)' type='LCP' loading={loading} />,
    },
    {
      title: '首次交互时间(FID)',
      middle: 3.96,
      bottomCenter: 2.42,
      unit: '%',
      content: <PaintLine paintData={paintData} title='首次交互时间(FID)' type='FID' loading={loading} />,
    },
  ];

  return (
    <PubTabs
      tabs={tabs}
      onChange={(activeKey: string) => {
        console.log(activeKey);
      }}
    />
  );
};

export default RenderingMetrics