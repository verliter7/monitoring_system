/* @jsxImportSource @emotion/react */
import { memo, useRef, useState } from 'react';
import { Table } from 'antd';
import { useMount } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import type { FC, ReactElement } from 'react';
import type { IBaseTable, IGetTableDataConfig, IPagination, ITableData } from './type';

const PubTable: FC<IBaseTable> = ({
  columns,
  getTableData,
  storage,
  reduxMark,
  outerTableData = {} as ITableData,
  showSizeChanger = true,
  position = ['bottomCenter'],
  defaultPageSize = 2,
}): ReactElement => {
  const { table: reduxTableData } = useAppSelector((state) => (reduxMark ? state[reduxMark] : ({} as any)));
  const dispatch = useAppDispatch();
  const [tableData, setTableData] = useState<ITableData>();
  const [loading, setLoading] = useState(false);
  const outerTableDataRef = useRef<ITableData>();

  outerTableDataRef.current = outerTableData;

  // 最终的表格数据 表格数据有三个类别 外面传入 | 里面异步获取不传到redux | 里面异步获取传到redux
  const finalTableData: ITableData = reduxTableData ? reduxTableData : tableData ? tableData : outerTableData;
  // 获取表格配置
  const tableColumns: Record<string, any>[] = columns.map((column) => {
    const { width, ...rest } = column;
    const listStyle = () => ({
      style: { width: width ? width : 100, whiteSpace: 'nowrap' },
    });

    return {
      align: 'center',
      onHeaderCell: listStyle,
      onCell: listStyle,
      ...rest,
    };
  });

  // 页码切换后触发
  const onChange = (page: number, pageSize: number) => {
    getTableData
      ? updateTableData({
          current: page,
          size: pageSize,
        })
      : setTableData({
          current: page,
          size: pageSize,
          records: outerTableDataRef.current?.records?.slice((page - 1) * pageSize, page * pageSize) ?? [],
          total: (outerTableDataRef.current?.total as number) ?? 0,
        });
  };

  // 页码切换后更新表格数据
  const updateTableData = async (config?: IGetTableDataConfig) => {
    setLoading(true);

    const defaultConfig = { current: 1, size: defaultPageSize, ...(config ?? {}) };
    try {
      const res = await getTableData!(defaultConfig);

      // storage代表是否把表格数据缓存到redux上
      storage ? dispatch(storage(res.data)) : setTableData(res.data);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  // 显示目前位置
  const showTotal = () => {
    const { current, size, total } = finalTableData;
    const start = (current - 1) * size + 1,
      tempEnd = current * size,
      end = tempEnd > total ? total : tempEnd;
    return `显示 第 ${end === 1 ? '1 ' : `${start} - ${end}`} 条 ， 共  ${total} 条`;
  };

  const pagination: IPagination = {
    position, // 分页器位置统一设置在bottomCenter
    total: finalTableData.total, // 数据总数
    current: finalTableData.current, // 当前页数，后台会默认第一页
    pageSize: finalTableData.size, // 每页条数
    showQuickJumper: true, //直接跳转到某一页
    showSizeChanger, //是否展示 pageSize 切换器
    onChange, // 页码改变的回调，参数是改变后的页码及每页条数
    showTotal, // 用于显示数据总量和当前数据顺序
  };

  useMount(() => {
    // 有传getTableData就在表格组件里面请求数据，没有就在外面传入表格数据
    // reduxTableData.records.length判断redux是否有表格数据
    getTableData && !reduxTableData.records.length && updateTableData();
  });

  return (
    <Table
      scroll={{ x: 'max-content' }}
      dataSource={finalTableData.records}
      columns={tableColumns}
      pagination={pagination}
      loading={{ tip: '加载中...', spinning: loading, size: 'large' }}
      bordered
    />
  );
};

export default memo(PubTable);
