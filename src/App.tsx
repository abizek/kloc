import { useMachine } from '@xstate/react'
import { stopwatchMachine } from './stopwatchMachine'

function App() {
  const [snapshot, send] = useMachine(stopwatchMachine)
  const { ms, ss, mm, hh } = snapshot.context

  return (
    <main>
      <div>
        {hh !== '00' && `${hh}:`}
        {`${mm}:${ss}.${ms}`}
      </div>
      {snapshot.matches('initialized') && (
        <button onClick={() => send({ type: 'start' })}>Start</button>
      )}
      {snapshot.matches('running') && (
        <button onClick={() => send({ type: 'pause' })}>Pause</button>
      )}
      {snapshot.matches('paused') && (
        <>
          <button onClick={() => send({ type: 'reset' })}>Reset</button>
          <button onClick={() => send({ type: 'resume' })}>Resume</button>
        </>
      )}
    </main>
  )
}

export default App
