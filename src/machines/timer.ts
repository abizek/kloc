import { setup, assign, assertEvent } from 'xstate'

export type TimerEvents =
  | { type: 'start'; time: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'reset' }

export const timerMachine = setup({
  types: {
    context: {} as { remaining: number; destination: number },
    events: {} as TimerEvents,
  },
  actions: {
    startTimer: assign(({ event }) => {
      assertEvent(event, 'start')

      return {
        destination: Date.now() + event.time,
        remaining: 0,
      }
    }),
    updateRemaining: assign(({ context }) => ({
      remaining: context.destination - Date.now(),
    })),
    resumeTimer: assign(({ context }) => ({
      destination: Date.now() + context.remaining,
    })),
    resetTimer: assign({
      remaining: 0,
      destination: 0,
    }),
  },
  guards: {
    isComplete: ({ context }) => context.remaining < 0,
  },
}).createMachine({
  context: {
    remaining: 0,
    destination: 0,
  },
  id: 'timer',
  initial: 'stopped',
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
    },
    running: {
      on: {
        pause: {
          target: 'paused',
        },
        reset: {
          target: 'stopped',
          actions: {
            type: 'resetTimer',
          },
        },
      },
      after: {
        '10': {
          target: 'running',
          actions: {
            type: 'updateRemaining',
          },
          reenter: true,
        },
      },
      always: {
        target: 'stopped',
        actions: {
          type: 'resetTimer',
        },
        guard: {
          type: 'isComplete',
        },
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
          actions: {
            type: 'resetTimer',
          },
        },
      },
    },
  },
})
