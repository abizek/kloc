import type { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'
import type { MachineSnapshot, NonReducibleUnknown } from 'xstate'
import { useMachine } from '../hooks/useMachine'
import type {
  StopwatchEvent,
  StopwatchContext as StopwatchXstateContext,
} from '../machines/stopwatch'
import { stopwatchMachine } from '../machines/stopwatch'

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

type StopwatchMachineContextType = {
  stopwatch: MachineSnapshot<
    StopwatchXstateContext,
    StopwatchEvent,
    Record<string, never>,
    StopwatchStateValue,
    string,
    NonReducibleUnknown
  >
  send: (event: StopwatchEvent) => void
}

export const StopwatchMachineContext =
  createContext<StopwatchMachineContextType>({} as StopwatchMachineContextType)

export const StopwatchMachineProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [stopwatch, send] = useMachine(stopwatchMachine)

  return (
    <StopwatchMachineContext.Provider value={{ stopwatch, send }}>
      {children}
    </StopwatchMachineContext.Provider>
  )
}
