/* @jsxImportSource @emotion/react */
import { useCallback, useRef, useState } from 'react';
import { Card, Radio, Spin, Tabs } from 'antd';
import SortIcon from './views/SortIcon';
import { useRequest, useCallbackState, useMount } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import tabMap from './tabMap';
import { sortEnum, ITab, tabKeyEnum, IRadioOption, RankType, Content } from './type';
import type { FC, ReactElement } from 'react';
import type { RadioChangeEvent } from 'antd';

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
    ...tabMap[tabKeyEnum.MC].getRequestConfig(dispatch, setListItem, getSafeRate),
  );
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

    setRadioValue(value, () => handleSortClick(sortTypeRef.current, value, activeKey));
  };
  // tab改变时触发
  const handleTabChange = (activeKey: string) => {
    const tabKey = activeKey as tabKeyEnum;
    const rankType = tabMap[tabKey].rankType;
    const keys = allListItemInfo[tabKey] ? Object.keys(allListItemInfo[tabKey]) : [];

    switch (tabKey) {
      case tabKeyEnum.SR:
        setRadioValue(rankType);
        setListItem(keys, allListItemInfo[tabKey][keys[0]]);
      case tabKeyEnum.MC:
        allListItemInfo[tabKey] ? setListItem(keys, allListItemInfo[tabKey][keys[0]]) : getMsgClusterRun();
        setRadioValue(rankType);
        break;
      default:
        break;
    }
    setActiveKey(activeKey as tabKeyEnum);
  };
  // 排序操作
  const handleSortClick = useCallback(
    (sortType: sortEnum, radioValue: RankType, activeKey: tabKeyEnum) => {
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

      setListItemNames(keys);
      setActiveListItemInfo(tabListItemInfo[keys[0]]);
    },
    [allListItemInfo],
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
      tab: (tabMap[tabKeyEnum.MC].tab as Content)(handleSortClick, radioValue, activeKey),
      key: tabKeyEnum.MC,
      content: getContent(tabKeyEnum.MC),
    },
    {
      tab: '成功耗时',
      key: tabKeyEnum.ST,
      content: tabMap[tabKeyEnum.ST].content(),
    },
    {
      tab: (tabMap[tabKeyEnum.FT].tab as Content)(handleSortClick, radioValue, activeKey),
      key: tabKeyEnum.FT,
      content: tabMap[tabKeyEnum.FT].content(),
    },
  ];

  useMount(getSuccessRateRun);

  return (
    <Spin spinning={successRateLoaing || msgClusterLoaing} tip="图表加载中..." size="large">
      <section css={{ position: 'relative', display: 'flex', gap: '20px', height: 'calc(100vh - 112px)' }}>
        <Card
          style={{ flexBasis: '420px' }}
          title={
            <div css={{ display: 'flex', justifyContent: 'space-between', height: '27px' }}>
              <span>API请求</span>
              <div css={{ display: activeKey === tabKeyEnum.SR || activeKey === tabKeyEnum.ST ? 'initial' : 'none' }}>
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
                  handleSortClick={(sortType) => handleSortClick(sortType, radioValue, activeKey)}
                  isVisible={activeKey === tabKeyEnum.SR || activeKey === tabKeyEnum.ST}
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
            justifyContent: 'space-between',
          }}
        >
          <Card title={tabMap[activeKey].cartTitle}>
            {(() => {
              const { getChartOrTable, dataType } = tabMap[activeKey];
              return getChartOrTable(activeListItemInfo[dataType] ?? []);
            })()}
          </Card>
          <Card title="API链路追踪" css={{ flex: '1' }}></Card>
        </main>
      </section>
    </Spin>
  );
};

export default HttpMonitor;
