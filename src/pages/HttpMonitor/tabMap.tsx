/* @jsxImportSource @emotion/react */
import { DualAxes } from '@ant-design/charts';
import PubTable from '@/public/PubTable';
import Aside from './views/Aside';
import SortIcon from './views/SortIcon';
import { getHttpMsgCluster, getHttpSuccessRate } from './service';
import { getRandomStr } from '@/utils';
import { msgClusterStorage, successRateStorage } from '@/redux/httpMonitorSlice';
import {
  ITabMap,
  tabKeyEnum,
  ISuccessRateChartData,
  IApiListInfo,
  ITabSuccessRateItemInfo,
  ITabMsgClusterItemInfo,
} from './type';

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
          theme: 'dark',
          meta: {
            successRate: {
              alias: '成功率',
              formatter: (value: number) => `${value}%`,
            },
            callCount: {
              alias: '调用次数',
            },
          },
          data: [chartData, chartData],
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
              tickInterval: 5,
            },
          },
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
    dataType: 'chartData',
  },
  msgCluster: {
    tab: (handleSortClick, radioValue, activeKey) => (
      <div css={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <span>Msg聚类</span>
        <SortIcon
          handleSortClick={(sortType) => handleSortClick(sortType, radioValue, activeKey)}
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
            const records: IApiListInfo[] = [];

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
              apiListInfo: {
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
    dataType: 'apiListInfo',
  },
  successTimeConsume: {
    tab: '成功耗时',
    cartTitle: 'API成功耗时',
    radioOptions: [
      { label: '调用量(占比)排行', value: 'callRate' },
      { label: '成功率耗时排行', value: 'successRate' },
    ],
    content: () => '成功耗时',
    getRequestConfig: (dispatch, setListItemNames, setActiveListItemInfo, getSafeRate) => [
      getHttpMsgCluster,
      {
        manual: true,
        onSuccess(reqRes) {},
      },
    ],
    getChartOrTable: () => <div></div>,
    rankType: 'callRate',
    dataType: 'chartData',
  },
  failTimeConsume: {
    tab: (handleSortClick, radioValue, activeKey) => (
      <div css={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <span>失败耗时</span>
        <SortIcon
          handleSortClick={(e) => handleSortClick(e, radioValue, activeKey)}
          isVisible={activeKey === tabKeyEnum.FT}
        />
      </div>
    ),
    cartTitle: 'API失败耗时',
    content: () => '失败耗时',
    getRequestConfig: (dispatch, setListItemNames, setActiveListItemInfo, getSafeRate) => [
      getHttpSuccessRate,
      {
        onSuccess(reqRes) {},
      },
    ],
    getChartOrTable: () => <div></div>,
    rankType: 'failTimeConsume',
    dataType: 'chartData',
  },
};

export default tabMap;
