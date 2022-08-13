/* @jsxImportSource @emotion/react */
import { memo } from 'react';
import { List } from 'antd';
import { commonStyles } from '@/utils';
import type { FC, ReactElement, ReactNode } from 'react';

interface IProps {
  listItemNames: string[]; // 列表名称
  listItemInfo: Record<string, any>; // 列表项信息
  activeListItemInfo: Record<string, any>; // 选中的列表项信息
  handleListItemClick: (activeListItem: string) => void; // 列表项点击回调
  getListItemRight: (...args: any[]) => ReactNode;
}

// 用来展示API调用率、成功率、耗时等信息的组件
const Aside: FC<IProps> = ({
  listItemNames,
  listItemInfo,
  activeListItemInfo,
  handleListItemClick,
  getListItemRight,
}): ReactElement => {
  return (
    <List
      size="small"
      dataSource={listItemInfo ? listItemNames : []}
      renderItem={(item: string) => {
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
            onClick={() => handleListItemClick(item)}
          >
            <div
              // @ts-ignore
              css={{ width: '49%', ...commonStyles.ellipsis }}
              title={item}
            >
              {item}
            </div>
            <div css={{ width: '49%', textAlign: 'right' }}>{getListItemRight(listItemInfo[item] ?? {})}</div>
          </List.Item>
        );
      }}
    />
  );
};

export default memo(Aside);
