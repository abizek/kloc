import { useEffect, useState } from 'react'
import { TimeView } from '../components/TimeView'

export function Kloc() {
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now())
    }, 100)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="relative z-20 grid size-full place-items-center">
      <TimeView id="kloc" time={currentTime} currentTimeZone hideMs />
    </div>
  )
}
