/* @jsxImportSource @emotion/react */
import { useState } from 'react';
import PubTabs from '@/public/PubTabs';
import useMount from '@/hooks/useMount';
import ErrorCountLine from './ErrorCountLine';
import { getResourceErrorCounts } from './service';
import type { FC, ReactElement } from 'react';
import type { ITab } from '@/public/PubTabs/type';
import type { IErorCountData } from './type';

const ResourcesError: FC = (): ReactElement => {
  const [errorCountData, setErrorCountData] = useState<IErorCountData[]>([]);

  useMount(async () => {
    const {
      data: { backErrorConutsByTime },
    } = await getResourceErrorCounts();

    const errorData = Object.entries<number>(backErrorConutsByTime).map(([time, errorCount]) => ({
      time,
      errorCount,
    }));

    setErrorCountData(errorData);
  });

  const tabs: ITab[] = [
    {
      title: '错误数',
      middle: 123,
      bottomCenter: 233,
      unit: '',
      content: <ErrorCountLine errorCountData={errorCountData} />,
    },
    {
      title: '错误率',
      middle: 4.05,
      bottomCenter: 4.08,
      unit: '%',
      content: <div>2</div>,
    },
    {
      title: '影响用户数',
      middle: 276,
      bottomCenter: 346,
      unit: '',
      content: <div>3</div>,
    },
    {
      title: '影响用户比例',
      middle: 3.96,
      bottomCenter: 2.42,
      unit: '%',
      content: <div>4</div>,
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

export default ResourcesError;
