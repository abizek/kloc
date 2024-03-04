import { VariantProps, cva } from 'class-variance-authority'
import { formatTime } from '../utils'

interface StopwatchProps extends VariantProps<typeof stopwatchVariants> {
  timeInMs: number
}

const stopwatchVariants = cva('tracking-tight', {
  variants: {
    variant: {
      default: 'text-[2.75rem] leading-snug text-gray-800',
      secondary: 'text-xl text-gray-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function Stopwatch({ timeInMs, variant }: StopwatchProps) {
  return (
    <div className={stopwatchVariants({ variant })}>
      {formatTime(timeInMs, variant === 'secondary' ? 2 : 1)}
    </div>
  )
}
