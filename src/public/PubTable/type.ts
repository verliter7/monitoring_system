import { reducerEnum } from '@/redux/store';
import type { HttpReqDataType } from '@/utils/HttpReq/type';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import type { IResourcesErrorTableData } from '@/redux/resourceErrorSlice/type';

export interface IGetTableDataConfig {
  current: number; // 当前页
  size: number; // 当前页大小
}

export interface ITableData {
  records: Record<string, any>[]; // 表格数据
  size: number; // 当前页大小
  current: number; // 当前页
  total: number; // 页面数据总条数
}

export type ReduxTableType = IResourcesErrorTableData;

export type PaginationPosition = 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

export interface IBaseTable {
  columns: Record<string, any>[]; // 表格配置
  outerTableData?: ITableData; // 外面传入的表格数据
  getTableData?: (...params: any[]) => Promise<HttpReqDataType<ITableData>>; // 在表格内部获取数据
  storage?: ActionCreatorWithPayload<ReduxTableType, string>; // 是否dispatch到redux
  reduxMark?: reducerEnum; // redux标识
  showSizeChanger?: boolean; // 是否展示页码切换器
  position?: [PaginationPosition];
}

export interface IPagination {
  position: [PaginationPosition]; // 分页器位置
  total: number; // 页面数据总条数
  current: number; // 当前页
  pageSize: number; // 当前页大小
  showQuickJumper: boolean; // 是否可以快速跳转至某页
  showSizeChanger: boolean; // 是否展示 pageSize 切换器
  onChange: (page: number, pageSize: number) => void; // 页码或 pageSize 改变的回调
  showTotal: () => string; // 	用于显示数据总量和当前数据顺序
}

export interface IRender {
  text?: string | number;
  record: Record<string, any>;
  index: number;
}
