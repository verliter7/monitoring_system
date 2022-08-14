import { FC, ReactElement, useState, useEffect, createContext } from 'react'
import PerfBar from './PerfBar'
import PerfColumn from './PerfColumn'
import { useRequest } from '@/hooks';
import { getPerformanceData } from '../../service';
import { ITimingData } from './type';


export const DataContext = createContext<ITimingData[]>([]);
const TechnologyPerformance: FC = (): ReactElement => {
  const [timingData, setTimingData] = useState<ITimingData[]>([]);

  const { loading } = useRequest(() => getPerformanceData('timing'), {
    onSuccess(res) {
      setTimingData(res.data)
    },
  })

  return (
    <>
      <PerfColumn data={timingData} loading={loading} />
      <PerfBar data={timingData} loading={loading} />
    </>
  )
}

export default TechnologyPerformance


