import { BellRing } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect } from 'react'
import { MachineSnapshot, NonReducibleUnknown } from 'xstate'
import { stopBeep } from '../beep'
import { Button } from '../components/Button'
import { ToastAction } from '../components/Toast/Toast'
import { useToast } from '../components/Toast/useToast'
import { useMachine } from '../hooks/useMachine'
import type {
  TimerEvents,
  TimerContext as TimerXstateContext,
} from '../machines/timer'
import { timerMachine } from '../machines/timer'

type TimerMachineContextType = {
  timer: MachineSnapshot<
    TimerXstateContext,
    TimerEvents,
    Record<string, never>,
    | 'running'
    | 'paused'
    | {
        stopped?: 'beepStopped' | 'beepPlaying' | undefined
      },
    string,
    NonReducibleUnknown
  >
  send: (event: TimerEvents) => void
  dismissToast: () => void
}

export const TimerMachineContext = createContext<TimerMachineContextType>(
  {} as TimerMachineContextType,
)

export const TimerMachineProvider: FC<PropsWithChildren> = ({ children }) => {
  const { toast, dismiss: dismissToast } = useToast()
  const [timer, send] = useMachine(
    timerMachine.provide({
      actions: {
        onComplete: () => {
          toast({
            title: (
              <div className="flex items-center gap-3">
                <BellRing /> {"Time's up"}
              </div>
            ),
            action: (
              <ToastAction altText="Dismiss" asChild>
                <Button
                  data-cy="dismiss"
                  variant="secondary"
                  className="scale-90"
                  onClick={() => {
                    send({ type: 'stopBeep' })
                  }}
                >
                  Dismiss
                </Button>
              </ToastAction>
            ),
          })
        },
      },
    }),
  )

  useEffect(() => stopBeep, [])

  return (
    <TimerMachineContext.Provider value={{ timer, send, dismissToast }}>
      {children}
    </TimerMachineContext.Provider>
  )
}
