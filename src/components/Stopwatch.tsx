import { VariantProps, cva } from 'class-variance-authority'
import { formatTime } from '../utils'
import { motion } from 'framer-motion'

interface StopwatchProps extends VariantProps<typeof stopwatchVariants> {
  timeInMs: number
}

const stopwatchVariants = cva('tracking-tight', {
  variants: {
    variant: {
      default:
        'text-6xl leading-relaxed text-gray-800 md:text-7xl md:leading-relaxed dark:text-gray-50',
      secondary: 'text-3xl text-gray-600/90 md:text-[2rem] dark:text-gray-400',
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
      transition={{ duration: 0 }}
      className={stopwatchVariants({ variant })}
    >
      {formatTime(timeInMs, variant === 'secondary' ? 2 : 1)}
    </motion.div>
  )
}
