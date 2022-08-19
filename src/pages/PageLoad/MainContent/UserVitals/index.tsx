import type { FC, ReactElement } from 'react'
import { useState } from 'react';
import PubTabs from '@/public/PubTabs';
import { getUservitalsData } from '../../service';
import type { ITab } from '@/public/PubTabs/type';
import { useRequest } from '@/hooks';
import PubLine from '@/public/PubLine'
import { IViewData, IPaintData } from './type'

const UserVitals: FC = (): ReactElement => {
  const [paintData, setPaintData] = useState([]);
  const [ViewData, setViewData] = useState<IViewData[]>([]);

  const { loading } = useRequest(() => getUservitalsData(), {
    onSuccess(res) {
      const View: Record<string, string[]> = {};
      const data: IViewData[] = []
      res.data.forEach((item: any) => {
        item.duration = parseInt(item.duration) / 1000 || 0;
        item.timeStamp = new Date(item.timeStamp).toLocaleString();
        const date = new Date(item.startTime).toLocaleDateString();
        if(date) {
          if(View[date]) View[date].push(item.ip)
          else View[date] = [item.ip]
        }
      })
      setPaintData(res.data)
      for(let i in View) {
        let PV: IViewData = {
          timeStamp: '',
          count: 0,
          category: 'PV'
        }
        PV["timeStamp"] = i;
        PV["count"] = View[i].length;
        data.push(PV)
        const ip = Array.from(new Set(View[i]))
        let UV: IViewData = {
          timeStamp: '',
          count: 0,
          category: 'UV'
        };
        UV["timeStamp"] = i;
        UV["count"] = ip.length;
        data.push(UV)
      }
      setViewData(data)
    },
  });

  const getLastData = (index: number):  IPaintData => {
    return paintData[paintData.length - index]
  }

  const getLastViewData = (index: number, type: 'PV'|'UV'): IViewData => {
    const data = ViewData.filter(item => item.category === type)
    return data[data.length - index]
  }

  const tabs: ITab[] = [
    {
      title: 'PV/UV趋势图',
      middle: getLastViewData(1, 'PV').count,
      bottomCenter: getLastViewData(2, 'PV').count,
      unit: '',
      content: <PubLine paintData={ViewData} title="PV/UV" type='count' loading={loading} smooth={true} seriesField='category'/>,
    },
    {
      title: '页面停留时间',
      middle: getLastData(1).duration,
      bottomCenter: getLastData(2).duration,
      unit: 's',
      content: <PubLine paintData={paintData} title="页面停留时间" type='duration' loading={loading} />,
    },
  ];

  return (
    <PubTabs
      tabs={tabs}
      onChange={(activeKey: string) => {
        // console.log(activeKey);
      }}
    />
  );
}

export default UserVitals