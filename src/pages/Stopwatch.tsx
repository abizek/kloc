import { useMachine } from '@xstate/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '../components/Header'
import { StopwatchFooter } from '../components/StopwatchFooter'
import { TimeView } from '../components/TimeView'
import { LapTimes } from '../components/LapTimes'
import { stopwatchMachine } from '../stopwatchMachine'
import { cn } from '../utils'

export function Stopwatch() {
  const [stopwatch, send] = useMachine(stopwatchMachine)
  const { elapsed, lapElapsed, laps } = stopwatch.context

  return (
    <div className="grid size-full grid-rows-[48px_auto_80px]">
      <Header />
      <motion.main
        layout
        className={cn(
          'z-20 flex w-full flex-col items-center',
          laps.length > 0 ? 'place-self-center' : 'mt-[28svh]',
        )}
      >
        <TimeView id="elapsed" timeInMs={elapsed} />
        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              exit={{ opacity: 0 }}
              className="w-80 text-center md:w-[23rem]"
            >
              <TimeView
                id="lap-elapsed"
                timeInMs={lapElapsed}
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
