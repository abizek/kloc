import { useEffect } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import { BellRing } from 'lucide-react'
import { timerMachine } from '../../machines/timer'
import { TimeView } from './TimeView'
import { Footer } from './Footer'
import { Input } from './Input'
import { ToastAction } from '../Toast/Toast'
import { Button } from '../Button'
import { useToast } from '../Toast/useToast'
import { useMachine } from '../../hooks/useMachine'
import { stopBeep } from '../../beep'

export function Timer() {
  const [hours] = useLocalStorage('timer-input-hours', '00')
  const [minutes] = useLocalStorage('timer-input-minutes', '00')
  const [seconds] = useLocalStorage('timer-input-seconds', '00')
  const { toast, dismiss } = useToast()
  const [timer, send] = useMachine(
    timerMachine.provide({
      actions: {
        onComplete: () => {
          toast({
            title: (
              <div className="flex items-center gap-3">
                <BellRing /> {"Time's up"}
              </div>
            ),
            action: (
              <ToastAction altText="Dismiss" asChild>
                <Button
                  data-cy="dismiss"
                  variant="secondary"
                  className="scale-90"
                  onClick={() => {
                    send({ type: 'stopBeep' })
                  }}
                >
                  Dismiss
                </Button>
              </ToastAction>
            ),
          })
        },
      },
    }),
  )

  useEffect(
    () => () => {
      stopBeep()
      dismiss()
    },
    [dismiss],
  )

  return (
    <div className="relative z-10 grid size-full grid-rows-[auto_80px] place-items-center">
      {timer.matches('stopped') ? (
        <Input />
      ) : (
        <TimeView
          time={timer.context.remaining}
          maxValue={timer.context.duration}
          destination={timer.context.destination}
          running={timer.matches('running')}
        />
      )}
      <Footer
        send={send}
        dismiss={dismiss}
        stopped={timer.matches('stopped')}
        running={timer.matches('running')}
        paused={timer.matches('paused')}
        timeInput={(+seconds + +minutes * 60 + +hours * 60 * 60) * 1000}
      />
    </div>
  )
}
