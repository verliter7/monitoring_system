/* @jsxImportSource @emotion/react */
import { memo } from 'react';
import { Card, Select } from 'antd';
import type { FC, ReactElement } from 'react';
import type { DefaultOptionType } from 'antd/lib/select';

interface IProps {
  handleSelectChange: (value: string, option: DefaultOptionType | DefaultOptionType[]) => void;
  pastDays: string;
}

const PubHeader: FC<IProps> = ({ handleSelectChange, pastDays }): ReactElement => {
  return (
    <Card css={{ display: 'flex', gap: '10px' }}>
      <span>过去时间：</span>
      <Select style={{ width: 120 }} onChange={handleSelectChange} value={pastDays}>
        <Select.Option value="1">1天</Select.Option>
        <Select.Option value="2">2天</Select.Option>
        <Select.Option value="7">7天</Select.Option>
      </Select>
    </Card>
  );
};

export default memo(PubHeader);
