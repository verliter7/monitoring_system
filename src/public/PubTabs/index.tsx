/* @jsxImportSource @emotion/react */
import { Tabs } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { FC, ReactElement } from 'react';
import type { IProps } from './type';

const { TabPane } = Tabs;
const PubTabs: FC<IProps> = ({ tabs, onChange }): ReactElement => {
  const getTabTitle = (title: string, middle: number, bottomCenter: number, unit: string) => {
    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          '&>div': {
            width: '100%',
          },
        }}
      >
        <div css={{ color: 'rgb(78, 89, 105)', fontSize: '12px' }}>{title}</div>
        <div css={{ lineHeight: '40px', fontSize: '28px', fontWeight: 'bold' }}>{middle + unit}</div>
        <div
          css={{
            display: 'flex',
            WebkitBoxAlign: 'center',
            alignItems: 'center',
            color: 'rgb(139, 139, 166)',
            fontSize: '12px',
          }}
        >
          <span>前一周期</span>
          <span css={{ marginLeft: '4px' }}>{bottomCenter + unit}</span>
          <span
            css={{
              marginLeft: 'auto',
              color: bottomCenter > middle ? 'rgb(0, 180, 42)' : 'rgb(245, 63, 63)',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {bottomCenter === 0 ? null : (Math.abs((bottomCenter - middle) / bottomCenter) * 100).toFixed(2) + '%'}
            {bottomCenter === 0 ? null : bottomCenter > middle ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Tabs
      onChange={onChange}
      type="card"
      css={{
        '.ant-tabs-nav-wrap, .ant-tabs-nav-list': {
          width: '100%',
        },
        '.ant-tabs-tab': {
          flex: '1',
          '& > .ant-tabs-tab-btn': {
            width: '100%',
          },
        },
        '.ant-tabs-ink-bar, .ant-tabs-nav-operations': {
          display: 'none!important',
        },
      }}
    >
      {tabs.map(({ title, middle, bottomCenter, unit, content }) => (
        <TabPane tab={getTabTitle(title, middle, bottomCenter, unit)} key={title}>
          {content}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default PubTabs;
