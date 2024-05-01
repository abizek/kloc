import type { TimerEvents } from '../../machines/timer'
import { Button } from '../Button'

type FooterProps = {
  send: (event: TimerEvents) => void
  dismiss: () => void
  stopped: boolean
  running: boolean
  paused: boolean
  timeInput: number
}

export function Footer({
  send,
  dismiss,
  stopped,
  running,
  paused,
  timeInput,
}: FooterProps) {
  return (
    <div className="flex w-full max-w-screen-sm justify-evenly">
      {stopped && (
        <Button
          data-cy="start"
          disabled={timeInput === 0}
          onClick={() => {
            dismiss()
            send({
              type: 'start',
              time: timeInput,
            })
          }}
        >
          Start
        </Button>
      )}
      {paused && (
        <Button
          data-cy="resume"
          onClick={() => {
            send({ type: 'resume' })
          }}
        >
          Resume
        </Button>
      )}
      {running && (
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
      {!stopped && (
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
