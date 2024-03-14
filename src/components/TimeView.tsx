import { VariantProps, cva } from 'class-variance-authority'
import { formatTime } from '../utils'
import { motion } from 'framer-motion'

interface TimeViewProps extends VariantProps<typeof timeViewVariants> {
  timeInMs: number
  id: string
}

const timeViewVariants = cva('tracking-tight', {
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

export function TimeView({ timeInMs, variant, id }: TimeViewProps) {
  return (
    <motion.div
      data-cy={id}
      layout
      transition={{ duration: 0 }}
      className={timeViewVariants({ variant })}
    >
      {formatTime(timeInMs, variant === 'secondary' ? 2 : 1)}
    </motion.div>
  )
}
