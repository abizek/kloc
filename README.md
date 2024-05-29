# Kloc

Shareable stopwatch and timer. UX _inspired_ by the Samsung clock app.

Check out the app at https://kloc.pages.dev

Check out the [stopwatch](https://stately.ai/registry/editor/350b30e8-7251-4b58-bd6c-670bfee8af31?mode=design&machineId=b50146c3-1632-41cc-bd44-baa31457f6cf) and [timer](https://stately.ai/registry/editor/350b30e8-7251-4b58-bd6c-670bfee8af31?mode=design&machineId=04d2084b-bb49-4e65-b68e-3db3ac7c40ae) state machines on the stately.ai visualizer

> [!NOTE]
> _Timer UX is 🚧 under renovation 🚧_
>
> _New features coming soon ⛏_
>
> _Keep posted!_

## Use Cases

* This is a simple one. You are running a marathon, one person starts the stopwatch at the beginning of the track and another person stops it when the track ends. You could also have people track the time you took to complete different sections with the lap feature
* Track how long it has been since your last vacation / date / any other stuff that you want to do again
* Countdown to next vacation / retirement / any other event that you are looking forward to
* Sharing your stopwatch/timer with your accountability partner for a study session or any accountability-related thing
* Productivity / remote collaboration stuff with your co-worker or team
* Timed activities like classroom quizzes, timed practice sessions or a timed challenge on a game
* Some crazy stuff I haven't thought about

## Development

> Made using [Xstate](https://stately.ai/docs/xstate) for maintaining state, [Partykit](https://www.partykit.io) for sharing the state, [Radix UI](https://www.radix-ui.com) and [Framer Motion](https://www.framer.com/motion).

1. Run `npm i`
2. Run `npm run dev` and the app should be served on `http://localhost:5173` and the partykit server on `http://localhost:1999`

* Run cypress e2e tests with `npm t`. For headed use `npm run cy:open`
