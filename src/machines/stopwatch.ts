import { nanoid } from 'nanoid'
import { setup, assign, stateIn } from 'xstate'

export type Lap = {
  id: string
  elapsed: number
  overall: number
}

export type StopwatchEvents =
  | { type: 'start' }
  | { type: 'lap' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'reset' }
  | { type: 'jumpstart' }

export const stopwatchMachine = setup({
  types: {
    context: {} as {
      origin: number
      elapsed: number
      lapOrigin: number
      lapElapsed: number
      laps: Lap[]
    },
    events: {} as StopwatchEvents,
  },
  actions: {
    resetStopwatch: assign({
      origin: 0,
      elapsed: 0,
      lapOrigin: 0,
      lapElapsed: 0,
      laps: [],
    }),
    setOrigin: assign(({ context }) => ({
      origin: Date.now() - context.elapsed,
    })),
    setElapsed: assign(({ context }) => ({
      elapsed: Date.now() - context.origin,
    })),
    setLapOrigin: assign(({ context }) => ({
      lapOrigin: Date.now() - context.lapElapsed,
    })),
    setLapElapsed: assign(({ context }) => ({
      lapElapsed: Date.now() - context.lapOrigin,
    })),
    addFirstLap: assign(({ context }) => ({
      laps: [
        {
          id: nanoid(),
          elapsed: context.elapsed,
          overall: context.elapsed,
        },
      ],
    })),
    addLap: assign(({ context }) => ({
      laps: [
        {
          id: nanoid(),
          elapsed: context.lapElapsed,
          overall: context.elapsed,
        },
        ...context.laps,
      ],
    })),
    resetLapElapsed: assign({
      lapElapsed: 0,
    }),
  },
  guards: {
    isLapStopwatchStopped: stateIn({ started: { lapStopwatch: 'stopped' } }),
  },
}).createMachine({
  context: {
    origin: 0,
    elapsed: 0,
    lapOrigin: 0,
    lapElapsed: 0,
    laps: [],
  },
  id: 'stopwatch',
  initial: 'stopped',
  states: {
    stopped: {
      on: { start: { target: 'started' } },
      entry: { type: 'resetStopwatch' },
    },
    started: {
      type: 'parallel',
      on: {
        pause: { target: 'paused' },
      },
      entry: { type: 'setOrigin' },
      states: {
        mainStopwatch: {
          initial: 'running',
          on: { jumpstart: { target: 'mainStopwatch' } },
          states: {
            running: {
              after: { '10': { target: 'running', reenter: true } },
              entry: { type: 'setElapsed' },
            },
          },
        },
        lapStopwatch: {
          initial: 'stopped',
          states: {
            stopped: {
              on: {
                lap: { target: 'started', actions: { type: 'addFirstLap' } },
              },
            },
            started: {
              initial: 'running',
              on: {
                lap: {
                  target: 'started',
                  actions: [{ type: 'addLap' }, { type: 'resetLapElapsed' }],
                  reenter: true,
                },
                jumpstart: { target: 'started' },
              },
              entry: { type: 'setLapOrigin' },
              states: {
                running: {
                  after: { '10': { target: 'running', reenter: true } },
                  entry: { type: 'setLapElapsed' },
                },
              },
            },
          },
        },
      },
    },
    paused: {
      on: {
        resume: [
          { target: 'started', guard: { type: 'isLapStopwatchStopped' } },
          { target: '#stopwatch.started.lapStopwatch.started' },
        ],
        reset: { target: 'stopped' },
      },
    },
  },
})
