import PartySocket from 'partysocket'
import stopwatchInitialState from '../fixtures/stopwatchInitialState.json'
import timerInitialState from '../fixtures/timerInitialState.json'

const createRoom = (room: string) =>
  new Promise<object>((resolve, reject) => {
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
        },
        { once: true },
      )

      const timeoutId = setTimeout(() => {
        ws.removeEventListener('message', onMessage)
        ws.close()
        resolve(null)
      }, 1000)

      const onMessage = (event: MessageEvent) => {
        clearTimeout(timeoutId)
        ws.close()
        resolve(event.data)
      }

      ws.addEventListener('message', onMessage, { once: true })
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

const joinRoom = (room: string) =>
  new Promise<object>((resolve, reject) => {
    try {
      const ws = new PartySocket({
        host: 'localhost:1999',
        room,
        debug: true,
      })

      ws.addEventListener(
        'open',
        () => {
          ws.send(JSON.stringify({ type: 'join' }))
        },
        { once: true },
      )

      ws.addEventListener(
        'message',
        (event) => {
          ws.close()
          resolve(event.data)
        },
        { once: true },
      )
    } catch (error) {
      reject(error)
    }
  })

const updateRoom = (room: string, state: object) =>
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
          ws.send(JSON.stringify({ type: 'update', ...state }))
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
  joinRoom,
  updateRoom,
})
