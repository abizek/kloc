import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Lap } from '../stopwatchMachine'
import { cn, formatTime, prefixZero } from '../utils'
import { ScrollArea } from './ScrollArea'

type LapTimesProps = {
  laps: Lap[]
}

export function LapTimes({ laps }: LapTimesProps) {
  const [showArrows, setShowArrows] = useState(true)

  const { minId = null, maxId = null } = useMemo(() => {
    if (laps.length > 2) {
      const lapElapsedList = laps.map(({ elapsed }) => elapsed)
      const min = Math.min(...lapElapsedList)
      const max = Math.max(...lapElapsedList)
      let minId: string, maxId: string

      laps.forEach(({ id, elapsed }) => {
        if (elapsed === min) minId = id
        else if (elapsed === max) maxId = id
      })

      return { minId: minId!, maxId: maxId! }
    }

    return {}
  }, [laps])

  useEffect(() => {
    setShowArrows(true)
    const timeoutId = setTimeout(() => {
      setShowArrows(false)
    }, 600)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [minId, maxId])

  return (
    <motion.div layout transition={{ duration: 0 }} className="mt-12">
      <div className="flex justify-between pl-6 text-xs font-medium tracking-tight text-gray-500/80 sm:text-sm md:text-base dark:text-gray-400">
        <span>Lap</span>
        <span>Lap times</span>
        <span className="pr-5">Overall time</span>
      </div>
      <div className="mx-2 mb-5 mt-3 h-px bg-gray-200 dark:bg-gray-700/70" />
      <ScrollArea className="h-[20svh] w-full text-gray-500 h-sm:h-[30svh] dark:text-gray-400">
        <div className="flex flex-col gap-4 px-6 text-sm sm:text-base md:text-lg">
          {laps.map(({ id, elapsed, overall }, index) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ layout: { duration: laps.length === 1 ? 0 : 0.3 } }}
              key={id}
              className="relative flex justify-between"
            >
              <AnimatePresence>
                {showArrows && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -translate-x-6 translate-y-1 md:translate-y-1.5"
                  >
                    {id === minId && (
                      <ArrowDown className="size-3 stroke-indigo-600 sm:size-3.5 md:size-4 dark:stroke-indigo-800 dark:stroke-[3]" />
                    )}
                    {id === maxId && (
                      <ArrowUp className="size-3 stroke-red-600 sm:size-3.5 md:size-4 dark:stroke-red-800 dark:stroke-[3]" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <span
                className={cn(
                  id === minId && 'text-indigo-600 dark:text-indigo-800',
                  id === maxId && 'text-red-600 dark:text-red-800',
                )}
              >
                {prefixZero(laps.length - index)}
              </span>
              <span>{formatTime(elapsed)}</span>
              <span className="text-gray-800 dark:text-gray-200">
                {formatTime(overall)}
              </span>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  )
}
