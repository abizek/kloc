import { VariantProps } from 'class-variance-authority'
import { prefixZero } from '../../utils'
import { timeViewVariants } from './timeView.variants'
import { TimeView } from './TimeView'

interface TimerTimeViewProps extends VariantProps<typeof timeViewVariants> {
  time: number
}

export function TimerTimeView({ time }: TimerTimeViewProps) {
  const date = new Date(time)
  const [hh, mm, ss, ms] = [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    Math.floor(date.getUTCMilliseconds() / 10),
  ].map(prefixZero)

  return (
    <TimeView id="timer">
      {hh !== '00' && `${hh} : `}
      {(hh !== '00' || mm !== '00') && `${mm} : `}
      {(hh !== '00' || mm !== '00' || ss !== '00') && `${ss} : `}
      {ms}
    </TimeView>
  )
}
