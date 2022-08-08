/* @jsxImportSource @emotion/react */
import { useRef, useState } from 'react';
import { Card, List, Radio, Spin, Tabs } from 'antd';
import HttpChart from './HttpChart';
import { useRequest, useCallbackState } from '@/hooks';
import { getHttpSuccessRate } from './service';
import SortIcon from './SortIcon';
import { commonStyles } from '@/utils';
import {
  sortEnum,
  ITab,
  TabKeyType,
  ISuccessRateChartData,
  IActiveListItemInfo,
  IRadioOptions,
  RankType,
} from './type';
import type { FC, ReactElement } from 'react';
import type { RadioChangeEvent } from 'antd';

const radioOptions: IRadioOptions[] = [
  { label: '调用量(占比)排行', value: 'callRate' },
  { label: '成功率排行', value: 'successRate' },
];

const HttpMonitor: FC = (): ReactElement => {
  // 用useRef缓存所有的item项信息
  const allListItemInfoRef = useRef<Record<string, IActiveListItemInfo>>({});
  const sortTypeRef = useRef<sortEnum>(sortEnum.DF);
  // 激活项item信息即要展示的item项信息
  const [activeListItemInfo, setActiveListItemInfo] = useState<IActiveListItemInfo>({} as IActiveListItemInfo);
  const [listItemNames, setListItemNames] = useState<string[]>([]);
  const getSafeRate = (num1: number, num2: number) => (num2 === 0 ? 100 : Number(((num1 / num2) * 100).toFixed(2)));
  const { loading: SuccessRateLoaing } = useRequest(getHttpSuccessRate, {
    onSuccess(res) {
      const { successRateInfos, total } = res.data;

      // 下面都是数据处理及转换格式
      Object.keys(successRateInfos).forEach((itemKey) => {
        const chartData: ISuccessRateChartData[] = [];
        let successTotal_one_sum = 0;
        let total_one_sum = 0;

        Object.keys(successRateInfos[itemKey]).forEach((time) => {
          const [successTotal_one, total_one] = successRateInfos[itemKey][time];

          successTotal_one_sum += successTotal_one;
          total_one_sum += total_one;
          chartData.push({
            time,
            successRate: getSafeRate(successTotal_one, total_one),
            callCount: total_one,
          });
        });

        allListItemInfoRef.current[itemKey] = {
          itemName: itemKey,
          successRate: getSafeRate(successTotal_one_sum, total_one_sum),
          callRate: getSafeRate(total_one_sum, total),
          callCount: total_one_sum,
          chartData,
        };
      });

      setListItemNames(Object.keys(allListItemInfoRef.current));
      setActiveListItemInfo(allListItemInfoRef.current[Object.keys(successRateInfos)[0]] ?? {});
    },
  });
  const tabs: ITab[] = [
    {
      tab: '成功率',
      key: 'successRate',
      content: (
        <List
          size="small"
          dataSource={listItemNames}
          renderItem={(item: string) => {
            const { successRate, callRate, callCount } = allListItemInfoRef.current[item];

            return (
              <List.Item
                css={{
                  '&.ant-list-item': {
                    color: item === activeListItemInfo.itemName ? '#177ddc' : void 0,
                    cursor: 'pointer',
                  },
                  '&:hover':
                    item === activeListItemInfo.itemName
                      ? null
                      : {
                          color: '#165996',
                          transition: 'color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
                        },
                }}
                onClick={() => {
                  handleListItemClick(item);
                }}
              >
                <div
                  //  @ts-ignore
                  css={{ width: '49%', ...commonStyles.ellipsis }}
                  title={item}
                >
                  {item}
                </div>
                <div css={{ width: '49%', textAlign: 'right' }}>
                  <span css={{ fontWeight: 'bold' }}>
                    {`${callCount}次`}
                    {`(${callRate}%)`}
                  </span>{' '}
                  | {`${successRate}%`}
                </div>
              </List.Item>
            );
          }}
        />
      ),
    },
    {
      tab: 'Msg聚类',
      key: 'msgCluster',
    },
    {
      tab: '成功耗时',
      key: 'successTimeConsume',
    },
    {
      tab: '失败耗时',
      key: 'failTimeConsume',
    },
  ];

  const [radioValue, setRadioValue] = useCallbackState<RankType>(radioOptions[0].value);
  const [activeKey, setActiveKey] = useState(tabs[0].key);

  // 调用量，成功率变化时触发
  const handleRadioChange = (e: RadioChangeEvent) => {
    const value = e.target.value;

    setRadioValue(value, () => handleSortClick(sortTypeRef.current, value));
  };

  // tab改变时触发
  const handleTabChange = (activeKey: string) => {
    setActiveKey(activeKey as TabKeyType);
  };

  // 排序操作
  const handleSortClick = (sortType: sortEnum, radioValue: RankType) => {
    const allListItemInfo = allListItemInfoRef.current;
    const keys = Object.keys(allListItemInfo);

    sortTypeRef.current = sortType;
    switch (sortType) {
      case sortEnum.AC:
        keys.sort((b, a) => allListItemInfo[a][radioValue]! - allListItemInfo[b][radioValue]!);
        break;
      case sortEnum.DC:
        keys.sort((a, b) => allListItemInfo[a][radioValue]! - allListItemInfo[b][radioValue]!);
        break;
      default:
        break;
    }

    setListItemNames(keys);
    setActiveListItemInfo(allListItemInfoRef.current[keys[0]]);
  };

  const handleListItemClick = (activeListItem: string) => {
    setActiveListItemInfo(allListItemInfoRef.current[activeListItem]);
  };

  return (
    <Spin spinning={SuccessRateLoaing} tip="图表加载中..." size="large">
      <section css={{ display: 'flex', gap: '20px', height: 'calc(100vh - 112px)' }}>
        <Card
          style={{ flexBasis: '400px' }}
          title={
            <div css={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>API请求</span>
              <div>
                <Radio.Group
                  options={radioOptions}
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
                  handleSortClick={(e) => {
                    handleSortClick(e, radioValue);
                  }}
                />
              </div>
            </div>
          }
          bordered
          actions={[]}
        >
          <Tabs activeKey={activeKey} type="card" onChange={handleTabChange}>
            {tabs.map(({ tab, key, content }) => (
              <Tabs.TabPane tab={tab} key={key}>
                {content}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Card>
        <main css={{ flex: '1' }}>
          <Card title="API成功率">
            <HttpChart activeListItemInfo={activeListItemInfo} />
          </Card>
        </main>
      </section>
    </Spin>
  );
};

export default HttpMonitor;
