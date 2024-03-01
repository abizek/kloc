import { setup, assign } from 'xstate'

export const stopwatchMachine = setup({
  types: {
    context: {} as {
      originTime: number
      elapsedTime: number
      ms: string
      ss: string
      mm: string
      hh: string
    },
    events: {} as
      | { type: 'start' }
      | { type: 'pause' }
      | { type: 'resume' }
      | { type: 'reset' },
  },
  actions: {
    startStopwatch: assign(() => ({
      originTime: Date.now(),
    })),
    updateElapsedTime: assign(({ context }) => {
      const elapsedTime = Date.now() - context.originTime,
        elapsedDateTime = new Date(elapsedTime),
        ms = ('0' + Math.floor(elapsedDateTime.getMilliseconds() / 10)).slice(
          -2,
        ),
        ss = ('0' + elapsedDateTime.getSeconds()).slice(-2),
        mm = ('0' + elapsedDateTime.getUTCMinutes()).slice(-2),
        hh = ('0' + elapsedDateTime.getUTCHours()).slice(-2)

      return { elapsedTime, ms, ss, mm, hh }
    }),
    updateOriginTime: assign(({ context }) => ({
      originTime: Date.now() - context.elapsedTime,
    })),
    resetStopwatch: assign({
      originTime: 0,
      elapsedTime: 0,
      ms: '00',
      ss: '00',
      mm: '00',
      hh: '00',
    }),
  },
  schemas: {
    events: {
      start: {
        type: 'object',
        properties: {},
      },
      pause: {
        type: 'object',
        properties: {},
      },
      resume: {
        type: 'object',
        properties: {},
      },
      reset: {
        type: 'object',
        properties: {},
      },
    },
    context: {
      elapsedTime: { type: 'number' },
      originTime: { type: 'number' },
      ms: { type: 'number' },
      ss: { type: 'number' },
      mm: { type: 'number' },
      hh: { type: 'number' },
    },
  },
}).createMachine({
  context: {
    originTime: 0,
    elapsedTime: 0,
    ms: '00',
    ss: '00',
    mm: '00',
    hh: '00',
  },
  id: 'stopwatch',
  initial: 'initialized',
  states: {
    initialized: {
      on: {
        start: {
          target: 'running',
          actions: {
            type: 'startStopwatch',
          },
        },
      },
    },
    running: {
      on: {
        pause: {
          target: 'paused',
        },
      },
      after: {
        '73': {
          target: 'running',
          actions: {
            type: 'updateElapsedTime',
          },
          reenter: true,
        },
      },
    },
    paused: {
      on: {
        resume: {
          target: 'running',
          actions: {
            type: 'updateOriginTime',
          },
        },
        reset: {
          target: 'initialized',
          actions: {
            type: 'resetStopwatch',
          },
        },
      },
    },
  },
})
