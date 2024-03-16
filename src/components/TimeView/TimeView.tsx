import { VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { timeViewVariants } from './timeView.variants'

interface TimeViewProps extends VariantProps<typeof timeViewVariants> {
  id: string
  children: React.ReactNode
}

export function TimeView({ variant, id, children }: TimeViewProps) {
  return (
    <motion.div
      data-cy={id}
      layout
      transition={{ duration: 0 }}
      className={timeViewVariants({ variant })}
    >
      {children}
    </motion.div>
  )
}
