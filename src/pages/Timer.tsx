import { useLocalStorage } from '@uidotdev/usehooks'
import { prefixZero } from '../utils'
import { timerMachine } from '../machines/timer'
import { TimerTimeView } from '../components/TimeView'
import { TimerFooter } from '../components/TimerFooter'
import { TimerInput } from '../components/TimerInput'
import { usePersistedMachine } from '../hooks/usePersistedMachine'

export function Timer() {
  const [hours, setHours] = useLocalStorage('timer-input-hours', '00')
  const [minutes, setMinutes] = useLocalStorage('timer-input-minutes', '00')
  const [seconds, setSeconds] = useLocalStorage('timer-input-seconds', '00')
  const [timer, send] = usePersistedMachine('timer', timerMachine)

  return (
    <div className="relative z-10 grid size-full grid-rows-[auto_80px] place-items-center">
      {timer.matches('stopped') ? (
        <div className="flex items-center gap-4">
          <TimerInput
            label="Hours"
            values={Array(100)
              .fill(0)
              .map((_, index) => prefixZero(index))}
            onChange={(value) => {
              setHours(value)
            }}
            persistedValue={hours}
          />
          <TimerInput
            label="Minutes"
            values={Array(60)
              .fill(0)
              .map((_, index) => prefixZero(index))}
            onChange={(value) => {
              setMinutes(value)
            }}
            persistedValue={minutes}
          />
          <TimerInput
            label="Seconds"
            values={Array(60)
              .fill(0)
              .map((_, index) => prefixZero(index))}
            onChange={(value) => {
              setSeconds(value)
            }}
            persistedValue={seconds}
            hideSeparator
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
