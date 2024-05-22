import { useContext } from 'react'
import { TimerMachineContext } from '../../providers/TimerMachineProvider'
import { Button } from '../Button/Button'

type FooterProps = {
  timeInput: number
}

export function Footer({ timeInput }: FooterProps) {
  const { timer, send, dismissToast } = useContext(TimerMachineContext)

  return (
    <div className="flex w-full max-w-screen-sm justify-evenly">
      {timer.matches('stopped') && (
        <Button
          data-cy="start"
          disabled={timeInput === 0}
          onClick={() => {
            dismissToast()
            send({
              type: 'start',
              time: timeInput,
            })
          }}
        >
          Start
        </Button>
      )}
      {timer.matches('paused') && (
        <Button
          data-cy="resume"
          onClick={() => {
            send({ type: 'resume' })
          }}
        >
          Resume
        </Button>
      )}
      {timer.matches('running') && (
        <Button
          data-cy="pause"
          onClick={() => {
            send({ type: 'pause' })
          }}
          variant="destructive"
        >
          Pause
        </Button>
      )}
      {!timer.matches('stopped') && (
        <Button
          data-cy="reset"
          onClick={() => {
            send({ type: 'reset' })
          }}
          variant="secondary"
        >
          Cancel
        </Button>
      )}
    </div>
  )
}