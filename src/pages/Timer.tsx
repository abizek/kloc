import { useEffect } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import { BellRing } from 'lucide-react'
import { timerMachine } from '../machines/timer'
import { TimerTimeView } from '../components/TimeView'
import { TimerFooter } from '../components/TimerFooter'
import { TimerInput } from '../components/TimerInput'
import { ToastAction } from '../components/Toast/Toast'
import { Button } from '../components/Button'
import { useToast } from '../components/Toast/useToast'
import { usePersistedMachine } from '../hooks/usePersistedMachine'
import { stopBeep } from '../beep'

export function Timer() {
  const [hours] = useLocalStorage('timer-input-hours', '00')
  const [minutes] = useLocalStorage('timer-input-minutes', '00')
  const [seconds] = useLocalStorage('timer-input-seconds', '00')
  const { toast, dismiss } = useToast()
  const [timer, send] = usePersistedMachine(
    'timer',
    timerMachine.provide({
      actions: {
        onComplete: () => {
          toast({
            title: (
              <div className="flex items-center gap-3">
                <BellRing /> Time&apos;s up
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
        <TimerInput />
      ) : (
        <TimerTimeView
          time={timer.context.remaining}
          maxValue={timer.context.duration}
          destination={timer.context.destination}
          running={timer.matches('running')}
        />
      )}
      <TimerFooter
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
