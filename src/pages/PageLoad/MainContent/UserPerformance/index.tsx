import type { FC, ReactElement } from 'react'
import OverallSatisfaction from './OverallSatisfaction'
import UserInteraction from './UserInteraction'
import RenderingMetrics from './RenderingMetrics'

const UserPerformance: FC = (): ReactElement => {
  return (
    <>
      <RenderingMetrics />
      <UserInteraction />
      <OverallSatisfaction />
    </>
  )
}

export default UserPerformance