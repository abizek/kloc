import type { TimerEvents } from '../machines/timer'

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
    <div className='flex w-full max-w-screen-sm justify-evenly'>
      {stopped && (
        <button
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
        </button>
      )}
      {running && (
        <button
          data-cy="pause"
          onClick={() => {
            send({ type: 'pause' })
          }}
        >
          Pause
        </button>
      )}
      {paused && (
        <button
          data-cy="resume"
          onClick={() => {
            send({ type: 'resume' })
          }}
        >
          Resume
        </button>
      )}
      {!stopped && (
        <button
          data-cy="reset"
          onClick={() => {
            send({ type: 'reset' })
          }}
        >
          Cancel
        </button>
      )}
    </div>
  )
}
