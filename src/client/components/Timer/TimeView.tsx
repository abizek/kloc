import { useContext } from 'react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { MachinePartyContext } from '../../providers/MachinePartyProvider'
import { cn, prefixZero } from '../../utils'
import { TimeView as TimeViewBase } from '../TimeView/TimeView'
import { DestinationPreview } from './DestinationPreview'

export function TimeView() {
  const { timer } = useContext(MachinePartyContext)
  const {
    context: { remaining: time, duration: maxValue, destination },
  } = timer
  const date = new Date(time)
  const [hh, mm, ss, ms] = [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    Math.floor(date.getUTCMilliseconds() / 10),
  ].map(prefixZero)

  return (
    <CircularProgressbarWithChildren
      value={time}
      maxValue={maxValue}
      classes={{
        root: 'size-full align-middle',
        background: '',
        path: cn(
          'stroke-indigo-500 stroke-[1.5px] transition-colors duration-500 [stroke-linecap:round] dark:stroke-indigo-900',
          date.getTime() < 5000 && 'stroke-red-500 dark:stroke-red-800',
        ),
        text: '',
        trail: 'stroke-gray-300/60 stroke-[0.5px] dark:stroke-gray-900',
      }}
    >
      <TimeViewBase id="timer">
        {hh !== '00' && `${hh} : `}
        {(hh !== '00' || mm !== '00') && `${mm} : `}
        {(hh !== '00' || mm !== '00' || ss !== '00') && `${ss} : `}
        {ms}
      </TimeViewBase>
      <DestinationPreview
        destination={destination}
        running={timer.matches('running')}
      />
    </CircularProgressbarWithChildren>
  )
}
