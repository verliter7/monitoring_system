/* @jsxImportSource @emotion/react */
import { memo, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { useUpdateEffect } from '@/hooks';
import { sortEnum } from '../type';
import type { FC, ReactElement } from 'react';

interface IProps {
  handleSortClick: (sortType: sortEnum) => void; // 排序按钮操作
  sortType?: sortEnum;
  isVisible?: boolean; // 排序按钮是否可见
}

export const sortTypeMap = {
  [sortEnum.DF]: {
    label: '点击升序',
    value: sortEnum.AC,
  },
  [sortEnum.AC]: {
    label: '点击降序',
    value: sortEnum.DC,
  },
  [sortEnum.DC]: {
    label: '取消排序',
    value: sortEnum.DF,
  },
};

const caretDefalutCssProperties = {
  display: 'inline-block',
  color: 'inherit',
  fontSize: '11px',
  fontStyle: 'normal',
  lineHeight: '0',
  textAlign: 'center',
  textTransform: 'none',
  verticalAlign: '-0.125em',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',

  '& > svg': {
    display: 'inline-block',
  },
};

// 排序图标组件
const SortIcon: FC<IProps> = ({ sortType = sortEnum.DF, handleSortClick, isVisible = true }): ReactElement => {
  const sortTypeRef = useRef<sortEnum>(sortType);
  const [label, setLabel] = useState(sortTypeMap[sortTypeRef.current].label);

  useUpdateEffect(() => {
    sortTypeRef.current = sortType;
  }, [sortType]);

  return (
    <Tooltip title={label}>
      <span
        css={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          verticalAlign: 'middle',
          fontSize: '0',
          cursor: 'pointer',
          visibility: isVisible ? 'visible' : 'hidden',
        }}
        onClick={() => {
          sortTypeRef.current = sortTypeMap[sortTypeRef.current].value;
          setLabel(sortTypeMap[sortTypeRef.current].label);
          handleSortClick(sortTypeRef.current);
        }}
      >
        <span
          role="img"
          aria-label="caret-up"
          // @ts-ignore
          css={{ ...caretDefalutCssProperties, color: sortType === sortEnum.AC ? '#177ddc' : '#bfbfbf' }}
        >
          <svg
            viewBox="0 0 1024 1024"
            focusable="false"
            data-icon="caret-up"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
          </svg>
        </span>
        <span
          role="img"
          aria-label="caret-down"
          // @ts-ignore
          css={{
            marginTop: '-0.3em',
            ...caretDefalutCssProperties,
            color: sortType === sortEnum.DC ? '#1890ff' : '#bfbfbf',
          }}
        >
          <svg
            viewBox="0 0 1024 1024"
            focusable="false"
            data-icon="caret-down"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
          </svg>
        </span>
      </span>
    </Tooltip>
  );
};

export default memo(SortIcon);
