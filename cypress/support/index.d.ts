/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    assertTabPresence(tab: string): Chainable
    assertTabAbsence(tab: string): Chainable
    createRoom(room: string): Chainable
    deleteRoom(room: string): Chainable
  }
}
