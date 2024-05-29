import { Share2 } from 'lucide-react'
import { useContext, useState } from 'react'
import { categories } from '../../../../types'
import { useRouter } from '../../../hooks/useRouter'
import { MachinePartyContext } from '../../../providers/MachinePartyProvider'
import { Button } from '../../Button'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { ExitSessionButton } from './ExitSessionButton'
import { ShareableLink } from './ShareableLink'
import { Switch } from './Switch'

export function SharePopover() {
  const { roomId, enterNewRoom, exitRoom } = useRouter()
  const [shared, setShared] = useState(!!roomId)
  const { setNewRoom, deleteRoom } = useContext(MachinePartyContext)

  const handleToggle = (checked: boolean, deleteRoomOnExit: boolean = true) => {
    setShared(checked)
    if (checked) {
      enterNewRoom()
      setNewRoom(true)
    } else {
      if (deleteRoomOnExit) {
        deleteRoom()
      }
      exitRoom()
    }
  }

  if (!!roomId !== shared) {
    setShared(!!roomId)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="icon" aria-label="Open share settings" data-cy="share">
          <Share2 className="size-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-[78px] w-[calc(100vw_-_1rem)] min-w-[min(calc(100vw_-_1rem),_28rem)] max-w-max has-[[data-state-qr]]:h-[566px] has-[[data-state-shared]]:h-[200px]">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between">
              <h2 className="font-medium">Share Kloc</h2>
              <Switch
                checked={shared}
                onCheckedChange={handleToggle}
                aria-label="Toggle sharing"
                data-cy="share-switch"
              />
            </div>
            <div className="text-sm text-gray-600/90 dark:text-gray-400">
              Share your stopwatch/timer
            </div>
          </div>

          <ShareableLink shared={shared} />

          <ExitSessionButton
            shared={shared}
            onExitSession={() => {
              handleToggle(false, false)
              categories.forEach((category) => {
                window.dispatchEvent(new CustomEvent(`${category}-reset`))
              })
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
