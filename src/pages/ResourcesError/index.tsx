/* @jsxImportSource @emotion/react */
import { useCallback, useRef } from 'react';
import { Card } from 'antd';
import PubTabs from '@/public/PubTabs';
import PubTable from '@/public/PubTable';
import PubHeader from '@/public/PubHeader';
import PubErrorLine from '@/public/PubErrorLine';
import { useCallbackState, useMount, useRequest, useUnmount } from '@/hooks';
import { getResourceErrorCount, getResourceErrorData } from './service';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { cardStorage, chartStorage, pastDaysStorage, tableStorage } from '@/redux/resourceErrorSlice';
import { reducerEnum } from '@/redux/store';
import { FC, ReactElement } from 'react';
import type { ITab } from '@/public/PubTabs/type';
import type { IResourceErrorRecord, IResourcesBackErrorCountData, IResourcesBackErrorRateData } from './type';
import type { IBaseTableRef } from '@/public/PubTable/type';

const columns: Record<string, any>[] = [
  {
    title: '发生时间',
    dataIndex: 'date',
    key: 'date',
    sorter: (b: IResourceErrorRecord, a: IResourceErrorRecord) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    },
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
    sorter: (b: IResourceErrorRecord, a: IResourceErrorRecord) => a.count - b.count,
  },
];

const ResourcesError: FC = (): ReactElement => {
  const {
    pastDays: reduxPastDays,
    chart: { backErrorCountData, backErrorRateData },
    card: { errorSum, errorRate },
  } = useAppSelector(
    (state) => state.resourceError,
    (pre, cur) => pre.pastDays === cur.pastDays && pre.card === cur.card && pre.chart === cur.chart,
  );
  const [pastDays, setPastDays] = useCallbackState<string>(reduxPastDays);
  const dispatch = useAppDispatch();
  const getDecimal = (v1: number, v2: number) => (v2 === 0 ? 0 : Math.round((v1 / v2) * 10000) / 100);
  const { loading: resourceErrorCountLoading, run: getResourceErrorCountRun } = useRequest(getResourceErrorCount, {
    manual: true,
    onSuccess(res) {
      const {
        data: { frontErrorConutByTime, backErrorConutByTime },
      } = res;

      const backErrorCountData: IResourcesBackErrorCountData[] = [], // 后一周期错误数据(图表)
        backErrorRateData: IResourcesBackErrorRateData[] = []; // 后一周期错误率数据(图表)
      let f_errorCount = 0, // 前一周期错误数
        b_errorCount = 0, // 后一周期错误数
        f_count = 0, // 前一周期总的资源请求数
        b_count = 0; // 后一周期总的资源请求数

      // 转换后端数据以适应图表数据格式
      Object.entries<[number, number]>(frontErrorConutByTime).forEach(([_, count]) => {
        f_errorCount += count[0];
        f_count += count[1];
      });
      Object.entries<[number, number]>(backErrorConutByTime).forEach(([time, count]) => {
        b_errorCount += count[0];
        b_count += count[1];
        backErrorCountData.push({
          time,
          errorCount: count[0],
        });
        backErrorRateData.push({
          time,
          errorRate: getDecimal(count[0], count[1]),
        });
      });

      // 缓存tab栏数据到redux上
      dispatch(
        cardStorage({
          errorSum: {
            front: f_errorCount,
            back: b_errorCount,
          },
          errorRate: {
            front: getDecimal(f_errorCount, f_count),
            back: getDecimal(b_errorCount, b_count),
          },
        }),
      );
      // 缓存图表数据到redux上
      dispatch(
        chartStorage({
          backErrorCountData,
          backErrorRateData,
        }),
      );
    },
  });
  const tableRef = useRef<IBaseTableRef | null>(null);

  const handleChange = useCallback((value: string) => {
    setPastDays(value, () => {
      const { updateTableData, current, size } = tableRef.current as IBaseTableRef;

      getResourceErrorCountRun(value);
      updateTableData({
        current,
        size,
      });
    });
  }, []);
  // 防止组件无关表格的刷新，导致表格不必要的刷新
  const getResourceErrorDataBind = useCallback(getResourceErrorData.bind(null, pastDays), [pastDays]);

  useMount(() => {
    // backErrorCountData.length !== 0 代表数据已经缓存到redux上
    backErrorCountData.length === 0 && getResourceErrorCountRun(pastDays);
  });

  useUnmount(() => {
    dispatch(pastDaysStorage(pastDays));
  });

  const tabs: ITab[] = [
    {
      title: '错误数',
      middle: errorSum.back,
      bottomCenter: errorSum.front,
      unit: '',
      content: (
        <Card>
          <PubErrorLine
            config={{
              meta: {
                errorCount: {
                  alias: '错误数量',
                },
              },
              data: backErrorCountData,
              yField: 'errorCount',
              yAxis: {
                title: {
                  text: '错误数量(个)',
                },
                tickInterval: 1,
              },
            }}
            loading={resourceErrorCountLoading}
          />
        </Card>
      ),
    },
    {
      title: '错误率',
      middle: errorRate.back,
      bottomCenter: errorRate.front,
      unit: '%',
      content: (
        <PubErrorLine
          config={{
            meta: {
              errorRate: {
                alias: '错误率',
                formatter: (value: number) => `${value}%`,
              },
            },
            data: backErrorRateData,
            yField: 'errorRate',
            yAxis: {
              title: {
                text: '错误率',
              },
            },
          }}
        />
      ),
    },
  ];

  return (
    <div css={{ marginRight: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PubHeader handleSelectChange={handleChange} pastDays={pastDays} />
      <PubTabs tabs={tabs} onChange={(activeKey: string) => {}} />
      <PubTable
        columns={columns}
        getTableData={getResourceErrorDataBind}
        storage={tableStorage}
        reduxMark={reducerEnum.RE}
        ref={tableRef}
      />
    </div>
  );
};

export default ResourcesError;
