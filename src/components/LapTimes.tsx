import { motion } from 'framer-motion'
import { Lap } from '../stopwatchMachine'
import { formatTime, prefixZero } from '../utils'
import { ScrollArea } from './ScrollArea'

type LapTimesProps = {
  laps: Lap[]
}

export function LapTimes({ laps }: LapTimesProps) {
  return (
    <motion.div layout transition={{ duration: 0 }} className="mt-12">
      <div className="flex justify-between pl-4 text-xs font-medium tracking-tight text-gray-500/80 sm:text-sm md:text-base">
        <span>Lap</span>
        <span>Lap times</span>
        <span className="pr-3">Overall time</span>
      </div>
      <div className="mb-5 mt-3 h-px bg-gray-200" />
      <ScrollArea className="h-[20svh] w-full text-gray-500 h-sm:h-[30svh]">
        <div className="flex flex-col gap-4 px-4 text-sm sm:text-base md:text-lg">
          {laps.map(({ id, elapsed, overall }, index) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ layout: { duration: laps.length === 1 ? 0 : 0.3 } }}
              key={id}
              className="flex justify-between"
            >
              <span>{prefixZero(laps.length - index)}</span>
              <span>{formatTime(elapsed)}</span>
              <span className="text-gray-800">{formatTime(overall)}</span>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  )
}
