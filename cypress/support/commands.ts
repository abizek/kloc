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
})

// XXX: add partysocket create room command
// XXX: fix handle 404 2nd test, tab switch via trigger with slug, overrides last visited path if specific path is requested
