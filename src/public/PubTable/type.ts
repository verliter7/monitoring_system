import { tableTypeEnum } from '@/redux/tableSlice/type';
import type { HttpReqDataType } from '@/utils/HttpReq/type';

export interface IGetTableDataConfig {
  current: number;
  size: number;
}

export interface ITableData {
  records: Record<string, any>[];
  size: number;
  current: number;
  total: number;
}

export interface IBaseTable {
  columns: Record<string, any>[];
  getTableData: (...params: any[]) => Promise<HttpReqDataType<ITableData>>;
  type: tableTypeEnum;
  selectType?: 'checkbox' | 'radio';
  tableParentClassName?: string;
  tableClassName?: string;
  tableHeight?: number;
}

export interface IPagination {
  position: ['bottomCenter'];
  total: number;
  current: number;
  pageSize: number;
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  onChange: (page: number, pageSize: number) => void;
  showTotal: () => string;
}

export interface IRender {
  text?: string | number;
  record: Record<string, any>;
  index: number;
}
