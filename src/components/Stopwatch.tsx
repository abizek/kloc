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
        'text-[2.75rem] text-gray-800 sm:text-5xl sm:leading-normal md:text-6xl md:leading-normal dark:text-gray-200',
      secondary:
        'text-xl text-gray-600/90 sm:text-2xl md:text-[1.7rem] dark:text-gray-500',
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
