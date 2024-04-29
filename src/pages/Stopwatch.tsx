import { AnimatePresence, motion } from 'framer-motion'
import { StopwatchFooter } from '../components/StopwatchFooter'
import { StopwatchTimeView } from '../components/TimeView'
import { LapTimes } from '../components/LapTimes'
import { stopwatchMachine } from '../machines/stopwatch'
import { cn } from '../utils'
import { useMachine } from '../hooks/useMachine'

export function Stopwatch() {
  const [stopwatch, send] = useMachine(stopwatchMachine)
  const { laps, elapsed, lapElapsed } = stopwatch.context

  return (
    <div className="grid size-full grid-rows-[auto_80px]">
      <motion.main
        layout
        className={cn(
          'z-20 flex w-full flex-col items-center',
          laps.length > 0 ? 'place-self-center' : 'mt-[20svh]',
        )}
      >
        <StopwatchTimeView id="elapsed" time={elapsed} />
        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              exit={{ opacity: 0 }}
              className="w-80 text-center md:w-[23rem]"
            >
              <StopwatchTimeView
                id="lap-elapsed"
                time={lapElapsed}
                variant="secondary"
              />
              <LapTimes laps={laps} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
      <StopwatchFooter
        stopped={stopwatch.matches('stopped')}
        started={stopwatch.matches('started')}
        paused={stopwatch.matches('paused')}
        send={send}
      />
    </div>
  )
}
