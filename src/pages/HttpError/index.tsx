/* @jsxImportSource @emotion/react */
import { useCallback, useRef } from 'react';
import { Card } from 'antd';
import PubTabs from '@/public/PubTabs';
import PubHeader from '@/public/PubHeader';
import PubErrorLine from '@/public/PubErrorLine';
import PubTable from '@/public/PubTable';
import { reducerEnum } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { cardStorage, chartStorage, tableStorage } from '@/redux/httpErrorSlice';
import { useCallbackState, useMount, useRequest } from '@/hooks';
import { getHttpErrorCount, getHttpErrorData } from './service';
import type { FC, ReactElement } from 'react';
import type { ITab } from '@/public/PubTabs/type';
import type { IHttpErrorRecord, IHttpsBackErrorCountData, IHttpsBackErrorRateData } from './type';
import type { IBaseTableRef } from '@/public/PubTable/type';

const columns: Record<string, any>[] = [
  {
    title: '发生时间',
    dataIndex: 'date',
    key: 'date',
    sorter: (a: IHttpErrorRecord, b: IHttpErrorRecord) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    },
  },
  {
    title: '错误数',
    dataIndex: 'count',
    key: 'count',
    sorter: (a: IHttpErrorRecord, b: IHttpErrorRecord) => a.count - b.count,
  },
  {
    title: '页面',
    dataIndex: 'originUrl',
    key: 'originUrl',
  },
  {
    title: '请求地址',
    dataIndex: 'requestUrl',
    key: 'requestUrl',
  },
  {
    title: '请求方式',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: '状态码',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '响应信息',
    dataIndex: 'httpMessage',
    key: 'httpMessage',
  },
  {
    title: '请求耗时',
    dataIndex: 'duration',
    key: 'duration',
    sorter: (a: IHttpErrorRecord, b: IHttpErrorRecord) => a.duration - b.duration,
  },
];
const HttpError: FC = (): ReactElement => {
  const tableRef = useRef<IBaseTableRef | null>(null);
  const {
    pastDays: reduxPastDays,
    chart: { backErrorCountData, backErrorRateData },
    card: { errorSum, errorRate },
  } = useAppSelector(
    (state) => state.httpError,
    (pre, cur) => pre.pastDays === cur.pastDays && pre.card === cur.card && pre.chart === cur.chart,
  );
  const dispatch = useAppDispatch();
  const getDecimal = (v1: number, v2: number) => (v2 === 0 ? 0 : Math.round((v1 / v2) * 10000) / 100);
  const { loading: httpErrorCountLoading, run: getHttpErrorCountRun } = useRequest(getHttpErrorCount, {
    manual: true,
    onSuccess(res) {
      const {
        data: { frontErrorConutByTime, backErrorConutByTime },
      } = res;

      const backErrorCountData: IHttpsBackErrorCountData[] = [], // 后一周期错误数据(图表)
        backErrorRateData: IHttpsBackErrorRateData[] = []; // 后一周期错误率数据(图表)
      let f_errorCount = 0, // 前一周期错误数
        b_errorCount = 0, // 后一周期错误数
        f_count = 0, // 前一周期总的http请求数
        b_count = 0; // 后一周期总http请求数

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
  const [pastDays, setPastDays] = useCallbackState<string>(reduxPastDays);
  const handleChange = useCallback((value: string) => {
    setPastDays(value, () => {
      const { updateTableData, current, size } = tableRef.current as IBaseTableRef;

      getHttpErrorCountRun(value);
      updateTableData({
        current,
        size,
      });
    });
  }, []);

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
            loading={httpErrorCountLoading}
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

  useMount(() => {
    // backErrorCountData.length !== 0 代表数据已经缓存到redux上
    backErrorCountData.length === 0 && getHttpErrorCountRun();
  });

  return (
    <div css={{ marginRight: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PubHeader handleSelectChange={handleChange} pastDays={pastDays} />
      <PubTabs tabs={tabs} onChange={(activeKey: string) => {}} />
      <PubTable
        columns={columns}
        getTableData={getHttpErrorData.bind(null, pastDays)}
        storage={tableStorage}
        reduxMark={reducerEnum.HE}
        ref={tableRef}
      />
    </div>
  );
};

export default HttpError;
