import { VariantProps } from 'class-variance-authority'
import { cn, prefixZero } from '../../utils'
import { timeViewVariants } from './timeView.variants'
import { TimeView } from './TimeView'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'

interface TimerTimeViewProps extends VariantProps<typeof timeViewVariants> {
  time: number
  maxValue: number
}

export function TimerTimeView({ time, maxValue }: TimerTimeViewProps) {
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
          'stroke-indigo-500 stroke-[1.5px] transition-colors duration-700 [stroke-linecap:round] dark:stroke-indigo-900',
          +ss <= 4 && 'stroke-red-500 dark:stroke-red-800',
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
    </CircularProgressbarWithChildren>
  )
}
