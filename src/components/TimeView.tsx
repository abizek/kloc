import { VariantProps, cva } from 'class-variance-authority'
import { prefixZero } from '../utils'
import { motion } from 'framer-motion'

interface TimeViewProps extends VariantProps<typeof timeViewVariants> {
  time: number
  id: string
  currentTimeZone?: boolean
  hideMs?: boolean
}

const timeViewVariants = cva('tracking-tight', {
  variants: {
    variant: {
      default:
        'text-6xl leading-relaxed text-gray-800 md:text-7xl md:leading-relaxed dark:text-gray-50',
      secondary: 'text-3xl text-gray-600/90 md:text-[2rem] dark:text-gray-400',
      unstyled: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function TimeView({
  time,
  variant,
  id,
  currentTimeZone = false,
  hideMs = false,
}: TimeViewProps) {
  const date = new Date(time)
  let padding: number
  let hh: string, mm: string, ss: string, ms: string, amPm: string

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

  if (currentTimeZone) {
    let hours = date.getHours()
    amPm = hours < 12 ? 'AM' : 'PM'
    hours %= 12
    if (hours === 0) hours = 12
    hh = prefixZero(hours)
    ;[mm, ss, ms] = [
      date.getMinutes(),
      date.getSeconds(),
      Math.floor(date.getMilliseconds() / 10),
    ].map(prefixZero)
  } else {
    ;[hh, mm, ss, ms] = [
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      Math.floor(date.getUTCMilliseconds() / 10),
    ].map(prefixZero)
  }

  return (
    <motion.div
      data-cy={id}
      layout
      transition={{ duration: 0 }}
      className={timeViewVariants({ variant })}
    >
      {`${hh !== '00' ? `${hh} : ` : ''}${mm} : ${ss}${hideMs ? '' : ` . ${ms}`}`.replace(
        / /g,
        '\u00A0'.repeat(padding),
      )}
      {currentTimeZone && (
        <span className="text-xl md:text-3xl">
          {'\u00A0'.repeat(padding)}
          {amPm!}
        </span>
      )}
    </motion.div>
  )
}
