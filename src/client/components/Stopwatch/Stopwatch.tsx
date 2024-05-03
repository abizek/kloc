import { AnimatePresence, motion } from 'framer-motion'
import { Footer } from './Footer'
import { TimeView } from './TimeView'
import { LapTimes } from './LapTimes'
import { stopwatchMachine } from '../../machines/stopwatch'
import { cn } from '../../utils'
import { useMachine } from '../../hooks/useMachine'

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
        <TimeView id="elapsed" time={elapsed} />
        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              exit={{ opacity: 0 }}
              className="w-80 text-center md:w-[23rem]"
            >
              <TimeView
                id="lap-elapsed"
                time={lapElapsed}
                variant="secondary"
              />
              <LapTimes laps={laps} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
      <Footer
        stopped={stopwatch.matches('stopped')}
        started={stopwatch.matches('started')}
        paused={stopwatch.matches('paused')}
        send={send}
      />
    </div>
  )
}
