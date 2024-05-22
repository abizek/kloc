import type PartySocket from 'partysocket'
import usePartySocket from 'partysocket/react'
import { FC, PropsWithChildren, createContext, useState } from 'react'
import { useRouter } from '../hooks/useRouter'

type PartyContextType = {
  ws: PartySocket
  connected: boolean
}

export const PartyContext = createContext<PartyContextType>(
  {} as PartyContextType,
)

export const PartyProvider: FC<PropsWithChildren> = ({ children }) => {
  const { roomId } = useRouter()
  const [connected, setConnected] = useState(false)

  const ws = usePartySocket({
    host: import.meta.env.VITE_PARTYKIT_HOST,
    room: roomId,
    maxEnqueuedMessages: 0,
    startClosed: !roomId,
    debug: import.meta.env.DEV,
    onOpen() {
      setConnected(true)
      console.log('connected', ws.readyState)
    },
    onMessage(event) {
      console.log('message', event.data)
    },
    onClose() {
      setConnected(false)
      console.log('closed', ws.readyState)
    },
    onError(e) {
      console.log('Error', e)
    },
  })

  if (!roomId) {
    ws.close()
  }

  return (
    <PartyContext.Provider value={{ ws, connected }}>
      {children}
    </PartyContext.Provider>
  )
}
