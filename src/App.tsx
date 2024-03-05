import { useMachine } from '@xstate/react'
import { AnimatePresence, motion } from 'framer-motion'
import { stopwatchMachine } from './stopwatchMachine'
import { Button } from './components/Button'
import { Stopwatch } from './components/Stopwatch'
import { LapTimes } from './components/LapTimes'
import { cn } from './utils'

function App() {
  const [snapshot, send] = useMachine(stopwatchMachine)
  const { elapsed, lapElapsed, laps } = snapshot.context

  return (
    <main className="grid min-h-svh w-full grid-rows-[auto_max(100px,_15svh)] bg-gray-50 dark:bg-black">
      <motion.div
        layout
        className={cn(
          'flex w-full flex-col items-center',
          laps.length > 0 ? 'place-self-center' : 'mt-[25svh]',
        )}
      >
        <Stopwatch timeInMs={elapsed} />
        <AnimatePresence mode="popLayout">
          {laps.length > 0 && (
            <motion.div
              exit={{ opacity: 0, y: 50 }}
              className="w-80 text-center md:w-[23rem]"
            >
              <Stopwatch timeInMs={lapElapsed} variant="secondary" />
              <LapTimes laps={laps} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="flex w-full max-w-screen-sm justify-evenly place-self-center self-start">
        {snapshot.matches('stopped') && (
          <>
            <Button disabled variant="secondary">
              Lap
            </Button>
            <Button onClick={() => send({ type: 'start' })}>Start</Button>
          </>
        )}
        {snapshot.matches('started') && (
          <>
            <Button onClick={() => send({ type: 'lap' })} variant="secondary">
              Lap
            </Button>
            <Button
              onClick={() => send({ type: 'pause' })}
              variant="destructive"
            >
              Stop
            </Button>
          </>
        )}
        {snapshot.matches('paused') && (
          <>
            <Button onClick={() => send({ type: 'reset' })} variant="secondary">
              Reset
            </Button>
            <Button onClick={() => send({ type: 'resume' })}>Resume</Button>
          </>
        )}
      </div>
    </main>
  )
}

export default App
