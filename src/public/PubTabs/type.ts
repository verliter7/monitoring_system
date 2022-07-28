import type { ReactNode } from 'react';

export interface IProps {
  tabs: ITab[];
  onChange?: (activeKey: string) => void;
}

export interface ITab {
  title: string;
  middle: number;
  bottomCenter: number;
  unit: string;
  content?: ReactNode;
}
