import { VariantProps } from 'class-variance-authority'
import { prefixZero } from '../../utils'
import { timeViewVariants } from './timeView.variants'
import { TimeView } from './TimeView'

interface StopwatchTimeViewProps extends VariantProps<typeof timeViewVariants> {
  time: number
  id: string
}

export function StopwatchTimeView({
  time,
  variant,
  id,
}: StopwatchTimeViewProps) {
  let padding: number
  switch (variant) {
    case 'unstyled':
      padding = 0
      break
    case 'secondary':
      padding = 2
      break
    default:
      padding = 1
  }

  const date = new Date(time)
  const [hh, mm, ss, ms] = [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    Math.floor(date.getUTCMilliseconds() / 10),
  ].map(prefixZero)

  return (
    <TimeView id={id} variant={variant}>
      {`${hh !== '00' ? `${hh} : ` : ''}${mm} : ${ss} . ${ms}`.replace(
        / /g,
        '\u00A0'.repeat(padding),
      )}
    </TimeView>
  )
}
