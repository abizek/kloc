import { useLocalStorage } from '@uidotdev/usehooks'
import { timerMachine } from '../machines/timer'
import { TimerTimeView } from '../components/TimeView'
import { TimerFooter } from '../components/TimerFooter'
import { TimerInput } from '../components/TimerInput'
import { usePersistedMachine } from '../hooks/usePersistedMachine'

export function Timer() {
  const [hours] = useLocalStorage('timer-input-hours', '00')
  const [minutes] = useLocalStorage('timer-input-minutes', '00')
  const [seconds] = useLocalStorage('timer-input-seconds', '00')
  const [timer, send] = usePersistedMachine('timer', timerMachine)

  return (
    <div className="relative z-10 grid size-full grid-rows-[auto_80px] place-items-center">
      {timer.matches('stopped') ? (
        <TimerInput />
      ) : (
        <TimerTimeView
          time={timer.context.remaining}
          maxValue={(+seconds + +minutes * 60 + +hours * 60 * 60) * 1000}
        />
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
