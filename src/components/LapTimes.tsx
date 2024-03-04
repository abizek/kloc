import { Lap } from '../stopwatchMachine'
import { formatTime, prefixZero } from '../utils'
import { ScrollArea } from './ScrollArea'

type LapTimesProps = {
  laps: Lap[]
}

export function LapTimes({ laps }: LapTimesProps) {
  return (
    <div className="mt-12">
      <div className="flex justify-between pl-4 text-xs font-medium tracking-tight text-gray-500/80">
        <span>Lap</span>
        <span>Lap times</span>
        <span className="pr-3">Overall time</span>
      </div>
      <div className="mb-5 mt-3 h-px bg-gray-200" />
      <ScrollArea className="h-[30svh] w-64 text-gray-500">
        <div className="flex flex-col gap-4 px-4 text-sm">
          {laps.map(({ id, elapsed, overall }, index) => (
            <div key={id} className="flex justify-between">
              <span>{prefixZero(laps.length - index)}</span>
              <span>{formatTime(elapsed)}</span>
              <span className="text-gray-800">{formatTime(overall)}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
