/* @jsxImportSource @emotion/react */
import type { FC, ReactElement } from 'react'
import { useState } from 'react';
import PubTabs from '@/public/PubTabs';
import useMount from '@/hooks/useMount';
import PaintLine from './PaintLine';
import { getPerformanceData } from '../../service';
import type { ITab } from '@/public/PubTabs/type';
import { useRequest } from '@/hooks';
import type { HPaintData, IPaintData, ICLSData } from './type';

const RenderingMetrics: FC = (): ReactElement => {
  const [paintData, setPaintData] = useState<HPaintData[]>([]);
  const [CLSData, setCLSData] = useState([])

  const { loading } = useRequest(() => getPerformanceData('paint'), {
    onSuccess(res) {
      if (res.code === 200) {
        let data = res.data.map((item: IPaintData) => {
          return {
            FP: parseInt(item.FP) || 0,
            FCP: parseInt(item.FCP) || 0,
            FMP: parseInt(item.FMP) || 0,
            LCP: parseInt(item.LCP) || 0,
            FID: Number(item.FID.substring(0, item.FID.indexOf(".") + 3)) || 0,
            timeStamp: new Date(item.timeStamp).toLocaleString(undefined, { year: "numeric", month: "numeric", day: "numeric", hour: 'numeric', minute: 'numeric', second: 'numeric' }),
          }
        })
        setPaintData(data)
      }
    },
  });

  const { loading: loading2 } = useRequest(() => getPerformanceData('CLS'), {
    onSuccess(res) {
      let data = res.data.map((item: ICLSData) => {
        return {
          CLS: Number(item.CLS.substring(0, item.CLS.indexOf(".") + 4)) || 0,
          timeStamp: new Date(item.timeStamp).toLocaleString(undefined, { year: "numeric", month: "numeric", day: "numeric", hour: 'numeric', minute: 'numeric', second: 'numeric' }),
        }
      })
      setCLSData(data)
    },
  });

  /**
   * 拿到倒数的数据
   * @param index 倒数第一个就是 1 第二个就是 2
   * @returns
   */
  const getLastData = (index: number, data: Array<HPaintData | ICLSData> = paintData): any => {
    return data[data.length - index]
  }

  const tabs: ITab[] = [
    {
      title: '首次绘制时间(FP)',
      middle: getLastData(1)?.FP || 0,
      bottomCenter: getLastData(2)?.FP || 0,
      unit: 'ms',
      content: <PaintLine paintData={paintData} title="首次绘制时间(FP)" type='FP' loading={loading} />,
    },
    {
      title: '首次内容绘制时间(FCP)',
      middle: getLastData(1)?.FCP || 0,
      bottomCenter: getLastData(2)?.FCP || 0,
      unit: 'ms',
      content: <PaintLine paintData={paintData} title='首次内容绘制时间(FCP)' type='FCP' loading={loading} />,
    },
    // {
    //   title: '首次有效绘制时间(FMP)',
    //   middle: getLastData(1)?.FMP || 0,
    //   bottomCenter: getLastData(2)?.FMP || 0,
    //   unit: 'ms',
    //   content: <PaintLine paintData={paintData} title='首次有效绘制时间(FMP)' type='FMP' loading={loading} />,
    // },
    {
      title: '最大内容绘画时间(LCP)',
      middle: getLastData(1)?.LCP || 0,
      bottomCenter: getLastData(2)?.LCP || 0,
      unit: 'ms',
      content: <PaintLine paintData={paintData} title='最大内容绘画时间(LCP)' type='LCP' loading={loading} />,
    },
    {
      title: '首次交互时间(FID)',
      middle: getLastData(1)?.FID || 0,
      bottomCenter: getLastData(2)?.FID || 0,
      unit: 'ms',
      content: <PaintLine paintData={paintData} title='首次交互时间(FID)' type='FID' loading={loading} />,
    },
    {
      title: '累积布局移动(CLS)',
      middle: getLastData(1, CLSData)?.CLS || 0,
      bottomCenter: getLastData(2, CLSData)?.CLS || 0,
      unit: 'ms',
      content: <PaintLine paintData={CLSData} title='累积布局移动(CLS)' type='CLS' loading={loading2} />,
    },
  ];

  return (
    <PubTabs
      tabs={tabs}
    // onChange={(activeKey: string) => {
    //   console.log(activeKey);
    // }}
    />
  );
};

export default RenderingMetrics