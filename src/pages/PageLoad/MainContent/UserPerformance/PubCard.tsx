/* @jsxImportSource @emotion/react */
import type { FC, ReactElement } from 'react'
import { useState } from 'react';

// import { css } from '@emotion/react'
import type { RadioChangeEvent } from 'antd';
import { Radio, Card } from 'antd';



const PubCard: FC = (): ReactElement => {

  const [current, setCurrent] = useState()

  const onChange = (e: RadioChangeEvent) => {

  }


  const cardarr = [
    {
      type: "FP",
      content: <></>,
    },
    {},
  ]
  const renderCard = () => {

  }



  return (
    <>
      <Radio.Group onChange={onChange} defaultValue="a">
        <Radio.Button value="a">Hangzhou</Radio.Button>
        <Radio.Button value="b">Shanghai</Radio.Button>
        <Radio.Button value="c">Beijing</Radio.Button>
        <Radio.Button value="d">Chengdu</Radio.Button>
      </Radio.Group>

    </>
  )
}

export default PubCard