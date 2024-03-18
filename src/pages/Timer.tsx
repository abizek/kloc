import { useState } from 'react'
import { prefixZero } from '../utils'
import { useMachine } from '@xstate/react'
import { timerMachine } from '../machines/timer'
import { TimerTimeView } from '../components/TimeView'
import { TimerFooter } from '../components/TimerFooter'

export function Timer() {
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')
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
              value={hours}
              onChange={(event) => {
                setHours(event.target.value)
              }}
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
              value={minutes}
              onChange={(event) => {
                setMinutes(event.target.value)
              }}
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
              value={seconds}
              onChange={(event) => {
                setSeconds(event.target.value)
              }}
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
        timeInput={(+seconds + +minutes * 60 + +hours * 60 * 60) * 1000}
      />
    </div>
  )
}
