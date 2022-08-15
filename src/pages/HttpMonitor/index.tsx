/* @jsxImportSource @emotion/react */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Empty, Radio, Tabs } from 'antd';
import PubTable from '@/public/PubTable';
import SortIcon from './views/SortIcon';
import { useRequest, useCallbackState, useMount, useUpdateEffect } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { tableStorage } from '@/redux/httpMonitorSlice';
import { reducerEnum } from '@/redux/store';
import tabMap from './tabMap';
import { getAllHttpInfos } from './service';
import { Eventemit, commonStyles } from '@/utils';
import { sortEnum, ITab, tabKeyEnum, RankType, Content, IHttpInfo } from './type';
import type { FC, ReactElement } from 'react';
import type { RadioChangeEvent } from 'antd';

const allHttpInfoTableColumns = [
  {
    title: '上报时间',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '请求耗时',
    dataIndex: 'duration',
    key: 'duration',
    sorter: (b: IHttpInfo, a: IHttpInfo) => parseInt(a.duration) - parseInt(b.duration),
  },
  {
    title: 'API',
    dataIndex: 'requestUrl',
    key: 'requestUrl',
  },
  {
    title: '页面',
    dataIndex: 'originUrl',
    key: 'originUrl',
  },
  {
    title: 'HTTP状态码',
    dataIndex: 'status',
    key: 'status',
    filters: [
      {
        text: '成功',
        value: 'success',
      },
      {
        text: '失败',
        value: 'fail',
      },
    ],
    onFilter: (value: string, record: IHttpInfo) =>
      value === 'success' ? record.status < 400 && record.status > 0 : !(record.status < 400 && record.status > 0),
  },
];
const HttpMonitor: FC = (): ReactElement => {
  const { allListItemInfo } = useAppSelector(
    (state) => state.httpMonitor,
    (pre, cur) => pre.allListItemInfo === cur.allListItemInfo,
  );
  const dispatch = useAppDispatch();
  // 用useRef缓存所有的item项信息
  const sortTypeRef = useRef<sortEnum>(sortEnum.DF);
  // 激活项item信息即要展示的item项信息
  const [activeListItemInfo, setActiveListItemInfo] = useState<Record<string, any>>({});
  // item项列表名字
  const [listItemNames, setListItemNames] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState(tabKeyEnum.SR);
  const [radioValue, setRadioValue] = useCallbackState<RankType>(tabMap[tabKeyEnum.SR].rankType);
  // 获得安全范围百分比，不会出现NaN、Infinity等
  const getSafeRate = (num1: number, num2: number) => (num2 === 0 ? 100 : Number(((num1 / num2) * 100).toFixed(2)));
  const setListItem = (keys: string[], item: Record<string, any>) => {
    setListItemNames(keys);
    setActiveListItemInfo(item);
  };
  const { loading: successRateLoaing, run: getSuccessRateRun } = useRequest(
    ...tabMap[tabKeyEnum.SR].getRequestConfig(dispatch, setListItem, getSafeRate),
  );
  const { loading: msgClusterLoaing, run: getMsgClusterRun } = useRequest(
    ...tabMap[tabKeyEnum.MC].getRequestConfig(dispatch, setListItem),
  );
  const { loading: successTimeConsumeLoaing, run: getSuccessTimeConsumeRun } = useRequest(
    ...tabMap[tabKeyEnum.ST].getRequestConfig(dispatch, setListItem, getSafeRate),
  );
  const { loading: failTimeConsumeLoaing, run: getFailTimeConsumeRun } = useRequest(
    ...tabMap[tabKeyEnum.FT].getRequestConfig(dispatch, setListItem, getSafeRate),
  );
  const runMap: Record<tabKeyEnum, (...params: any[]) => void> = {
    successRate: getSuccessRateRun,
    msgCluster: getMsgClusterRun,
    successTimeConsume: getSuccessTimeConsumeRun,
    failTimeConsume: getFailTimeConsumeRun,
  };
  // 点击列表项时调用
  const handleListItemClick = useCallback(
    (itemName: string) => {
      setActiveListItemInfo(allListItemInfo[activeKey][itemName]);
    },
    [allListItemInfo, activeKey],
  );
  // 调用量，成功率变化时触发
  const handleRadioChange = (e: RadioChangeEvent) => {
    const value = e.target.value;

    setRadioValue(value, () => handleSortClick(sortTypeRef.current, value, activeKey, allListItemInfo));
  };
  // tab改变时触发
  const handleTabChange = (activeKey: string) => {
    const tabKey = activeKey as tabKeyEnum;
    const { rankType } = tabMap[tabKey];

    allListItemInfo[tabKey]
      ? handleSortClick(sortTypeRef.current, rankType, tabKey, allListItemInfo)
      : runMap[tabKey]();
    setRadioValue(rankType);
    setActiveKey(activeKey as tabKeyEnum);
  };
  // 排序操作
  const handleSortClick = useCallback(
    (sortType: sortEnum, radioValue: RankType, activeKey: tabKeyEnum, allListItemInfo: Record<string, any>) => {
      const tabListItemInfo = allListItemInfo[activeKey];

      if (!tabListItemInfo) return;

      const keys = Object.keys(tabListItemInfo);

      sortTypeRef.current = sortType;
      switch (sortType) {
        case sortEnum.AC:
          keys.sort((b, a) => tabListItemInfo[a][radioValue]! - tabListItemInfo[b][radioValue]!);
          break;
        case sortEnum.DC:
          keys.sort((a, b) => tabListItemInfo[a][radioValue]! - tabListItemInfo[b][radioValue]!);
          break;
        default:
          break;
      }

      setListItem(keys, tabListItemInfo[keys[0]]);
    },
    [],
  );
  // 获取tab内容项
  const getContent = (tabKey: tabKeyEnum) => {
    return activeKey === tabKey
      ? tabMap[tabKey].content(listItemNames, allListItemInfo[activeKey], activeListItemInfo, handleListItemClick)
      : null;
  };
  const tabs: ITab[] = [
    {
      tab: '成功率',
      key: tabKeyEnum.SR,
      content: getContent(tabKeyEnum.SR),
    },
    {
      tab: (tabMap[tabKeyEnum.MC].tab as Content)(
        handleSortClick,
        sortTypeRef.current,
        radioValue,
        activeKey,
        allListItemInfo,
      ),
      key: tabKeyEnum.MC,
      content: getContent(tabKeyEnum.MC),
    },
    {
      tab: '成功耗时',
      key: tabKeyEnum.ST,
      content: getContent(tabKeyEnum.ST),
    },
    {
      tab: '失败耗时',
      key: tabKeyEnum.FT,
      content: getContent(tabKeyEnum.FT),
    },
  ];

  const initState = () => {
    const tabKey = activeKey as tabKeyEnum;

    handleSortClick(sortTypeRef.current, radioValue, tabKey, allListItemInfo);
  };

  const eventemitCb = (e: Event) => {
    const { allListItemInfo } = (e as CustomEvent).detail;

    for (const k in runMap) {
      const tabKey = k as tabKeyEnum;
      if (Object.prototype.hasOwnProperty.call(runMap, k) && allListItemInfo[tabKey]) {
        runMap[k as tabKeyEnum]();
      }
    }
  };

  useMount(allListItemInfo[tabKeyEnum.SR] ? initState : runMap[tabKeyEnum.SR]);

  useUpdateEffect(initState, [allListItemInfo]);

  useEffect(() => {
    Eventemit.addEventListener('HttpMonitor', eventemitCb);

    return () => {
      Eventemit.removeEventListener('HttpMonitor', eventemitCb);
    };
  }, []);

  const loading = successRateLoaing || msgClusterLoaing || successTimeConsumeLoaing || failTimeConsumeLoaing;

  return (
    <section
      css={{
        display: 'flex',
        gap: '20px',
        position: 'relative',
        height: 'calc(100vh - 112px)',
        ...commonStyles.scroll('Y'),
        overflowX: 'hidden',

        '& > .ant-card': {
          position: 'sticky',
          top: '0',
          width: '417px',
        },
      }}
    >
      <Card
        loading={loading}
        title={
          <div css={{ display: 'flex', justifyContent: 'space-between', height: '27px' }}>
            <span>API请求</span>
            <div
              css={{
                visibility:
                  // tabkey等于Msg聚类或者tab栏切换加载数据或者第一次载入页面加载数据时排序选项和按钮不可见
                  // 以防加载数据时点击出现不可控错误
                  activeKey === tabKeyEnum.MC || loading || allListItemInfo[tabKeyEnum.SR] === void 0
                    ? 'hidden'
                    : 'visible',
              }}
            >
              <Radio.Group
                options={tabMap[activeKey].radioOptions}
                onChange={handleRadioChange}
                value={radioValue}
                optionType="button"
                size="small"
              />
              <SortIcon
                sortType={sortTypeRef.current}
                handleSortClick={(sortType) => handleSortClick(sortType, radioValue, activeKey, allListItemInfo)}
                isVisible={activeKey !== tabKeyEnum.MC && !loading && allListItemInfo[tabKeyEnum.SR] !== void 0}
              />
            </div>
          </div>
        }
        bordered
      >
        <Tabs activeKey={activeKey} type="card" onChange={handleTabChange}>
          {tabs.map(({ tab, key, content }) => (
            <Tabs.TabPane tab={tab} key={key}>
              {content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>
      <main
        css={{
          display: 'flex',
          gap: '20px',
          flexDirection: 'column',
          flex: '1',
          justifyContent: 'space-between',
          width: 'calc(100% - 509px)',
        }}
      >
        <Card loading={loading} title={tabMap[activeKey].cartTitle} css={{ width: '100%' }}>
          {(() => {
            const { getChartOrTable, dataType } = tabMap[activeKey];

            return activeListItemInfo?.[dataType] ? (
              getChartOrTable(activeListItemInfo[dataType])
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            );
          })()}
        </Card>
        <Card
          title="API链路追踪"
          css={{
            flex: '1',
            width: '100%',
            '.ant-table-content': {
              ...commonStyles.scroll(),
            },
          }}
        >
          <PubTable
            getTableData={getAllHttpInfos}
            columns={allHttpInfoTableColumns}
            defaultPageSize={5}
            storage={tableStorage}
            reduxMark={reducerEnum.HM}
          />
        </Card>
      </main>
    </section>
  );
};

export default HttpMonitor;
