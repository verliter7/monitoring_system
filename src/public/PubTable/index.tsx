/* @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Table } from 'antd';
import { useMount, useRequest } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import type { FC, ReactElement } from 'react';
import type { IBaseTable, IGetTableDataConfig, IPagination, ReduxTableType } from './type';

const PubTable: FC<IBaseTable> = ({ columns, getTableData, storage, reduxMark }): ReactElement => {
  const reduxData = useAppSelector((state) => (reduxMark ? state[reduxMark] : null));
  const dispatch = useAppDispatch();
  const [tableData, setTableData] = useState<Record<string, any>>({});
  const { loading, run: getTableDataRun } = useRequest(getTableData, {
    manual: true,
    onSuccess: (res) => {
      // 有传storage则缓存表格数据到redux上
      storage ? dispatch(storage(res.data as ReduxTableType)) : setTableData(res.data);
    },
  });
  const tableColumns: Record<string, any>[] = columns.map((column) => {
    const { width, dataIndex, title, render, ellipsis, ...rest } = column;
    const listStyle = () => ({
      style: { width: width ? width : 100, whiteSpace: 'nowrap' },
    });

    return {
      title,
      dataIndex,
      render,
      align: 'center',
      ellipsis,
      onCell: listStyle,
      ...rest,
    };
  });

  const onChange = (page: number, pageSize: number) => {
    updateTableData({
      current: page,
      size: pageSize,
    });
  };

  const updateTableData = async (config?: IGetTableDataConfig) => {
    const defaultConfig = { current: 1, size: 2, ...(config ?? {}) };

    getTableDataRun(defaultConfig);
  };

  // 显示目前位置
  const showTotal = () => {
    const { current, size, total } = reduxData ? reduxData.table : tableData;
    const start = (current - 1) * size + 1,
      tempEnd = current * size,
      end = tempEnd > total ? total : tempEnd;
    return `显示 第 ${end === 1 ? '1 ' : `${start} - ${end}`} 条 ， 共  ${total} 条`;
  };

  const pagination = (): IPagination => {
    const data = reduxData ? reduxData.table : tableData;

    return {
      position: ['bottomCenter'], // 分页器位置统一设置在bottomCenter
      total: data.total, // 数据总数
      current: data.current, // 当前页数，后台会默认第一页
      pageSize: data.size, // 每页条数
      showQuickJumper: true, //直接跳转到某一页
      showSizeChanger: true, //是否展示 pageSize 切换器
      onChange, // 页码改变的回调，参数是改变后的页码及每页条数
      showTotal, // 用于显示数据总量和当前数据顺序
    };
  };

  useMount(() => {
    storage ? reduxData?.table.records.length === 0 && updateTableData() : updateTableData();
  });

  return (
    <Table
      dataSource={(reduxData ? reduxData.table : tableData).records}
      columns={tableColumns}
      pagination={pagination()}
      loading={{ tip: '表格加载中...', spinning: loading, size: 'large' }}
      bordered
    />
  );
};

export default PubTable;
