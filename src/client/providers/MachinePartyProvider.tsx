import { pick } from 'lodash'
import { Ban, BellRing } from 'lucide-react'
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
import { categories } from '../../types'
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
import { playNotificationSfx, stopBeepSfx } from '../sounds'

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
  const { roomId, exitRoom } = useRouter()
  const [connected, setConnected] = useState(false)
  const [newRoom, setNewRoom] = useState(false)
  const { toast: roomDeletedToast } = useToast()

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
          break
        }
        case 'delete': {
          categories.forEach((category) => {
            window.dispatchEvent(new CustomEvent(`${category}-reset`))
          })
          playNotificationSfx()
          roomDeletedToast({
            title: (
              <>
                <Ban />
                <span>
                  Sharing was disabled for <strong>{roomId}</strong>
                </span>
              </>
            ),
            action: <ToastAction>Ok</ToastAction>,
          })
          exitRoom()
          break
        }
        // handle 409 and 404 here
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
              <>
                <BellRing /> <strong>{"Time's up"}</strong>
              </>
            ),
            action: (
              <ToastAction
                  onClick={() => {
                    timerSend({ type: 'stopBeep' })
                  }}
                >
                  Dismiss
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

  useEffect(() => stopBeepSfx, [])

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
