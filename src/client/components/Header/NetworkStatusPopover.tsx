import { Presence } from '@radix-ui/react-presence'
import { Cloud, CloudOff, Loader } from 'lucide-react'
import { useContext } from 'react'
import { useOnline } from '../../hooks/useOnline'
import { useRouter } from '../../hooks/useRouter'
import { MachinePartyContext } from '../../providers/MachinePartyProvider'
import { Button } from '../Button/Button'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

export function NetworkStatusPopover() {
  const { roomId } = useRouter()
  const isOnline = useOnline()
  const { connected, connecting } = useContext(MachinePartyContext)

  let networkIcon = <CloudOff />
  let status = 'Offline'
  if (isOnline && roomId) {
    if (connecting) {
      networkIcon = <Loader className="animate-spin" />
      status = 'Connecting'
    } else if (connected) {
      networkIcon = <Cloud />
      status = 'Connected'
    } else {
      status = 'Disconnected'
    }
  }

  return (
    <Popover>
      <Presence present={!!roomId}>
        <PopoverTrigger asChild>
          <Button
            variant="icon"
            aria-label="Check network status"
            data-state-shared={!!roomId}
            className="data-[state-shared=true]:animate-in data-[state-shared=false]:animate-out data-[state-shared=false]:fade-out data-[state-shared=true]:fade-in data-[state-shared=false]:zoom-out-50 data-[state-shared=true]:zoom-in-50 [&_svg]:size-7"
          >
            {networkIcon}
          </Button>
        </PopoverTrigger>
      </Presence>
      <PopoverContent>{status}</PopoverContent>
    </Popover>
  )
}
