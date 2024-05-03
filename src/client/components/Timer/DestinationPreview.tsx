import { Bell } from 'lucide-react'
import { prefixZero } from '../../utils'

type DestinationPreviewProps = {
  destination: number
  running: boolean
}

export function DestinationPreview({
  destination,
  running,
}: DestinationPreviewProps) {
  const date = new Date(destination)

  let hh = date.getHours()
  const amPm = hh < 12 ? 'AM' : 'PM'
  hh %= 12
  if (hh === 0) hh = 12

  const mm = prefixZero(date.getMinutes())

  return (
    <div
      data-cy="destination"
      data-disabled={!running}
      className="absolute bottom-[20%] flex items-center gap-1 tracking-tight text-gray-800 transition-colors data-[disabled=true]:text-gray-400 dark:text-gray-50 data-[disabled=true]:dark:text-gray-600"
    >
      <Bell className="size-4 fill-current" />
      <div>{`${hh}:${mm} ${amPm}`}</div>
    </div>
  )
}
