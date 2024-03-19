import { useState } from 'react'
import { prefixZero } from '../utils'
import { useMachine } from '@xstate/react'
import { timerMachine } from '../machines/timer'
import { TimerTimeView } from '../components/TimeView'
import { TimerFooter } from '../components/TimerFooter'
import { TimerInput } from '../components/TimerInput'

export function Timer() {
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')
  const [timer, send] = useMachine(timerMachine)

  return (
    <div className="relative z-10 grid size-full grid-rows-[auto_80px] place-items-center">
      {timer.matches('stopped') ? (
        <div className="flex gap-4">
          <TimerInput
            label="Hours"
            values={Array(100)
              .fill(0)
              .map((_, index) => prefixZero(index))}
            onChange={(value) => {
              setHours(value)
            }}
          />
          <TimerInput
            label="Minutes"
            values={Array(60)
              .fill(0)
              .map((_, index) => prefixZero(index))}
            onChange={(value) => {
              setMinutes(value)
            }}
          />
          <TimerInput
            label="Seconds"
            values={Array(60)
              .fill(0)
              .map((_, index) => prefixZero(index))}
            onChange={(value) => {
              setSeconds(value)
            }}
          />
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
