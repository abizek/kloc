import { useRef } from 'react'
import { prefixZero } from '../utils'
import { useMachine } from '@xstate/react'
import { timerMachine } from '../machines/timer'
import { TimerTimeView } from '../components/TimeView'
import { TimerFooter } from '../components/TimerFooter'

export function Timer() {
  const hoursRef = useRef<HTMLSelectElement>(null!)
  const minutesRef = useRef<HTMLSelectElement>(null!)
  const secondsRef = useRef<HTMLSelectElement>(null!)
  const [timer, send] = useMachine(timerMachine)

  return (
    <div className="relative z-10 grid size-full grid-rows-[auto_80px] place-items-center">
      {timer.matches('stopped') ? (
        <div className="flex gap-4">
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
        </div>
      ) : (
        <TimerTimeView time={timer.context.remaining} />
      )}
      <TimerFooter
        send={send}
        stopped={timer.matches('stopped')}
        running={timer.matches('running')}
        paused={timer.matches('paused')}
        hoursRef={hoursRef}
        minutesRef={minutesRef}
        secondsRef={secondsRef}
      />
    </div>
  )
}
