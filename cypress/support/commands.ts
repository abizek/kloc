const assertTab = (tab: string, presence: boolean) => {
  const matchValue = presence ? /^active$/ : /^inactive$/
  cy.get(`[data-cy="${tab}-trigger"]`)
    .should('have.attr', 'data-state')
    .and('match', matchValue)
  presence
    ? cy
        .get(`[data-cy="${tab}-content"]`)
        .should('have.attr', 'data-state')
        .and('match', matchValue)
    : cy.get(`[data-cy="${tab}-content"]`).should('not.exist')
}

Cypress.Commands.addAll({
  assertTabPresence: (tab: string) => {
    assertTab(tab, true)
  },
  assertTabAbsence: (tab: string) => {
    assertTab(tab, false)
  },
})
