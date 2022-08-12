/* @jsxImportSource @emotion/react */
import { useCallback, useRef, useState } from 'react';
import { Card, Radio, Spin, Tabs } from 'antd';
import PubTable from '@/public/PubTable';
import SortIcon from './views/SortIcon';
import { useRequest, useCallbackState, useMount, useUpdateEffect } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { tableStorage } from '@/redux/httpMonitorSlice';
import { reducerEnum } from '@/redux/store';
import tabMap from './tabMap';
import { getAllHttpInfos } from './service';
import { commonStyles } from '@/utils';
import { sortEnum, ITab, tabKeyEnum, IRadioOption, RankType, Content, IHttpInfo } from './type';
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
  const allListItemInfo = useAppSelector((state) => state.httpMonitor);
  const dispatch = useAppDispatch();
  // 用useRef缓存所有的item项信息
  const sortTypeRef = useRef<sortEnum>(sortEnum.DF);
  // 激活项item信息即要展示的item项信息
  const [activeListItemInfo, setActiveListItemInfo] = useState<Record<string, any>>({});
  // item项列表名字
  const [listItemNames, setListItemNames] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState(tabKeyEnum.SR);
  const [radioValue, setRadioValue] = useCallbackState<RankType>(
    (tabMap[tabKeyEnum.SR].radioOptions as IRadioOption[])[0].value,
  );
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
  const { loading: successTimeConsumeLoaing, run: getHttpSuccessTimeConsumeRun } = useRequest(
    ...tabMap[tabKeyEnum.ST].getRequestConfig(dispatch, setListItem, getSafeRate),
  );
  const { loading: failTimeConsumeLoaing, run: getHttpFailTimeConsumeRun } = useRequest(
    ...tabMap[tabKeyEnum.FT].getRequestConfig(dispatch, setListItem, getSafeRate),
  );
  const runMap = {
    getSuccessRateRun,
    getMsgClusterRun,
    getHttpSuccessTimeConsumeRun,
    getHttpFailTimeConsumeRun,
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
    const { rankType, runType } = tabMap[tabKey];

    allListItemInfo[tabKey]
      ? handleSortClick(sortTypeRef.current, rankType, tabKey, allListItemInfo)
      : runMap[runType]();
    setRadioValue(rankType);
    setActiveKey(activeKey as tabKeyEnum);
  };
  // 排序操作
  const handleSortClick = useCallback(
    (sortType: sortEnum, radioValue: RankType, activeKey: tabKeyEnum, allListItemInfo: Record<string, any>) => {
      const tabListItemInfo = allListItemInfo[activeKey];
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
    const { rankType } = tabMap[tabKey];

    handleSortClick(sortTypeRef.current, rankType, tabKey, allListItemInfo);
  };

  useMount(allListItemInfo[tabKeyEnum.SR] ? initState : runMap[tabMap[tabKeyEnum.SR].runType]);

  useUpdateEffect(initState, [allListItemInfo]);

  return (
    <Spin
      spinning={successRateLoaing || msgClusterLoaing || successTimeConsumeLoaing || failTimeConsumeLoaing}
      tip="图表加载中..."
      size="large"
    >
      <section
        css={{
          position: 'relative',
          display: 'flex',
          gap: '20px',
          height: 'calc(100% - 112px)',
        }}
      >
        <Card
          css={{ width: '417px' }}
          title={
            <div css={{ display: 'flex', justifyContent: 'space-between', height: '27px' }}>
              <span>API请求</span>
              <div css={{ display: activeKey === tabKeyEnum.MC ? 'none' : 'initial' }}>
                <Radio.Group
                  options={tabMap[activeKey].radioOptions}
                  onChange={handleRadioChange}
                  value={radioValue}
                  optionType="button"
                  size="small"
                  css={{
                    '&>.ant-radio-button-wrapper': {
                      border: 'none',
                      '&:first-of-type': {
                        borderLeft: 'none',
                      },
                      '&:not(:first-of-type)::before': {
                        backgroundColor: '#434343!important',
                      },
                    },
                  }}
                />
                <SortIcon
                  sortType={sortTypeRef.current}
                  handleSortClick={(sortType) => handleSortClick(sortType, radioValue, activeKey, allListItemInfo)}
                  isVisible={activeKey !== tabKeyEnum.MC}
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
            height: '100%',
            width: 'calc(100% - 509px)',
            justifyContent: 'space-between',
          }}
        >
          <Card title={tabMap[activeKey].cartTitle} css={{ width: '100%' }}>
            {(() => {
              const { getChartOrTable, dataType } = tabMap[activeKey];
              return getChartOrTable(activeListItemInfo[dataType] ?? []);
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
    </Spin>
  );
};

export default HttpMonitor;
