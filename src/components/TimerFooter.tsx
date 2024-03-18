import type { TimerEvents } from '../machines/timer'
import { Button } from './Button'

type TimerFooterProps = {
  send: (event: TimerEvents) => void
  stopped: boolean
  running: boolean
  paused: boolean
  hoursRef: React.MutableRefObject<HTMLSelectElement>
  minutesRef: React.MutableRefObject<HTMLSelectElement>
  secondsRef: React.MutableRefObject<HTMLSelectElement>
}

export function TimerFooter({
  send,
  stopped,
  running,
  paused,
  hoursRef,
  minutesRef,
  secondsRef,
}: TimerFooterProps) {
  return (
    <div className="flex w-full max-w-screen-sm justify-evenly">
      {stopped && (
        <Button
          data-cy="start"
          onClick={() => {
            send({
              type: 'start',
              time:
                (+secondsRef.current.value +
                  +minutesRef.current.value * 60 +
                  +hoursRef.current.value * 60 * 60) *
                1000,
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
