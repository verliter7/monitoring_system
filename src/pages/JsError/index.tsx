/* @jsxImportSource @emotion/react */
import { useCallback, useRef } from 'react';
import { Card } from 'antd';
import PubTabs from '@/public/PubTabs';
import PubTable from '@/public/PubTable';
import PubHeader from '@/public/PubHeader';
import PubErrorLine from '@/public/PubErrorLine';
import { useCallbackState, useMount, useRequest, useUnmount } from '@/hooks';
import { getJSErrorCount, getJSErrorData } from './service';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { cardStorage, chartStorage, pastDaysStorage, tableStorage } from '@/redux/jsErrorSlice';
import { reducerEnum } from '@/redux/store';
import { FC, ReactElement } from 'react';
import type { ITab } from '@/public/PubTabs/type';
import type { JSErrorRecord, JSBackErrorCountData, JSBackErrorRateData } from './type';
import type { IBaseTableRef } from '@/public/PubTable/type';

const columns: Record<string, any>[] = [
  {
    title: '发生时间',
    dataIndex: 'date',
    key: 'date',
    sorter: (a: JSErrorRecord, b: JSErrorRecord) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    },
  },
  {
    title: '错误栈',
    dataIndex: 'errorStack',
    key: 'errorStack',
    render: (_: any, record: Record<string, any>) => {
      return (
        <div css={{ display: 'flex', flexDirection: 'column' }}>
          <span css={{ color: '#167BFE' }}>{record.errorMsg}</span>
          <span css={{ color: '#8BA8D1' }}>{record.errorStack.split('$$')[0]}</span>
        </div>
      );
    },
    ellipsis: true,
  },
  {
    title: '错误类型',
    dataIndex: 'errorType',
    key: 'errorType',
  },
  {
    title: '错误数',
    dataIndex: 'count',
    key: 'count',
    sorter: (a: JSErrorRecord, b: JSErrorRecord) => a.count - b.count,
  },
];

const JsError: FC = (): ReactElement => {
  const {
    pastDays: reduxPastDays,
    chart: { backErrorCountData, backErrorRateData },
    card: { errorSum, errorRate },
  } = useAppSelector(
    (state) => state.jsError,
    (pre, cur) => pre.pastDays === cur.pastDays && pre.card === cur.card && pre.chart === cur.chart,
  );
  const [pastDays, setPastDays] = useCallbackState<string>(reduxPastDays);
  const dispatch = useAppDispatch();
  const getDecimal = (v1: number, v2: number) => (v2 === 0 ? 0 : Math.round((v1 / v2) * 10000) / 100);
  const { loading: jsErrorCountLoading, run: getJSErrorCountRun } = useRequest(getJSErrorCount, {
    manual: true,
    onSuccess(res) {
      const {
        data: { frontErrorConutByTime, backErrorConutByTime },
      } = res;

      const backErrorCountData: JSBackErrorCountData[] = [], // 后一周期错误数据(图表)
        backErrorRateData: JSBackErrorRateData[] = []; // 后一周期错误率数据(图表)
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

      getJSErrorCountRun(value);
      updateTableData({
        current,
        size,
      });
    });
  }, []);

  useMount(() => {
    // backErrorCountData.length !== 0 代表数据已经缓存到redux上
    backErrorCountData.length === 0 && getJSErrorCountRun(pastDays);
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
            loading={jsErrorCountLoading}
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
    <div css={{ marginRight: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PubHeader handleSelectChange={handleChange} pastDays={pastDays} />
      <PubTabs tabs={tabs} onChange={(activeKey: string) => {}} />
      <PubTable
        columns={columns}
        getTableData={getJSErrorData.bind(null, pastDays)}
        storage={tableStorage}
        reduxMark={reducerEnum.JE}
        ref={tableRef}
        tableSize="small"
        fontSize="12px"
      />
    </div>
  );
};

export default JsError;
