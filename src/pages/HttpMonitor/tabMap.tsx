/* @jsxImportSource @emotion/react */
import { DualAxes } from '@ant-design/charts';
import PubTable from '@/public/PubTable';
import Aside from './views/Aside';
import SortIcon from './views/SortIcon';
import { getHttpMsgCluster, getHttpSuccessRate, getHttpSuccessTimeConsume, getHttpFailTimeConsume } from './service';
import { getRandomStr } from '@/utils';
import {
  failTimeConsumeStorage,
  msgClusterStorage,
  successRateStorage,
  successTimeConsumeStorage,
} from '@/redux/httpMonitorSlice';
import {
  ITabMap,
  tabKeyEnum,
  ISuccessRateChartData,
  IMsgClusterTableData,
  ITabSuccessRateItemInfo,
  ITabMsgClusterItemInfo,
  ITimeConsumeChartData,
  ITabTimeConsumeItemInfo,
} from './type';

const getDefaultChartConfig = (chartData: any): any => ({
  theme: 'dark',
  data: [chartData, chartData],
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
});

// 各个tab对应的信息
const tabMap: ITabMap = {
  successRate: {
    tab: '成功率',
    cartTitle: 'API成功率',
    radioOptions: [
      { label: '调用量(占比)排行', value: 'callRate' },
      { label: '成功率排行', value: 'successRate' },
    ],
    getChartOrTable: (chartData) => (
      <DualAxes
        {...{
          ...getDefaultChartConfig(chartData),
          meta: {
            successRate: {
              alias: '成功率',
              formatter: (value: number) => `${value}%`,
            },
            callCount: {
              alias: '调用次数',
            },
          },
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
              min: 0,
              tickInterval: 1,
            },
          },
        }}
        height={230}
      />
    ),
    content: (listItemNames, listItemInfo, activeListItemInfo, handleListItemClick) => (
      <Aside
        listItemNames={listItemNames}
        listItemInfo={listItemInfo}
        activeListItemInfo={activeListItemInfo}
        handleListItemClick={handleListItemClick}
        getListItemRight={({ successRate, callRate, callCount }) => (
          <>
            <span css={{ fontWeight: 'bold' }}>
              {`${callCount}次`}
              {`(${callRate}%)`}
            </span>{' '}
            | {`${successRate}%`}
          </>
        )}
      />
    ),
    getRequestConfig: (dispatch, setListItem, getSafeRate) => [
      getHttpSuccessRate,
      {
        manual: true,
        onSuccess(reqRes) {
          const { successRateInfos, total } = reqRes.data;
          const keys = Object.keys(successRateInfos);
          const successRateListItemInfo: Record<string, ITabSuccessRateItemInfo> = {};

          // 下面都是数据处理及转换格式
          keys.forEach((apiKey) => {
            const chartData: ISuccessRateChartData[] = [];
            let successTotal_one_sum = 0;
            let total_one_sum = 0;

            Object.keys(successRateInfos[apiKey]).forEach((time) => {
              const [successTotal_one, total_one] = successRateInfos[apiKey][time];

              successTotal_one_sum += successTotal_one;
              total_one_sum += total_one;
              chartData.push({
                time,
                successRate: getSafeRate(successTotal_one, total_one),
                callCount: total_one,
              });
            });

            successRateListItemInfo[apiKey] = {
              itemName: apiKey,
              successRate: getSafeRate(successTotal_one_sum, total_one_sum),
              callRate: getSafeRate(total_one_sum, total),
              callCount: total_one_sum,
              chartData,
            };
          });

          dispatch(successRateStorage(successRateListItemInfo));
          setListItem(keys, successRateListItemInfo[keys[0]] ?? {});
        },
      },
    ],
    rankType: 'callRate',
    runType: 'getSuccessRateRun',
    dataType: 'chartData',
  },
  msgCluster: {
    tab: (handleSortClick, sortType, radioValue, activeKey, allListItemInfo) => (
      <div css={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <span
          css={{
            transform: `translateX(${activeKey === tabKeyEnum.MC ? 0 : 8}px)`,
          }}
        >
          Msg聚类
        </span>
        <SortIcon
          sortType={sortType}
          handleSortClick={(sortType) => handleSortClick(sortType, radioValue, activeKey, allListItemInfo)}
          isVisible={activeKey === tabKeyEnum.MC}
        />
      </div>
    ),
    cartTitle: 'Msg调用情况',
    content: (listItemNames, listItemInfo, activeListItemInfo, handleListItemClick) => (
      <Aside
        listItemNames={listItemNames}
        listItemInfo={listItemInfo}
        activeListItemInfo={activeListItemInfo}
        handleListItemClick={handleListItemClick}
        getListItemRight={({ callCount }) => <span css={{ fontWeight: 'bold' }}>{`${callCount}次`}</span>}
      />
    ),
    getRequestConfig: (dispatch, setListItem) => [
      getHttpMsgCluster,
      {
        manual: true,
        onSuccess(reqRes) {
          const { data } = reqRes;
          const keys = Object.keys(data);
          const msgClusterListItemInfo: Record<string, ITabMsgClusterItemInfo> = {};

          // 下面都是数据处理及转换格式
          keys.forEach((infoKey) => {
            let total_one_sum = 0;
            const records: IMsgClusterTableData[] = [];

            Object.keys(data[infoKey]).forEach((apiKey) => {
              const { callCount, status } = data[infoKey][apiKey];

              total_one_sum += callCount;

              records.push({
                apiName: apiKey,
                callCount,
                status,
                key: getRandomStr(),
              });
            });

            msgClusterListItemInfo[infoKey] = {
              itemName: infoKey,
              tableData: {
                records,
                size: 2,
                current: 1,
                total: records.length,
              },
              callCount: total_one_sum,
            };
          });

          dispatch(msgClusterStorage(msgClusterListItemInfo));
          setListItem(keys, msgClusterListItemInfo[keys[0]] ?? {});
        },
      },
    ],
    getChartOrTable: (tableData) => (
      <PubTable
        columns={[
          {
            title: 'API名称',
            dataIndex: 'apiName',
            key: 'apiName',
          },
          {
            title: '调用次数',
            dataIndex: 'callCount',
            key: 'callCount',
          },
          {
            title: '状态码',
            dataIndex: 'status',
            key: 'status',
          },
        ]}
        outerTableData={tableData}
        showSizeChanger={false}
      />
    ),
    rankType: 'callCount',
    runType: 'getMsgClusterRun',
    dataType: 'tableData',
  },
  successTimeConsume: {
    tab: '成功耗时',
    cartTitle: 'API成功耗时',
    radioOptions: [
      { label: '调用量(占比)排行', value: 'callRate' },
      { label: '平均成功耗时排行', value: 'averageDuration' },
    ],
    content: (listItemNames, listItemInfo, activeListItemInfo, handleListItemClick) => (
      <Aside
        listItemNames={listItemNames}
        listItemInfo={listItemInfo}
        activeListItemInfo={activeListItemInfo}
        handleListItemClick={handleListItemClick}
        getListItemRight={({ averageDuration, callRate, callCount }) => (
          <>
            <span css={{ fontWeight: 'bold' }}>
              {`${callCount}次`}
              {`(${callRate}%)`}
            </span>{' '}
            | {`${averageDuration}ms`}
          </>
        )}
      />
    ),
    getRequestConfig: (dispatch, setListItem, getSafeRate) => [
      getHttpSuccessTimeConsume,
      {
        manual: true,
        onSuccess(reqRes) {
          const { timeConsumeInfos: successTimeConsumeInfos, total } = reqRes.data;
          const keys = Object.keys(successTimeConsumeInfos);
          const successTimeConsumeListItemInfo: Record<string, ITabTimeConsumeItemInfo> = {};

          // 下面都是数据处理及转换格式
          keys.forEach((apiKey) => {
            const chartData: ITimeConsumeChartData[] = [];
            let callCount_sum = 0;
            let duration_sum = 0;

            Object.keys(successTimeConsumeInfos[apiKey]).forEach((time) => {
              const { callCount, duration } = successTimeConsumeInfos[apiKey][time];

              callCount_sum += callCount;
              duration_sum += duration;
              chartData.push({
                time,
                averageDuration: callCount === 0 ? 0 : Math.round(duration / callCount),
                callCount,
              });
            });

            successTimeConsumeListItemInfo[apiKey] = {
              itemName: apiKey,
              callRate: getSafeRate(callCount_sum, total),
              callCount: callCount_sum,
              averageDuration: Math.round(duration_sum / callCount_sum),
              chartData,
            };
          });

          dispatch(successTimeConsumeStorage(successTimeConsumeListItemInfo));
          setListItem(keys, successTimeConsumeListItemInfo[keys[0]] ?? {});
        },
      },
    ],
    getChartOrTable: (chartData) => (
      <DualAxes
        {...{
          ...getDefaultChartConfig(chartData),
          meta: {
            averageDuration: {
              alias: '成功耗时',
              formatter: (value: number) => `${value}ms`,
            },
            callCount: {
              alias: '调用次数',
            },
          },
          xField: 'time',
          yField: ['averageDuration', 'callCount'],
          yAxis: {
            averageDuration: {
              title: {
                text: '成功耗时',
              },
              min: 0,
              tickInterval: 200,
            },
            callCount: {
              title: {
                text: '调用次数',
              },
              min: 0,
              tickInterval: 1,
            },
          },
        }}
        height={230}
      />
    ),
    rankType: 'callRate',
    runType: 'getHttpSuccessTimeConsumeRun',
    dataType: 'chartData',
  },
  failTimeConsume: {
    tab: '失败耗时',
    cartTitle: 'API失败耗时',
    radioOptions: [
      { label: '调用量(占比)排行', value: 'callRate' },
      { label: '平均失败耗时排行', value: 'averageDuration' },
    ],
    content: (listItemNames, listItemInfo, activeListItemInfo, handleListItemClick) =>
      tabMap.successTimeConsume.content(listItemNames, listItemInfo, activeListItemInfo, handleListItemClick),
    getRequestConfig: (dispatch, setListItem, getSafeRate) => [
      getHttpFailTimeConsume,
      {
        manual: true,
        onSuccess(reqRes) {
          const { timeConsumeInfos: failTimeConsumeInfos, total } = reqRes.data;
          const keys = Object.keys(failTimeConsumeInfos);
          const failTimeConsumeListItemInfo: Record<string, ITabTimeConsumeItemInfo> = {};

          // 下面都是数据处理及转换格式
          keys.forEach((apiKey) => {
            const chartData: ITimeConsumeChartData[] = [];
            let callCount_sum = 0;
            let duration_sum = 0;

            Object.keys(failTimeConsumeInfos[apiKey]).forEach((time) => {
              const { callCount, duration } = failTimeConsumeInfos[apiKey][time];

              callCount_sum += callCount;
              duration_sum += duration;
              chartData.push({
                time,
                averageDuration: callCount === 0 ? 0 : Math.round(duration / callCount),
                callCount,
              });
            });

            failTimeConsumeListItemInfo[apiKey] = {
              itemName: apiKey,
              callRate: getSafeRate(callCount_sum, total),
              callCount: callCount_sum,
              averageDuration: Math.round(duration_sum / callCount_sum),
              chartData,
            };
          });

          dispatch(failTimeConsumeStorage(failTimeConsumeListItemInfo));
          setListItem(keys, failTimeConsumeListItemInfo[keys[0]] ?? {});
        },
      },
    ],
    getChartOrTable: (chartData) => (
      <DualAxes
        {...{
          ...getDefaultChartConfig(chartData),
          meta: {
            averageDuration: {
              alias: '失败耗时',
              formatter: (value: number) => `${value}ms`,
            },
            callCount: {
              alias: '调用次数',
            },
          },
          xField: 'time',
          yField: ['averageDuration', 'callCount'],
          yAxis: {
            averageDuration: {
              title: {
                text: '失败耗时',
              },
              min: 0,
              tickInterval: 200,
            },
            callCount: {
              title: {
                text: '调用次数',
              },
              min: 0,
              tickInterval: 1,
            },
          },
        }}
        height={230}
      />
    ),
    rankType: 'callRate',
    runType: 'getHttpFailTimeConsumeRun',
    dataType: 'chartData',
  },
};

export default tabMap;
