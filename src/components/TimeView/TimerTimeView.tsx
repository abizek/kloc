import { VariantProps } from 'class-variance-authority'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { cn, prefixZero } from '../../utils'
import { timeViewVariants } from './timeView.variants'
import { TimeView } from './TimeView'
import { TimerDestinationPreview } from '../TimerDestinationPreview'

interface TimerTimeViewProps extends VariantProps<typeof timeViewVariants> {
  time: number
  maxValue: number
  destination: number
  running: boolean
}

export function TimerTimeView({
  time,
  maxValue,
  destination,
  running,
}: TimerTimeViewProps) {
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
      <TimeView id="timer">
        {hh !== '00' && `${hh} : `}
        {(hh !== '00' || mm !== '00') && `${mm} : `}
        {(hh !== '00' || mm !== '00' || ss !== '00') && `${ss} : `}
        {ms}
      </TimeView>
      <TimerDestinationPreview destination={destination} running={running} />
    </CircularProgressbarWithChildren>
  )
}
