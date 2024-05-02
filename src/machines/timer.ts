import { assertEvent, assign, setup, stateIn } from 'xstate';
import { playBeep, stopBeep } from '../beep';

export type TimerEvents =
  | { type: 'start'; time: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'reset' }
  | { type: 'jumpstart' }
  | { type: 'stopBeep' }

export type TimerContext = { remaining: number; destination: number; duration: number }

export const timerMachine = setup({
  types: {
    context: {} as TimerContext,
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
    playBeep,
    stopBeep,
    onComplete: () => {},
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
      guard: { type: 'isRunning' },
    },
  },
  states: {
    stopped: {
      initial: 'beepStopped',
      on: {
        start: {
          target: 'running',
          actions: { type: 'startTimer' },
        },
      },
      entry: { type: 'resetTimer' },
      states: {
        beepStopped: {},
        beepPlaying: {
          on: { stopBeep: { target: 'beepStopped' } },
          entry: { type: 'playBeep' },
          exit: { type: 'stopBeep' },
        },
      },
    },
    running: {
      on: {
        pause: { target: 'paused' },
        reset: { target: 'stopped' },
      },
      after: {
        '10': { target: 'running', reenter: true },
      },
      always: {
        target: '#timer.stopped.beepPlaying',
        actions: { type: 'onComplete' },
        guard: { type: 'isComplete' },
      },
      entry: { type: 'updateRemaining' },
    },
    paused: {
      on: {
        resume: {
          target: 'running',
          actions: { type: 'resumeTimer' },
        },
        reset: { target: 'stopped' },
      },
    },
  },
})
