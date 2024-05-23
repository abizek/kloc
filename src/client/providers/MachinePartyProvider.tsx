import { pick } from 'lodash'
import { BellRing } from 'lucide-react'
import usePartySocket from 'partysocket/react'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useCallback, useEffect, useState } from 'react'
import type { MachineSnapshot, NonReducibleUnknown } from 'xstate'
import type {
  Category,
  CreateMessage,
  DeleteMessage,
  JoinMessage,
  MessageFromServer,
  State,
  UpdateMessage,
} from '../../types'
import { stopBeep } from '../beep'
import { Button } from '../components/Button/Button'
import { ToastAction } from '../components/Toast/Toast'
import { useToast } from '../components/Toast/useToast'
import { useMachineParty } from '../hooks/useMachineParty'
import { useRouter } from '../hooks/useRouter'
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

type MachinePartyContextType = {
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

  connected: boolean
  setNewRoom: Dispatch<SetStateAction<boolean>>
  deleteRoom: () => void
}

export const MachinePartyContext = createContext<MachinePartyContextType>(
  {} as MachinePartyContextType,
)

export const MachinePartyProvider: FC<PropsWithChildren> = ({ children }) => {
  const { roomId } = useRouter()
  const [connected, setConnected] = useState(false)
  const [newRoom, setNewRoom] = useState(false)

  const ws = usePartySocket({
    host: import.meta.env.VITE_PARTYKIT_HOST,
    room: roomId,
    maxEnqueuedMessages: 0,
    startClosed: !roomId,
    debug: import.meta.env.DEV,
    onOpen() {
      setConnected(true)
      if (newRoom) {
        ws.send(
          JSON.stringify({
            type: 'create',
            stopwatch: pick(stopwatch, ['context', 'status', 'value']),
            timer: pick(timer, ['context', 'status', 'value']),
          } satisfies CreateMessage),
        )
        setNewRoom(false)
      } else {
        ws.send(JSON.stringify({ type: 'join' } satisfies JoinMessage))
      }
    },
    onMessage(event) {
      console.log('message', event.data)
      const parsedMessage: MessageFromServer = JSON.parse(event.data)
      switch (parsedMessage.type) {
        case 'update': {
          const { type, ...parsedMessageData } = parsedMessage

          Object.keys(parsedMessageData).forEach((key) => {
            const event = new CustomEvent(`${key}-update`, {
              detail: parsedMessageData[key as Category],
            })
            window.dispatchEvent(event)
          })
        }
        // handle delete, 409 and 404 here
      }
    },
    onClose() {
      setConnected(false)
    },
    onError(e) {
      console.log('Error', e)
    },
  })

  const updateRoom = useCallback(
    (data: { [index in Category]?: State }) => {
      ws.send(
        JSON.stringify({
          type: 'update',
          ...data,
        } satisfies UpdateMessage),
      )
    },
    [ws],
  )

  const deleteRoom = useCallback(() => {
    ws.send(JSON.stringify({ type: 'delete' } satisfies DeleteMessage))
  }, [ws])

  const { toast: timerToast, dismiss: dismissTimerToast } = useToast()
  const [stopwatch, stopwatchSend] = useMachineParty(
    stopwatchMachine,
    updateRoom,
    connected,
  )
  const [timer, timerSend] = useMachineParty(
    timerMachine.provide({
      actions: {
        onComplete: () => {
          timerToast({
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
            duration: 300000,
          })
        },
      },
    }),
    updateRoom,
    connected,
  )

  useEffect(() => stopBeep, [])

  if (!roomId) {
    ws.close()
  }

  return (
    <MachinePartyContext.Provider
      value={{
        stopwatch,
        stopwatchSend,
        timer,
        timerSend,
        dismissTimerToast,
        connected,
        setNewRoom,
        deleteRoom,
      }}
    >
      {children}
    </MachinePartyContext.Provider>
  )
}
