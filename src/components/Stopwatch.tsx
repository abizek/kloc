import { VariantProps, cva } from 'class-variance-authority'
import { formatTime } from '../utils'
import { motion } from 'framer-motion'

interface StopwatchProps extends VariantProps<typeof stopwatchVariants> {
  timeInMs: number
}

const stopwatchVariants = cva('tracking-tight', {
  variants: {
    variant: {
      default: 'text-[2.75rem] text-gray-800',
      secondary: 'text-xl text-gray-600/90',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function Stopwatch({ timeInMs, variant }: StopwatchProps) {
  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0 } }}
      className={stopwatchVariants({ variant })}
    >
      {formatTime(timeInMs, variant === 'secondary' ? 2 : 1)}
    </motion.div>
  )
}
