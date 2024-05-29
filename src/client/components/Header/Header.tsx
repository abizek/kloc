import { GitHubLink } from './GitHubLink'
import { NetworkStatusPopover } from './NetworkStatusPopover'
import { Separator } from './Separator'
import { SharePopover } from './SharePopover'

export function Header() {
  return (
    <header className="z-10 flex w-full items-center justify-end gap-4 p-6 [&_svg]:dark:stroke-gray-50">
      <NetworkStatusPopover />
      <SharePopover />
      <Separator />
      <nav className="flex items-center">
        <GitHubLink />
      </nav>
    </header>
  )
}
