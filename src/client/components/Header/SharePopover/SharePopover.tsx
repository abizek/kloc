import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from '@joaomoreno/unique-names-generator'
import { Share2 } from 'lucide-react'
import { useContext, useState } from 'react'
import { useRouter } from '../../../hooks/useRouter'
import { PartyContext } from '../../../providers/PartyProvider'
import { Button } from '../../Button'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { ExitSessionButton } from './ExitSessionButton'
import { ShareableLink } from './ShareableLink'
import { Switch } from './Switch'

export function SharePopover() {
  const { roomId, tab } = useRouter()
  const [shared, setShared] = useState(!!roomId)
  const { setNewRoom } = useContext(PartyContext)

  const handleToggle = (checked: boolean) => {
    setShared(checked)
    if (checked) {
      history.pushState(
        null,
        '',
        `/${tab}/${uniqueNamesGenerator({
          dictionaries: [adjectives, animals],
          separator: '-',
        })}`,
      )
      setNewRoom(true)
    } else {
      history.pushState(null, '', `/${tab}`)
    }
  }

  if (!!roomId !== shared) {
    setShared(!!roomId)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="icon" aria-label="Open share settings">
          <Share2 className="size-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-[78px] w-svw max-w-96 has-[[data-state-qr]]:h-[566px] has-[[data-state-shared]]:h-[200px]">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between">
              <h2 className="font-medium">Share Kloc</h2>
              <Switch
                checked={shared}
                onCheckedChange={handleToggle}
                aria-label="Toggle sharing"
              />
            </div>
            <div className="text-sm text-gray-600/90 dark:text-gray-400">
              Share your stopwatch/timer
            </div>
          </div>

          <ShareableLink shared={shared} />

          <ExitSessionButton
            shared={shared}
            onExitSession={() => handleToggle(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
