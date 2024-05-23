describe('Root', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const tabs = [
    { tab: 'kloc', label: 'Kloc', route: '/kloc' },
    { tab: 'stopwatch', label: 'Stopwatch', route: '/stopwatch' },
    { tab: 'timer', label: 'Timer', route: '/timer' },
  ]

  describe('Handle 404', () => {
    it('redirects to home on invalid route', () => {
      cy.visit('/foo')
      cy.location('pathname').should('eq', '/kloc')
      cy.assertTabPresence('kloc')
      cy.assertTabAbsence('stopwatch')
      cy.assertTabAbsence('timer')
    })

    it('redirects to requested page on invalid slug', () => {
      tabs.forEach(({ route, tab }) => {
        cy.visit(route + '/foo/bar')
        cy.location('pathname').should('eq', route + '/foo')
        cy.assertTabPresence(tab)

        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ tab }) => {
            cy.assertTabAbsence(tab)
          })
      })
    })
  })

  describe('Tab Switch', () => {
    it('via route', () => {
      tabs.forEach(({ tab, route }, _, tabs) => {
        cy.clearAllLocalStorage()
        cy.visit(route)
        cy.assertTabPresence(tab)

        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ tab }) => {
            cy.assertTabAbsence(tab)
          })
      })
    })

    it('via route with slug', () => {
      tabs.forEach(({ tab, route }, _, tabs) => {
        cy.clearAllLocalStorage()
        cy.visit(route + '/foo')
        cy.assertTabPresence(tab)

        tabs
          .filter(({ tab: otherTab }) => tab !== otherTab)
          .forEach(({ tab }) => {
            cy.assertTabAbsence(tab)
          })
      })
    })

    it('via trigger', () => {
      tabs.forEach(({ tab: fromTab, label: fromLabel, route: fromRoute }) => {
        cy.get(`[data-cy="${fromTab}-trigger"]`).contains(fromLabel).click()
        cy.location('pathname').should('eq', fromRoute)
        cy.assertTabPresence(fromTab)

        tabs
          .filter(({ tab: otherTab }) => fromTab !== otherTab)
          .forEach(
            ({ tab: toTab, label: toLabel, route: toRoute }, _, tabs) => {
              cy.get(`[data-cy="${toTab}-trigger"]`).contains(toLabel).click()
              cy.location('pathname').should('not.eq', fromRoute)
              cy.location('pathname').should('eq', toRoute)
              cy.assertTabAbsence(fromTab)
              cy.assertTabPresence(toTab)

              tabs
                .filter(({ tab: otherTab }) => toTab !== otherTab)
                .forEach(({ tab }) => {
                  cy.assertTabAbsence(tab)
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
        cy.assertTabPresence(fromTab)

        tabs
          .filter(({ tab: otherTab }) => fromTab !== otherTab)
          .forEach(
            ({ tab: toTab, label: toLabel, route: toRoute }, _, tabs) => {
              cy.get(`[data-cy="${toTab}-trigger"]`).contains(toLabel).click()
              cy.location('pathname').should('not.eq', fromRoute)
              cy.location('pathname').should('not.eq', fromRoute + slug)
              cy.location('pathname').should('not.eq', toRoute)
              cy.location('pathname').should('eq', toRoute + slug)
              cy.assertTabAbsence(fromTab)
              cy.assertTabPresence(toTab)

              tabs
                .filter(({ tab: otherTab }) => toTab !== otherTab)
                .forEach(({ tab }) => {
                  cy.assertTabAbsence(tab)
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
