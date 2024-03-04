import { useMachine } from '@xstate/react'
import { stopwatchMachine } from './stopwatchMachine'
import { Button } from './components/Button'
import { Stopwatch } from './components/Stopwatch'
import { formatTime } from './utils'

function App() {
  const [snapshot, send] = useMachine(stopwatchMachine)
  const { elapsed, lapElapsed, laps } = snapshot.context

  return (
    <main className="grid min-h-svh w-full grid-rows-[auto_100px] place-items-center bg-gray-100">
      <div className="flex flex-col items-center">
        <Stopwatch timeInMs={elapsed} />
        {laps.length > 0 && (
          <Stopwatch timeInMs={lapElapsed} variant="secondary" />
        )}
        <div className="mt-4">
          {laps.length > 0 && <div>Lap Lap time Overall time</div>}
          {laps.map(({ id, elapsed, overall }, index) => (
            <div key={id}>
              {laps.length - index} {formatTime(elapsed)} {formatTime(overall)}
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-evenly">
        {snapshot.matches('stopped') && (
          <>
            <Button disabled variant="secondary">
              Lap
            </Button>
            <Button onClick={() => send({ type: 'start' })}>Start</Button>
          </>
        )}
        {snapshot.matches('started') && (
          <>
            <Button onClick={() => send({ type: 'lap' })} variant="secondary">
              Lap
            </Button>
            <Button
              onClick={() => send({ type: 'pause' })}
              variant="destructive"
            >
              Stop
            </Button>
          </>
        )}
        {snapshot.matches('paused') && (
          <>
            <Button onClick={() => send({ type: 'reset' })} variant="secondary">
              Reset
            </Button>
            <Button onClick={() => send({ type: 'resume' })}>Resume</Button>
          </>
        )}
      </div>
    </main>
  )
}

export default App
