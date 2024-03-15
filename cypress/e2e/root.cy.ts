describe('Root', () => {
  beforeEach(() => {
    cy.clock()
    cy.visit('/')
  })

  it('tabs', () => {
    const tabs = [
      { tab: 'kloc', label: 'Kloc' },
      { tab: 'stopwatch', label: 'Stopwatch' },
      { tab: 'timer', label: 'Timer' },
    ]

    tabs.forEach(({ tab, label }, _, tabs) => {
      cy.get(`[data-cy="${tab}-trigger"]`).contains(label).click()
      cy.get(`[data-cy="${tab}-trigger"]`)
        .should('have.attr', 'data-state')
        .and('match', /active/)
      cy.get(`[data-cy="${tab}-content"]`)
        .should('have.attr', 'data-state')
        .and('match', /active/)
      tabs
        .filter(({ tab: otherTab }) => tab !== otherTab)
        .forEach(({ tab }) => {
          cy.get(`[data-cy="${tab}-trigger"]`)
            .should('have.attr', 'data-state')
            .and('match', /inactive/)
          cy.get(`[data-cy="${tab}-content"]`)
            .should('have.attr', 'data-state')
            .and('match', /inactive/)
        })
    })
  })
})
