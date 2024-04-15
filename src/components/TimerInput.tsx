import { useLocalStorage } from '@uidotdev/usehooks'

export function TimerInput() {
  const [hours, setHours] = useLocalStorage('timer-input-hours', '00')
  const [minutes, setMinutes] = useLocalStorage('timer-input-minutes', '00')
  const [seconds, setSeconds] = useLocalStorage('timer-input-seconds', '00')

  return (
    <div className="flex items-center gap-4 text-gray-800 dark:text-gray-50 [&_input]:w-10 [&_input]:bg-gray-50 [&_input]:dark:bg-black [&_label]:flex [&_label]:gap-4">
      <label>
        Hours:
        <input
          type="number"
          name="hours"
          data-cy="hours-input"
          value={hours}
          onChange={(event) => {
            event.preventDefault()
            setHours(event.target.value)
          }}
        />
      </label>
      <label>
        Minutes:
        <input
          type="number"
          name="minutes"
          data-cy="minutes-input"
          value={minutes}
          onChange={(event) => {
            event.preventDefault()
            setMinutes(event.target.value)
          }}
        />
      </label>
      <label>
        Seconds:
        <input
          type="number"
          name="seconds"
          data-cy="seconds-input"
          value={seconds}
          onChange={(event) => {
            event.preventDefault()
            setSeconds(event.target.value)
          }}
        />
      </label>
    </div>
  )
}
