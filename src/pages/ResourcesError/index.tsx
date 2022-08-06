/* @jsxImportSource @emotion/react */
import PubTabs from '@/public/PubTabs';
import PubTable from '@/public/PubTable';
import { useMount, useRequest } from '@/hooks';
import ErrorCountLine from './ErrorCountLine';
import { getResourceErrorCount, getResourceErrorData } from './service';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { storage } from '@/redux/chartSlice';
import { chartTypeEnum } from '@/redux/chartSlice/type';
import { tableTypeEnum } from '@/redux/tableSlice/type';
import type { FC, ReactElement } from 'react';
import type { ITab } from '@/public/PubTabs/type';
import type { IResourceErrorRecord } from './type';

const columns: Record<string, any>[] = [
  {
    title: '发生时间',
    dataIndex: 'date',
    key: 'date',
    sorter: (a: IResourceErrorRecord, b: IResourceErrorRecord) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    },
  },
  {
    title: '源url',
    dataIndex: 'originUrl',
    key: 'originUrl',
  },
  {
    title: 'src属性',
    dataIndex: 'requestUrl',
    key: 'requestUrl',
  },
  {
    title: '错误数',
    dataIndex: 'count',
    key: 'count',
    sorter: (a: IResourceErrorRecord, b: IResourceErrorRecord) => a.count - b.count,
  },
];

const ResourcesError: FC = (): ReactElement => {
  const { backErrorCountData, errorSum } = useAppSelector((state) => state.chart.resources);
  const dispatch = useAppDispatch();
  const getSum = (values: number[]) => values.reduce((prev, cur) => prev + cur, 0);
  const { loading: resourceErrorCountLoading, run: getResourceErrorCountsRun } = useRequest(getResourceErrorCount, {
    manual: true,
    onSuccess(res) {
      const {
        data: { frontErrorConutByTime, backErrorConutByTime },
      } = res;

      const backErrorCountData = Object.entries<number>(backErrorConutByTime).map(([time, errorCount]) => ({
        time,
        errorCount,
      }));

      dispatch(
        storage({
          backErrorCountData,
          errorSum: {
            front: getSum(Object.values(frontErrorConutByTime)),
            back: getSum(Object.values(backErrorConutByTime)),
          },
          type: chartTypeEnum.RS,
        }),
      );
    },
  });

  useMount(() => {
    backErrorCountData.length === 0 && getResourceErrorCountsRun();
  });

  const tabs: ITab[] = [
    {
      title: '错误数',
      middle: errorSum.back,
      bottomCenter: errorSum.front,
      unit: '',
      content: (
        <div css={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <ErrorCountLine backErrorCountData={backErrorCountData} loading={resourceErrorCountLoading} />
          <PubTable columns={columns} getTableData={getResourceErrorData} type={tableTypeEnum.RS} />
        </div>
      ),
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
