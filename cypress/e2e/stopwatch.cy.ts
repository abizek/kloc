describe('Stopwatch', () => {
  beforeEach(() => {
    cy.visit('/stopwatch')
    cy.clock(Date.now())
  })

  describe('Basics', () => {
    it('start', () => {
      cy.get('[data-cy="elapsed"]').contains('00 : 00 . 00')
      cy.get('[data-cy="start"]').contains('Start').should('be.visible').click()
      cy.get('[data-cy="start"]').should('not.exist')
      cy.tick(1050)
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 05')
    })

    it('pause', () => {
      cy.get('[data-cy="start"]').click()
      cy.tick(1050)
      cy.get('[data-cy="pause"]').should('be.visible').contains('Stop').click()
      cy.get('[data-cy="pause"]').should('not.exist')
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 05')
      cy.tick(1050)
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 05')
    })

    it('resume', () => {
      cy.get('[data-cy="start"]').click()
      cy.tick(1050)
      cy.get('[data-cy="pause"]').click()
      cy.get('[data-cy="resume"]')
        .contains('Resume')
        .should('be.visible')
        .click()
      cy.get('[data-cy="resume"]').should('not.exist')
      cy.get('[data-cy="lap"]').should('be.visible')
      cy.tick(1050)
      cy.get('[data-cy="elapsed"]').contains('00 : 02 . 10')
    })

    it('reset', () => {
      cy.get('[data-cy="start"]').click()
      cy.tick(1050)
      cy.get('[data-cy="pause"]').click()
      cy.get('[data-cy="reset"]').contains('Reset').should('be.visible').click()
      cy.get('[data-cy="elapsed"]').contains('00 : 00 . 00')
      cy.get('[data-cy="start"]').should('be.visible')
    })

    it('hours', () => {
      cy.get('[data-cy="start"]').should('be.visible').click()
      cy.tick(1000 * 60 * 60)
      cy.get('[data-cy="elapsed"]').contains('01 : 00 : 00 . 00')
    })
  })

  describe('Laps', () => {
    it('start', () => {
      cy.get('[data-cy="elapsed"]').contains('00 : 00 . 00')
      cy.get('[data-cy="lap"]').contains('Lap').should('have.attr', 'disabled')
      cy.get('[data-cy="start"]').click()
      cy.get('[data-cy="start"]').should('not.exist')
      cy.get('[data-cy="lap"]')
        .contains('Lap')
        .should('be.visible')
        .should('not.have.attr', 'disabled')
      cy.tick(1050)
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 05')
    })

    it('lap', () => {
      cy.get('[data-cy="lap-elapsed"]').should('not.exist')
      cy.get('[data-cy="start"]').click()
      cy.tick(1050)
      cy.get('[data-cy="lap"]').contains('Lap').should('be.visible').click()
      cy.get('[data-cy="lap"]').should('be.visible')
      cy.get('[data-cy="lap-elapsed"]')
        .contains('00 : 00 . 00')
        .should('be.visible')
      cy.contains('Lap')
      cy.contains('Lap time')
      cy.contains('Overall time')
      cy.get('[data-radix-scroll-area-viewport]').should('be.visible')
      cy.get('[data-cy="lap-time-1"]').contains('00:01.05')
      cy.get('[data-cy="overall-time-1"]').contains('00:01.05')
      cy.tick(1050)
      cy.get('[data-cy="lap-elapsed"]')
        .should('be.visible')
        .contains('00 : 01 . 05')
    })

    it('pause', () => {
      cy.get('[data-cy="start"]').click()
      cy.get('[data-cy="lap"]').click()
      cy.tick(1050)
      cy.get('[data-cy="lap-elapsed"]').contains('00 : 01 . 05')
      cy.get('[data-cy="pause"]').click()
      cy.tick(1050)
      cy.get('[data-cy="lap-elapsed"]')
        .should('be.visible')
        .contains('00 : 01 . 05')
      cy.get('[data-radix-scroll-area-viewport]').should('be.visible')
    })

    it('resume', () => {
      cy.get('[data-cy="start"]').click()
      cy.get('[data-cy="lap"]').click()
      cy.tick(1050)
      cy.get('[data-cy="lap-elapsed"]').contains('00 : 01 . 05')
      cy.get('[data-cy="pause"]').click()
      cy.get('[data-cy="resume"]').click()
      cy.tick(1050)
      cy.get('[data-cy="lap-elapsed"]').contains('00 : 02 . 10')
    })

    it('reset', () => {
      cy.get('[data-cy="start"]').click()
      cy.get('[data-cy="lap"]').click()
      cy.tick(1050)
      cy.get('[data-cy="lap-elapsed"]').contains('00 : 01 . 05')
      cy.get('[data-cy="pause"]').click()
      cy.get('[data-cy="reset"]').click()
      cy.get('[data-cy="lap-elapsed"]').should('not.exist')
      cy.get('[data-radix-scroll-area-viewport]').should('not.exist')
    })

    it('immediate laps', () => {
      cy.get('[data-cy="start"]').click()
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-time-1"]').contains('00:00.00')
      cy.get('[data-cy="overall-time-1"]').contains('00:00.00')
      cy.tick(1050)
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-time-2"]').contains('00:01.05')
      cy.get('[data-cy="overall-time-2"]').contains('00:01.05')
      cy.tick(1060)
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-time-3"]').contains('00:01.06')
      cy.get('[data-cy="overall-time-3"]').contains('00:02.11')
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-time-4"]').contains('00:00.00')
      cy.get('[data-cy="overall-time-4"]').contains('00:02.11')
    })

    it('minmax laps', () => {
      cy.get('[data-cy="start"]').click()
      cy.tick(2010)
      cy.get('[data-cy="lap"]').click()
      cy.tick(1010)
      cy.get('[data-cy="lap-elapsed"]').contains('00 : 01 . 01')
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-time-2"]').contains('00:01.01')

      cy.tick(1020)
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-1"]')
        .should('have.attr', 'data-stat')
        .and('match', /max/)
      cy.get('[data-cy="lap-2"]')
        .should('have.attr', 'data-stat')
        .and('match', /min/)

      cy.tick(500)
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-1"]')
        .should('have.attr', 'data-stat')
        .and('match', /max/)
      cy.get('[data-cy="lap-4"]')
        .should('have.attr', 'data-stat')
        .and('match', /min/)

      cy.tick(1050)
      cy.get('[data-cy="lap"]').click()

      cy.tick(2500)
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-6"]')
        .should('have.attr', 'data-stat')
        .and('match', /max/)
      cy.get('[data-cy="lap-4"]')
        .should('have.attr', 'data-stat')
        .and('match', /min/)
    })

    it('scrollable laps', () => {
      cy.get('[data-cy="start"]').click()
      cy.tick(1050)
      Array(6)
        .fill(0)
        .map(() => {
          cy.get('[data-cy="lap"]').click()
          cy.tick(1050)
        })
      cy.get('[data-cy="lap-time-1"]').should('not.be.visible')
      cy.get('[data-cy="overall-time-1"]').should('not.be.visible')
      cy.get('[data-cy="lap-time-1"]').click()
      cy.get('[data-cy="lap-time-6"]').should('not.be.visible')
      cy.get('[data-cy="overall-time-6"]').should('not.be.visible')
      cy.get('[data-cy="lap-time-1"]').should('be.visible')
      cy.get('[data-cy="overall-time-1"]').should('be.visible')
    })

    it('hours', () => {
      cy.get('[data-cy="start"]').click()
      cy.get('[data-cy="lap"]').click()
      cy.tick(1000 * 60 * 60)
      cy.get('[data-cy="lap-elapsed"]').contains('01 : 00 : 00 . 00')
    })
  })

  describe('Persist state', () => {
    it('paused', () => {
      cy.get('[data-cy="start"]').click()
      cy.tick(1000)
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 00')
      cy.get('[data-cy="pause"]').click()
      cy.get('[data-cy="resume"]').should('be.visible')

      switchTabs()
      cy.get('[data-cy="resume"]').should('be.visible')
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 00')
    })

    it('stopped', () => {
      cy.get('[data-cy="start"]').click()
      cy.tick(1000)
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 00')
      cy.get('[data-cy="pause"]').click()
      cy.get('[data-cy="reset"]').click()
      cy.get('[data-cy="start"]').should('be.visible')

      switchTabs()
      cy.get('[data-cy="start"]').should('be.visible')
      cy.get('[data-cy="elapsed"]').contains('00 : 00 . 00')
    })

    it('started', () => {
      cy.get('[data-cy="start"]').click()
      cy.get('[data-cy="pause"]').should('be.visible')
      cy.tick(1000)
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 00')

      switchTabs()
      cy.get('[data-cy="pause"]').should('be.visible')
      cy.get('[data-cy="lap-elapsed"]').should('not.exist')
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 00')
      cy.tick(1000)
      cy.get('[data-cy="elapsed"]').contains('00 : 02 . 00')
    })

    it('lap started', () => {
      cy.get('[data-cy="start"]').click()
      cy.get('[data-cy="pause"]').should('be.visible')
      cy.tick(1000)
      cy.get('[data-cy="elapsed"]').contains('00 : 01 . 00')
      cy.get('[data-cy="lap"]').click()
      cy.get('[data-cy="lap-elapsed"]').contains('00 : 00 . 00')
      cy.tick(1000)
      cy.get('[data-cy="lap-elapsed"]').contains('00 : 01 . 00')
      cy.get('[data-cy="elapsed"]').contains('00 : 02 . 00')

      switchTabs()
      cy.get('[data-cy="pause"]').should('be.visible')
      cy.tick(1000)
      cy.get('[data-cy="lap-elapsed"]').contains('00 : 02 . 00')
      cy.get('[data-cy="elapsed"]').contains('00 : 03 . 00')
    })

    function switchTabs() {
      cy.get('[data-cy="kloc-trigger"]').click()
      cy.get('[data-cy="stopwatch-trigger"]').click()
    }
  })
})
