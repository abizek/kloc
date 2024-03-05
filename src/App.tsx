import { useMachine } from '@xstate/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { stopwatchMachine } from './stopwatchMachine'
import { Stopwatch } from './components/Stopwatch'
import { LapTimes } from './components/LapTimes'
import { Footer } from './components/Footer'
import { cn } from './utils'

function App() {
  const [snapshot, send] = useMachine(stopwatchMachine)
  const { elapsed, lapElapsed, laps } = snapshot.context

  return (
    <div className="grid min-h-svh w-full grid-rows-[48px_auto_max(100px,_15svh)] bg-gray-50 dark:bg-black">
      <header className="z-10 flex w-full justify-end p-6">
        <a
          href="https://github.com/abizek/stopwatch"
          target="_blank"
          rel="noreferrer"
          className='h-fit'
        >
          <Github className="size-7 dark:stroke-gray-50" />
        </a>
      </header>
      <motion.main
        layout
        className={cn(
          'flex w-full flex-col items-center',
          laps.length > 0 ? 'place-self-center' : 'mt-[25svh]',
        )}
      >
        <Stopwatch timeInMs={elapsed} />
        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              exit={{ opacity: 0 }}
              className="w-80 text-center md:w-[23rem]"
            >
              <Stopwatch timeInMs={lapElapsed} variant="secondary" />
              <LapTimes laps={laps} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
      <Footer
        stopped={snapshot.matches('stopped')}
        started={snapshot.matches('started')}
        paused={snapshot.matches('paused')}
        send={send}
      />
    </div>
  )
}

export default App
