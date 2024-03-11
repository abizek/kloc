import { Events } from '../stopwatchMachine'
import { Button } from './Button'

type FooterProps = {
  send: (event: Events) => void
  stopped: boolean
  started: boolean
  paused: boolean
}

export function Footer({ send, stopped, started, paused }: FooterProps) {
  return (
    <footer className="absolute grid min-h-svh w-full grid-rows-[auto_max(100px,_15svh)]">
      <div />
      <div className="flex w-full max-w-screen-sm justify-evenly place-self-center self-start">
        {stopped && (
          <>
            <Button data-cy="lap" disabled variant="secondary">
              Lap
            </Button>
            <Button data-cy="start" onClick={() => send({ type: 'start' })}>
              Start
            </Button>
          </>
        )}
        {started && (
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
        {paused && (
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
