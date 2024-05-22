import { BellRing } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect } from 'react'
import type { MachineSnapshot, NonReducibleUnknown } from 'xstate'
import { stopBeep } from '../beep'
import { Button } from '../components/Button/Button'
import { ToastAction } from '../components/Toast/Toast'
import { useToast } from '../components/Toast/useToast'
import { useMachine } from '../hooks/useMachine'
import type {
  StopwatchEvent,
  StopwatchContext as StopwatchXstateContext,
} from '../machines/stopwatch'
import { stopwatchMachine } from '../machines/stopwatch'
import type {
  TimerEvent,
  TimerContext as TimerXstateContext,
} from '../machines/timer'
import { timerMachine } from '../machines/timer'

type StopwatchStateValue =
  | 'paused'
  | 'stopped'
  | {
      started?:
        | Required<{
            mainStopwatch?: 'running' | undefined
            lapStopwatch?:
              | 'stopped'
              | {
                  started?: 'running' | undefined
                }
              | undefined
          }>
        | undefined
    }

type TimerStateValue =
  | 'running'
  | 'paused'
  | {
      stopped?: 'beepStopped' | 'beepPlaying' | undefined
    }

type MachineContextType = {
  stopwatch: MachineSnapshot<
    StopwatchXstateContext,
    StopwatchEvent,
    Record<string, never>,
    StopwatchStateValue,
    string,
    NonReducibleUnknown
  >
  stopwatchSend: (event: StopwatchEvent) => void
  timer: MachineSnapshot<
    TimerXstateContext,
    TimerEvent,
    Record<string, never>,
    TimerStateValue,
    string,
    NonReducibleUnknown
  >
  timerSend: (event: TimerEvent) => void
  dismissTimerToast: () => void
}

export const MachineContext = createContext<MachineContextType>(
  {} as MachineContextType,
)

export const MachineProvider: FC<PropsWithChildren> = ({ children }) => {
  const { toast, dismiss: dismissTimerToast } = useToast()
  const [stopwatch, stopwatchSend] = useMachine(stopwatchMachine)
  const [timer, timerSend] = useMachine(
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
                    timerSend({ type: 'stopBeep' })
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
    <MachineContext.Provider
      value={{
        stopwatch,
        stopwatchSend,
        timer,
        timerSend,
        dismissTimerToast,
      }}
    >
      {children}
    </MachineContext.Provider>
  )
}
