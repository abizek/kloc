import { useMachine } from '@xstate/react'
import { stopwatchMachine } from './stopwatchMachine'
import { formatTime } from './utils'

function App() {
  const [snapshot, send] = useMachine(stopwatchMachine)

  return (
    <main>
      <div>{formatTime(snapshot.context.elapsed)}</div>
      {snapshot.context.laps.length > 0 && (
        <div>{formatTime(snapshot.context.lapElapsed)}</div>
      )}
      {snapshot.matches('stopped') && (
        <button onClick={() => send({ type: 'start' })}>Start</button>
      )}
      {snapshot.matches('started') && (
        <>
          <button onClick={() => send({ type: 'lap' })}>Lap</button>
          <button onClick={() => send({ type: 'pause' })}>Stop</button>
        </>
      )}
      {snapshot.matches('paused') && (
        <>
          <button onClick={() => send({ type: 'reset' })}>Reset</button>
          <button onClick={() => send({ type: 'resume' })}>Resume</button>
        </>
      )}
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
