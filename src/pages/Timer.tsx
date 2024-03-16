import { useRef } from 'react'
import { prefixZero } from '../utils'
import { useMachine } from '@xstate/react'
import { timerMachine } from '../machines/timer'
import { TimeView } from '../components/TimeViewOld'

export function Timer() {
  const hoursRef = useRef<HTMLSelectElement>(null!)
  const minutesRef = useRef<HTMLSelectElement>(null!)
  const secondsRef = useRef<HTMLSelectElement>(null!)
  const [timer, send] = useMachine(timerMachine)

  return (
    <div className="relative z-10 size-full bg-gray-200">
      <label>
        Hours:
        <select name="hours" ref={hoursRef} defaultValue="00">
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
        <select name="minutes" ref={minutesRef} defaultValue="00">
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
        <select name="seconds" ref={secondsRef} defaultValue="00">
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
          onClick={() => {
            send({ type: 'pause' })
          }}
        >
          Pause
        </button>
      )}
      {timer.matches('paused') && (
        <button
          onClick={() => {
            send({ type: 'resume' })
          }}
        >
          Resume
        </button>
      )}
      {!timer.matches('stopped') && (
        <button
          onClick={() => {
            send({ type: 'reset' })
          }}
        >
          Cancel
        </button>
      )}
      <TimeView id="timer" time={timer.context.remaining} />
    </div>
  )
}
