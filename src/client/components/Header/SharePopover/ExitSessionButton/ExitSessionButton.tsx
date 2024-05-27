import { Presence } from '@radix-ui/react-presence'
import { useMediaQuery } from '@uidotdev/usehooks'
import { LogOut } from 'lucide-react'
import { forwardRef } from 'react'
import { Button } from '../../../Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './Drawer'

interface ExitSessionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shared: boolean
}

type ExitSessionButtonWithConfirmationProps = {
  shared: boolean
  onExitSession: () => void
}

const ExitSessionButton = forwardRef<HTMLButtonElement, ExitSessionButtonProps>(
  function ExitSessionButton({ shared, ...props }, ref) {
    return (
      <Button
        ref={ref}
        variant="secondary"
        data-cy="exit-session-button"
        data-state-shared={shared}
        className="flex w-fit scale-95 items-center gap-2 self-end px-5 data-[state-shared=true]:animate-in data-[state-shared=false]:animate-out data-[state-shared=false]:fade-out data-[state-shared=true]:fade-in data-[state-shared=false]:zoom-out-90 data-[state-shared=true]:zoom-in-90"
        {...props}
      >
        <LogOut className="size-5 rotate-180" />
        Exit Session
      </Button>
    )
  },
)

function ExitSessionButtonWithConfirmation({
  shared,
  onExitSession,
}: ExitSessionButtonWithConfirmationProps) {
  const isSmallDevice = useMediaQuery('(max-width: 640px)')
  const title = 'Exit Session?'
  const description = 'The current session will still be shared.'
  const cancelButtonText = 'Cancel'
  const continueButtonText = 'Continue'

  return isSmallDevice ? (
    <Drawer>
      <Presence present={shared}>
        <DrawerTrigger asChild>
          <ExitSessionButton shared={shared} />
        </DrawerTrigger>
      </Presence>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" className="scale-95">
              {cancelButtonText}
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button className="scale-95" onClick={onExitSession}>
              {continueButtonText}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <AlertDialog>
      <Presence present={shared}>
        <AlertDialogTrigger asChild>
          <ExitSessionButton shared={shared} />
        </AlertDialogTrigger>
      </Presence>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction onClick={onExitSession}>
            {continueButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ExitSessionButtonWithConfirmation as ExitSessionButton }
