import { Presence } from '@radix-ui/react-presence'
import { Cloud, CloudOff } from 'lucide-react'
import { useOnline } from '../../hooks/useOnline'
import { useRouter } from '../../hooks/useRouter'
import { Button } from '../Button/Button'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

// TODO: show ws connection status also 'offline' | 'disconnected' | 'connecting' | 'connected'
export function NetworkStatusPopover() {
  const { roomId } = useRouter()
  const isOnline = useOnline()

  let CloudIcon = CloudOff
  let status = 'Offline'
  if (isOnline) {
    CloudIcon = Cloud
    status = 'Online'
  }
  return (
    <Popover>
      <Presence present={!!roomId}>
        <PopoverTrigger asChild>
          <Button
            variant="icon"
            aria-label="Check network status"
            data-state-shared={!!roomId}
            className="data-[state-shared=true]:animate-in data-[state-shared=false]:animate-out data-[state-shared=false]:fade-out data-[state-shared=true]:fade-in data-[state-shared=false]:zoom-out-50 data-[state-shared=true]:zoom-in-50"
          >
            <CloudIcon className="size-7" />
          </Button>
        </PopoverTrigger>
      </Presence>
      <PopoverContent>Network Status: {status}</PopoverContent>
    </Popover>
  )
}
