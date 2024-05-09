import { useContext } from 'react'
import { StopwatchMachineContext } from '../../providers/StopwatchMachineProvider'
import { Button } from '../Button/Button'

export function Footer() {
  const { send, stopwatch } = useContext(StopwatchMachineContext)

  return (
    <footer className="absolute z-10 grid h-[calc(100svh_-_76px)] w-full grid-rows-[auto_160px] place-items-center">
      <div />
      <div className="mb-20 flex w-full max-w-screen-sm justify-evenly">
        {stopwatch.matches('stopped') && (
          <>
            <Button data-cy="lap" disabled variant="secondary">
              Lap
            </Button>
            <Button data-cy="start" onClick={() => send({ type: 'start' })}>
              Start
            </Button>
          </>
        )}
        {stopwatch.matches('started') && (
          <>
            <Button
              data-cy="lap"
              onClick={() => send({ type: 'lap' })}
              variant="secondary"
            >
              Lap
            </Button>
            <Button
              data-cy="pause"
              onClick={() => send({ type: 'pause' })}
              variant="destructive"
            >
              Stop
            </Button>
          </>
        )}
        {stopwatch.matches('paused') && (
          <>
            <Button
              data-cy="reset"
              onClick={() => send({ type: 'reset' })}
              variant="secondary"
            >
              Reset
            </Button>
            <Button data-cy="resume" onClick={() => send({ type: 'resume' })}>
              Resume
            </Button>
          </>
        )}
      </div>
    </footer>
  )
}
