import { useEffect, useState } from 'react'
import { TimeView } from '../components/TimeView'

export function Kloc() {
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now())
    }, 10)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return <TimeView id="kloc" timeInMs={currentTime} />
}
