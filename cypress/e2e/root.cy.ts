describe('Root', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const tabs = [
    { tab: 'kloc', label: 'Kloc', route: '/kloc' },
    { tab: 'stopwatch', label: 'Stopwatch', route: '/stopwatch' },
    { tab: 'timer', label: 'Timer', route: '/timer' },
  ]

  const assertTabPresence = (tab: string, presence: boolean) => {
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

  describe('Handle 404', () => {
    it('redirects to home on invalid route', () => {
      cy.visit('/foo')
      cy.location('pathname').should('eq', '/kloc')
      assertTabPresence('kloc', true)
      assertTabPresence('stopwatch', false)
      assertTabPresence('timer', false)
    })

    it('redirects to requested page on invalid slug', () => {
      tabs.forEach(({ route, tab }) => {
        cy.visit(route + '/foo/bar')
        cy.location('pathname').should('eq', route + '/foo')
        assertTabPresence(tab, true)

        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ tab }) => {
            assertTabPresence(tab, false)
          })
      })
    })
  })

  describe('Tab Switch', () => {
    it('via route', () => {
      tabs.forEach(({ tab, route }, _, tabs) => {
        cy.clearAllLocalStorage()
        cy.visit(route)
        assertTabPresence(tab, true)

        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ tab }) => {
            assertTabPresence(tab, false)
          })
      })
    })

    it('via route with slug', () => {
      tabs.forEach(({ tab, route }, _, tabs) => {
        cy.clearAllLocalStorage()
        cy.visit(route + '/foo')
        assertTabPresence(tab, true)

        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ tab }) => {
            assertTabPresence(tab, false)
          })
      })
    })

    it('via trigger', () => {
      tabs.forEach(({ tab: fromTab, label: fromLabel, route: fromRoute }) => {
        cy.get(`[data-cy="${fromTab}-trigger"]`).contains(fromLabel).click()
        cy.location('pathname').should('eq', fromRoute)
        assertTabPresence(fromTab, true)

        tabs
          .filter(({ tab: otherTab }) => fromTab !== otherTab)
          .forEach(
            ({ tab: toTab, label: toLabel, route: toRoute }, _, tabs) => {
              cy.get(`[data-cy="${toTab}-trigger"]`).contains(toLabel).click()
              cy.location('pathname').should('not.eq', fromRoute)
              cy.location('pathname').should('eq', toRoute)
              assertTabPresence(fromTab, false)
              assertTabPresence(toTab, true)

              tabs
                .filter(({ tab: otherTab }) => toTab !== otherTab)
                .forEach(({ tab }) => {
                  assertTabPresence(tab, false)
                })
            },
          )
      })
    })

    it('via trigger with slug', () => {
      const slug = '/foo'
      cy.visit('/kloc' + slug)
      tabs.forEach(({ tab: fromTab, label: fromLabel, route: fromRoute }) => {
        cy.get(`[data-cy="${fromTab}-trigger"]`).contains(fromLabel).click()
        cy.location('pathname').should('not.eq', fromRoute)
        cy.location('pathname').should('eq', fromRoute + slug)
        assertTabPresence(fromTab, true)

        tabs
          .filter(({ tab: otherTab }) => fromTab !== otherTab)
          .forEach(
            ({ tab: toTab, label: toLabel, route: toRoute }, _, tabs) => {
              cy.get(`[data-cy="${toTab}-trigger"]`).contains(toLabel).click()
              cy.location('pathname').should('not.eq', fromRoute)
              cy.location('pathname').should('not.eq', fromRoute + slug)
              cy.location('pathname').should('not.eq', toRoute)
              cy.location('pathname').should('eq', toRoute + slug)
              assertTabPresence(fromTab, false)
              assertTabPresence(toTab, true)

              tabs
                .filter(({ tab: otherTab }) => toTab !== otherTab)
                .forEach(({ tab }) => {
                  assertTabPresence(tab, false)
                })
            },
          )
      })
    })
  })

  describe('Persist Pathname', () => {
    it('remembers last visited path', () => {
      tabs.forEach(({ route }) => {
        cy.visit(route)
        cy.location('pathname').should('eq', route)
        cy.visit('/')
        cy.location('pathname').should('eq', route)
      })
    })

    it('overrides last visited if specific path is requested', () => {
      tabs.forEach(({ tab, route: fromRoute }) => {
        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ route: toRoute }) => {
            cy.clearAllLocalStorage()
            cy.visit(fromRoute)
            cy.location('pathname').should('eq', fromRoute)
            cy.visit(toRoute)
            cy.location('pathname').should('eq', toRoute)
            cy.clearAllLocalStorage()
            const fromRouteWithSlug = fromRoute + '/foo'
            const toRouteWithSlug = toRoute + '/bar'
            cy.visit(fromRouteWithSlug)
            cy.location('pathname').should('eq', fromRouteWithSlug)
            cy.visit(toRouteWithSlug)
            cy.location('pathname').should('eq', toRouteWithSlug)
          })
      })
    })
  })
})
