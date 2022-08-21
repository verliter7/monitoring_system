import type { FC, ReactElement } from 'react';
import { useState, useEffect } from 'react';
import MainContent from './MainContent'
import PubTapBar from './PubTapBar';

const PageLoad: FC = (): ReactElement => {

  return (
    <>
      {/* <PubTapBar /> */}
      <MainContent />
    </>
  )
};

export default PageLoad;
