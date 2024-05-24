import PartySocket from 'partysocket'

const stopwatchInitialState = {
  context: { origin: 0, elapsed: 0, lapOrigin: 0, lapElapsed: 0, laps: [] },
  status: 'active',
  value: 'stopped',
}
const timerInitialState = {
  context: { remaining: 0, destination: 0, duration: 0 },
  status: 'active',
  value: { stopped: 'beepStopped' },
}

const createRoom = (room: string) =>
  new Promise<void>((resolve, reject) => {
    try {
      const ws = new PartySocket({
        host: 'localhost:1999',
        room,
        debug: true,
      })

      ws.addEventListener(
        'open',
        () => {
          ws.send(
            JSON.stringify({
              type: 'create',
              stopwatch: stopwatchInitialState,
              timer: timerInitialState,
            }),
          )
          ws.close()
          resolve()
        },
        { once: true },
      )
    } catch (error) {
      reject(error)
    }
  })

const deleteRoom = (room: string) =>
  new Promise<void>((resolve, reject) => {
    try {
      const ws = new PartySocket({
        host: 'localhost:1999',
        room,
        debug: true,
      })

      ws.addEventListener(
        'open',
        () => {
          ws.send(JSON.stringify({ type: 'delete' }))
          ws.close()
          resolve()
        },
        { once: true },
      )
    } catch (error) {
      reject(error)
    }
  })

Cypress.Commands.addAll({
  assertTabPresence: (tab: string) => {
    cy.get(`[data-cy="${tab}-trigger"]`)
      .should('have.attr', 'data-state')
      .and('match', /^active$/)

    cy.get(`[data-cy="${tab}-content"]`)
      .should('have.attr', 'data-state')
      .and('match', /^active$/)
  },
  assertTabAbsence: (tab: string) => {
    cy.get(`[data-cy="${tab}-trigger"]`)
      .should('have.attr', 'data-state')
      .and('match', /^inactive$/)

    cy.get(`[data-cy="${tab}-content"]`).should('not.exist')
  },
  createRoom,
  deleteRoom,
})
