import { useRef } from 'react'
import { prefixZero } from '../utils'
import { useMachine } from '@xstate/react'
import { timerMachine } from '../machines/timer'
import { TimerTimeView } from '../components/TimeView'

export function Timer() {
  const hoursRef = useRef<HTMLSelectElement>(null!)
  const minutesRef = useRef<HTMLSelectElement>(null!)
  const secondsRef = useRef<HTMLSelectElement>(null!)
  const [timer, send] = useMachine(timerMachine)

  return (
    <div className="relative z-10 size-full">
      <label>
        Hours:
        <select
          data-cy="hours-select"
          name="hours"
          ref={hoursRef}
          defaultValue="00"
        >
          {Array(100)
            .fill(0)
            .map((_, index) => (
              <option key={index} value={index}>
                {prefixZero(index)}
              </option>
            ))}
        </select>
      </label>
      <label>
        Minutes:
        <select
          data-cy="minutes-select"
          name="minutes"
          ref={minutesRef}
          defaultValue="00"
        >
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <option key={index} value={index}>
                {prefixZero(index)}
              </option>
            ))}
        </select>
      </label>
      <label>
        Seconds:
        <select
          data-cy="seconds-select"
          name="seconds"
          ref={secondsRef}
          defaultValue="00"
        >
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <option key={index} value={index}>
                {prefixZero(index)}
              </option>
            ))}
        </select>
      </label>
      {timer.matches('stopped') && (
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
      {timer.matches('running') && (
        <button
          data-cy="pause"
          onClick={() => {
            send({ type: 'pause' })
          }}
        >
          Pause
        </button>
      )}
      {timer.matches('paused') && (
        <button
          data-cy="resume"
          onClick={() => {
            send({ type: 'resume' })
          }}
        >
          Resume
        </button>
      )}
      {!timer.matches('stopped') && (
        <button
          data-cy="reset"
          onClick={() => {
            send({ type: 'reset' })
          }}
        >
          Cancel
        </button>
      )}
      {!timer.matches('stopped') && (
        <TimerTimeView time={timer.context.remaining} />
      )}
    </div>
  )
}
