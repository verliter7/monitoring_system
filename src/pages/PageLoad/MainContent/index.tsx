import type { FC, ReactElement } from 'react';
import { useState, useEffect } from 'react';

import UserPerformance from './UserPerformance'
import TechnologyPerformance from './TechnologyPerformance'

import { Tabs } from 'antd';

const { TabPane } = Tabs;

const MainContent: FC = (): ReactElement => {

  //选项卡配置
  const tabPaneComponents = [
    {
      key: 1,
      tab: '真实用户性能指标',
      forceRender: false,
      component: <UserPerformance />
    }, {
      key: 2,
      tab: '页面技术性能指标',
      forceRender: false,
      component: <TechnologyPerformance />
    }, {
      key: 3,
      tab: '慢加载列表',
      forceRender: false,
      component: 'content'
    }, {
      key: 4,
      tab: '多维分析',
      forceRender: false,
      component: 'content'
    }
  ]

  const renderTabContent = () => {
    return tabPaneComponents.map((tab) => {
      return (
        <TabPane tab={tab.tab} key={tab.key} forceRender={tab.forceRender}>
          {tab.component}
        </TabPane>
      )
    })
  }

  return (
    <Tabs>
      {renderTabContent()}
    </Tabs>
  )
}

export default MainContent
