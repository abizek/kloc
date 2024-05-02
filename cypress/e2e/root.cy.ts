describe('Root', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Handle 404', () => {
    it('redirects to home', () => {
      cy.visit('/abcd')
      cy.location('pathname').should('eq', '/')
      cy.get('[data-cy="kloc-trigger"]')
        .should('have.attr', 'data-state')
        .and('match', /^active$/)
      cy.get('[data-cy="kloc-content"]')
        .should('have.attr', 'data-state')
        .and('match', /^active$/)

      cy.get('[data-cy="stopwatch-trigger"]')
        .should('have.attr', 'data-state')
        .and('match', /^inactive$/)
      cy.get('[data-cy="stopwatch-content"]').should('not.exist')
      cy.get('[data-cy="timer-trigger"]')
        .should('have.attr', 'data-state')
        .and('match', /^inactive$/)
      cy.get('[data-cy="timer-content"]').should('not.exist')
    })
  })

  const tabs = [
    { tab: 'kloc', label: 'Kloc', route: '/' },
    { tab: 'stopwatch', label: 'Stopwatch', route: '/stopwatch' },
    { tab: 'timer', label: 'Timer', route: '/timer' },
  ]

  describe('Tab Switch', () => {
    it('via route', () => {
      tabs.forEach(({ tab, route }, _, tabs) => {
        cy.clearAllLocalStorage()
        cy.visit(route)
        cy.get(`[data-cy="${tab}-trigger"]`)
          .should('have.attr', 'data-state')
          .and('match', /^active$/)
        cy.get(`[data-cy="${tab}-content"]`)
          .should('have.attr', 'data-state')
          .and('match', /^active$/)
        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ tab }) => {
            cy.get(`[data-cy="${tab}-trigger"]`)
              .should('have.attr', 'data-state')
              .and('match', /^inactive$/)
            cy.get(`[data-cy="${tab}-content"]`).should('not.exist')
          })
      })
    })

    it('via trigger', () => {
      tabs.forEach(({ tab: fromTab, label: fromLabel, route: fromRoute }) => {
        cy.get(`[data-cy="${fromTab}-trigger"]`).contains(fromLabel).click()
        cy.location('pathname').should('eq', fromRoute)
        cy.get(`[data-cy="${fromTab}-trigger"]`)
          .should('have.attr', 'data-state')
          .and('match', /^active$/)
        cy.get(`[data-cy="${fromTab}-content"]`)
          .should('have.attr', 'data-state')
          .and('match', /^active$/)
        tabs
          .filter(({ tab: otherTab }) => fromTab !== otherTab)
          .forEach(
            ({ tab: toTab, label: toLabel, route: toRoute }, _, tabs) => {
              cy.get(`[data-cy="${toTab}-trigger"]`).contains(toLabel).click()
              cy.location('pathname').should('not.eq', fromRoute)
              cy.location('pathname').should('eq', toRoute)
              cy.get(`[data-cy="${fromTab}-trigger"]`)
                .should('have.attr', 'data-state')
                .and('match', /^inactive$/)
              cy.get(`[data-cy="${toTab}-trigger"]`)
                .should('have.attr', 'data-state')
                .and('match', /^active$/)
              cy.get(`[data-cy="${fromTab}-content"]`).should('not.exist')
              cy.get(`[data-cy="${toTab}-content"]`)
                .should('have.attr', 'data-state')
                .and('match', /^active$/)
              tabs
                .filter(({ tab: otherTab }) => toTab !== otherTab)
                .forEach(({ tab }) => {
                  cy.get(`[data-cy="${tab}-trigger"]`)
                    .should('have.attr', 'data-state')
                    .and('match', /^inactive$/)
                  cy.get(`[data-cy="${tab}-content"]`).should('not.exist')
                })
            },
          )
      })
    })
  })

  describe('Persist Pathname', () => {
    it('remembers last visited path', () => {
      tabs.slice(1).forEach(({ route }) => {
        cy.visit(route)
        cy.location('pathname').should('eq', route)
        cy.visit('/')
        cy.location('pathname').should('eq', route)
      })
    })

    it('overrides last visited if specific path is requested', () => {
      tabs.forEach(({ tab, route: fromRoute }) => {
        tabs
          .slice(1)
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ route: toRoute }) => {
            cy.clearAllLocalStorage()
            cy.visit(fromRoute)
            cy.location('pathname').should('eq', fromRoute)
            cy.visit(toRoute)
            cy.location('pathname').should('eq', toRoute)
          })
      })
    })
  })
})
