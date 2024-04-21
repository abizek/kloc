describe('Root', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Tab Switch', () => {
    const tabs = [
      { tab: 'kloc', label: 'Kloc', route: '/' },
      { tab: 'stopwatch', label: 'Stopwatch', route: '/stopwatch' },
      { tab: 'timer', label: 'Timer', route: '/timer' },
    ]

    it('via trigger', () => {
      tabs.forEach(({ tab, label, route }, _, tabs) => {
        cy.get(`[data-cy="${tab}-trigger"]`).contains(label).click()
        cy.get(`[data-cy="${tab}-trigger"]`)
          .should('have.attr', 'data-state')
          .and('match', /active/)
        cy.get(`[data-cy="${tab}-content"]`)
          .should('have.attr', 'data-state')
          .and('match', /active/)
        cy.location('pathname').should('eq', route)
        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ tab }) => {
            cy.get(`[data-cy="${tab}-trigger"]`)
              .should('have.attr', 'data-state')
              .and('match', /inactive/)
            cy.get(`[data-cy="${tab}-content"]`).should('not.exist')
          })
      })
    })

    it('via route', () => {
      tabs.forEach(({ tab, route }, _, tabs) => {
        cy.visit(route)
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
            cy.get(`[data-cy="${tab}-content"]`).should('not.exist')
          })
      })
    })
  })
})
