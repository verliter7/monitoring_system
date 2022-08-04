/* @jsxImportSource @emotion/react */
import { useState } from 'react';
import PubTabs from '@/public/PubTabs';
import useMount from '@/hooks/useMount';
import ErrorCountLine from './ErrorCountLine';
import { getResourceErrorCounts } from './service';
import type { FC, ReactElement } from 'react';
import type { ITab } from '@/public/PubTabs/type';
import type { IErrorCountData, IErrorSum } from './type';

const ResourcesError: FC = (): ReactElement => {
  const [backErrorCountData, setBackErrorCountData] = useState<IErrorCountData[]>([]);
  const [errorSum, setErrorSum] = useState<IErrorSum>({
    front: 0,
    back: 0,
  });

  const getSum = (values: number[]) => values.reduce((prev, cur) => prev + cur);

  useMount(async () => {
    try {
      const {
        data: { frontErrorConutsByTime, backErrorConutsByTime },
      } = await getResourceErrorCounts();

      const backErrorCountData = Object.entries<number>(backErrorConutsByTime).map(([time, errorCount]) => ({
        time,
        errorCount,
      }));

      setBackErrorCountData(backErrorCountData);
      setErrorSum({
        front: getSum(Object.values(frontErrorConutsByTime)),
        back: getSum(Object.values(backErrorConutsByTime)),
      });
    } catch (e) {}
  });

  const tabs: ITab[] = [
    {
      title: '错误数',
      middle: errorSum.back,
      bottomCenter: errorSum.front,
      unit: '',
      content: <ErrorCountLine backErrorData={backErrorCountData} />,
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
