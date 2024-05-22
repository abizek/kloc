import { pick } from 'lodash'
import type PartySocket from 'partysocket'
import usePartySocket from 'partysocket/react'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'
import { useRouter } from '../hooks/useRouter'
import { StopwatchMachineContext } from './StopwatchMachineProvider'
import { TimerMachineContext } from './TimerMachineProvider'

type PartyContextType = {
  ws: PartySocket
  connected: boolean
  setNewRoom: Dispatch<SetStateAction<boolean>>
}

export const PartyContext = createContext<PartyContextType>(
  {} as PartyContextType,
)

export const PartyProvider: FC<PropsWithChildren> = ({ children }) => {
  const { roomId } = useRouter()
  const [connected, setConnected] = useState(false)
  const [newRoom, setNewRoom] = useState(false)
  const { stopwatch } = useContext(StopwatchMachineContext)
  const { timer } = useContext(TimerMachineContext)

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
          }),
        )
        setNewRoom(false)
      } else {
        ws.send(JSON.stringify({ type: 'join' }))
      }
    },
    onMessage(event) {
      console.log('message', event.data)
      // handle update, delete, 409 and 404 here
    },
    onClose() {
      setConnected(false)
    },
    onError(e) {
      console.log('Error', e)
    },
  })

  if (!roomId) {
    ws.close()
  }

  return (
    <PartyContext.Provider value={{ ws, connected, setNewRoom }}>
      {children}
    </PartyContext.Provider>
  )
}
