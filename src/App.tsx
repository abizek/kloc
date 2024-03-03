import { useMachine } from '@xstate/react'
import { stopwatchMachine } from './stopwatchMachine'
import { Button } from './components/Button'
import { formatTime } from './utils'

function App() {
  const [snapshot, send] = useMachine(stopwatchMachine)

  return (
    <main>
      <div>{formatTime(snapshot.context.elapsed)}</div>
      {snapshot.context.laps.length > 0 && (
        <div>{formatTime(snapshot.context.lapElapsed)}</div>
      )}
      <div>
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
      {snapshot.context.laps.length > 0 && <div>Lap Lap time Overall time</div>}
      {snapshot.context.laps.map(({ id, elapsed, overall }, index) => (
        <div key={id}>
          {snapshot.context.laps.length - index} {formatTime(elapsed)}{' '}
          {formatTime(overall)}
        </div>
      ))}
    </main>
  )
}

export default App
