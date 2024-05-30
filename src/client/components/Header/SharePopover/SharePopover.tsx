import { Ban, Share2 } from 'lucide-react'
import { useContext, useState } from 'react'
import { categories } from '../../../../types'
import { useRouter } from '../../../hooks/useRouter'
import { MachinePartyContext } from '../../../providers/MachinePartyProvider'
import { cn } from '../../../utils'
import { Button } from '../../Button'
import { ToastAction } from '../../Toast/Toast'
import { useToast } from '../../Toast/useToast'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { ExitSessionButton } from './ExitSessionButton'
import { ShareableLink } from './ShareableLink'
import { Switch } from './Switch'

export function SharePopover() {
  const { roomId, enterNewRoom, exitRoom } = useRouter()
  const [shared, setShared] = useState(!!roomId)
  const { setNewRoom, deleteRoom, viewOnly, setViewOnly, viewOnlyRoomId } =
    useContext(MachinePartyContext)
  const { toast } = useToast()

  const handleToggle = (checked: boolean, deleteRoomOnExit: boolean = true) => {
    setShared(checked)
    if (checked) {
      enterNewRoom()
      setNewRoom(true)
    } else {
      if (deleteRoomOnExit) {
        deleteRoom()
        toast({
          title: (
            <>
              <Ban className="shrink-0" />
              <span>
                Kloc <strong>{roomId}</strong>,{' '}
                <strong>{viewOnlyRoomId}</strong> is deleted
              </span>
            </>
          ),
          action: <ToastAction>Ok</ToastAction>,
        })
      }
      exitRoom()
      setViewOnly(false)
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
      <PopoverContent
        className={cn(
          'min-h-20 w-[calc(100vw_-_1rem)] min-w-[min(calc(100vw_-_1rem),_28rem)] max-w-max',
          { 'has-[[data-state-shared]]:min-h-80': !viewOnly },
        )}
      >
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between">
                <h2
                  className={cn('font-medium', {
                    'text-gray-400 dark:text-gray-600': viewOnly,
                  })}
                >
                  Share Kloc
                </h2>
                <Switch
                  checked={shared}
                  disabled={viewOnly}
                  onCheckedChange={handleToggle}
                  aria-label="Toggle sharing"
                  data-cy="share-switch"
                />
              </div>
              <div
                className={cn('text-sm text-gray-600/90 dark:text-gray-400', {
                  'text-gray-400 dark:text-gray-600': viewOnly,
                })}
              >
                Share your stopwatch/timer
              </div>
            </div>

            {viewOnly ? (
              <ShareableLink shared={shared} title="View only link" />
            ) : (
              <ShareableLink shared={shared} title="Full access link" />
            )}
            {viewOnlyRoomId && (
              <ShareableLink
                shared={shared}
                title="View only link"
                href={
                  location.href.slice(0, location.href.lastIndexOf('/') + 1) +
                  viewOnlyRoomId
                }
              />
            )}
          </div>
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
