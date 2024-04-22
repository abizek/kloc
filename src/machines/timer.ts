import { setup, assign, assertEvent, stateIn } from 'xstate'

export type TimerEvents =
  | { type: 'start'; time: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'reset' }
  | { type: 'jumpstart' }

export const timerMachine = setup({
  types: {
    context: {} as { remaining: number; destination: number; duration: number },
    events: {} as TimerEvents,
  },
  actions: {
    resetTimer: assign({
      remaining: 0,
      destination: 0,
      duration: 0,
    }),
    startTimer: assign(({ event }) => {
      assertEvent(event, 'start')

      return {
        duration: event.time,
        destination: Date.now() + event.time,
        remaining: 0,
      }
    }),
    resumeTimer: assign(({ context }) => ({
      destination: Date.now() + context.remaining,
    })),
    updateRemaining: assign(({ context }) => ({
      remaining: context.destination - Date.now(),
    })),
  },
  guards: {
    isComplete: ({ context }) => context.remaining < 0,
    isRunning: stateIn('running'),
  },
}).createMachine({
  context: {
    remaining: 0,
    destination: 0,
    duration: 0,
  },
  id: 'timer',
  initial: 'stopped',
  on: {
    jumpstart: {
      target: '#timer.running',
      guard: {
        type: 'isRunning',
      },
    },
  },
  states: {
    stopped: {
      on: {
        start: {
          target: 'running',
          actions: {
            type: 'startTimer',
          },
        },
      },
      entry: {
        type: 'resetTimer',
      },
    },
    running: {
      on: {
        pause: {
          target: 'paused',
        },
        reset: {
          target: 'stopped',
        },
      },
      after: {
        '10': {
          target: 'running',
          reenter: true,
        },
      },
      always: {
        target: 'stopped',
        guard: {
          type: 'isComplete',
        },
      },
      entry: {
        type: 'updateRemaining',
      },
    },
    paused: {
      on: {
        resume: {
          target: 'running',
          actions: {
            type: 'resumeTimer',
          },
        },
        reset: {
          target: 'stopped',
        },
      },
    },
  },
})
