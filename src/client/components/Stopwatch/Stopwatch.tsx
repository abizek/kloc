import { AnimatePresence, motion } from 'framer-motion'
import { useContext } from 'react'
import { MachinePartyContext } from '../../providers/MachinePartyProvider'
import { cn } from '../../utils'
import { Footer } from './Footer'
import { LapTimes } from './LapTimes'
import { TimeView } from './TimeView'

export function Stopwatch() {
  const {
    stopwatch: {
      context: { elapsed, lapElapsed, laps },
    },
  } = useContext(MachinePartyContext)

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
      <Footer />
    </div>
  )
}
