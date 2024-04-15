describe('Timer', () => {
  beforeEach(() => {
    cy.clock(Date.now())
    cy.visit('/')
    cy.get('[data-cy="timer-trigger"]').click()
  })

  describe('Actions', () => {
    it('start', () => {
      cy.get('[data-cy="seconds-input"]').type('{selectall}01')
      cy.get('[data-cy="start"]').contains('Start').click()
      cy.get('[data-cy="start"]').should('not.exist')
      cy.tick(500)
      cy.get('[data-cy="timer"]').should('be.visible').contains('50ms')
    })

    it('pause', () => {
      cy.get('[data-cy="seconds-input"]').type('{selectall}01')
      cy.get('[data-cy="start"]').click()
      cy.tick(500)
      cy.get('[data-cy="pause"]').contains('Pause').click()
      cy.get('[data-cy="pause"]').should('not.exist')
      cy.get('[data-cy="timer"]').contains('50ms')
    })

    it('resume', () => {
      cy.get('[data-cy="seconds-input"]').type('{selectall}01')
      cy.get('[data-cy="start"]').click()
      cy.tick(500)
      cy.get('[data-cy="pause"]').click()
      cy.tick(1000)
      cy.get('[data-cy="resume"]').contains('Resume').click()
      cy.get('[data-cy="resume"]').should('not.exist')
      cy.tick(250)
      cy.get('[data-cy="timer"]').contains('25ms')
    })

    it('cancel', () => {
      cy.get('[data-cy="seconds-input"]').type('{selectall}01')
      cy.get('[data-cy="start"]').click()
      cy.tick(500)
      cy.get('[data-cy="reset"]').contains('Cancel').click()
      cy.get('[data-cy="reset"]').should('not.exist')
      cy.get('[data-cy="start"]').should('exist')
      cy.get('[data-cy="timer"]').should('not.exist')
    })
  })

  describe('Time View', () => {
    it('milliseconds', () => {
      cy.get('[data-cy="seconds-input"]').type('{selectall}01')
      cy.get('[data-cy="start"]').click()
      cy.tick(500)
      cy.get('[data-cy="timer"]').contains('50ms')
      cy.tick(250)
      cy.get('[data-cy="timer"]').contains('25ms')
    })

    it('seconds', () => {
      cy.get('[data-cy="seconds-input"]').type('{selectall}05')
      cy.get('[data-cy="start"]').click()
      cy.tick(2500)
      cy.get('[data-cy="timer"]').contains('02s 50ms')
      cy.tick(2000)
      cy.get('[data-cy="timer"]').contains('50ms')
    })

    it('minutes', () => {
      cy.get('[data-cy="minutes-input"]').type('{selectall}05')
      cy.get('[data-cy="seconds-input"]').type('{selectall}01')
      cy.get('[data-cy="start"]').click()
      cy.tick(1000)
      cy.get('[data-cy="timer"]').contains('05m 00s 00ms')
      cy.tick(1000 * 60 * 2.5)
      cy.get('[data-cy="timer"]').contains('02m 30s 00ms')
      cy.tick(1000 * 60 * 2)
      cy.get('[data-cy="timer"]').contains('30s 00ms')
    })

    it('hours', () => {
      cy.get('[data-cy="hours-input"]').type('{selectall}02')
      cy.get('[data-cy="start"]').click()
      cy.tick(1000 * 60 * 60)
      cy.get('[data-cy="timer"]').contains('01h 00m 00s 00ms')
      cy.tick(1000 * 5)
      cy.get('[data-cy="timer"]').contains('59m 55s 00ms')
    })
  })

  describe('Persist State', () => {
    describe('Local Storage', () => {
      it('input', () => {
        cy.get('[data-cy="hours-input"]').should('have.value', '00')
        cy.get('[data-cy="minutes-input"]').should('have.value', '00')
        cy.get('[data-cy="seconds-input"]').should('have.value', '00')
        cy.get('[data-cy="hours-input"]').type('{selectall}01')
        cy.get('[data-cy="minutes-input"]').type('{selectall}02')
        cy.get('[data-cy="seconds-input"]').type('{selectall}03')
        cy.reload()
        cy.get('[data-cy="timer-trigger"]').click()
        cy.get('[data-cy="hours-input"]').should('have.value', '01')
        cy.get('[data-cy="minutes-input"]').should('have.value', '02')
        cy.get('[data-cy="seconds-input"]').should('have.value', '03')
      })
    })

    describe('Session Storage', () => {
      it('paused', () => {
        cy.get('[data-cy="seconds-input"]').type('{selectall}01')
        cy.get('[data-cy="start"]').click()
        cy.tick(500)
        cy.get('[data-cy="timer"]').contains('50ms')
        cy.get('[data-cy="pause"]').click()
        cy.get('[data-cy="resume"]').should('be.visible')

        switchTabs()
        cy.get('[data-cy="resume"]').should('be.visible')
        cy.get('[data-cy="timer"]').contains('50ms')
      })

      it('stopped', () => {
        cy.get('[data-cy="seconds-input"]').type('{selectall}01')
        cy.get('[data-cy="start"]').click()
        cy.tick(500)
        cy.get('[data-cy="timer"]').contains('50ms')
        cy.get('[data-cy="pause"]').click()
        cy.get('[data-cy="reset"]').click()
        cy.get('[data-cy="start"]').should('be.visible')

        switchTabs()
        cy.get('[data-cy="start"]').should('be.visible')
        cy.get('[data-cy="timer"]').should('not.exist')
      })

      it('started', () => {
        cy.get('[data-cy="seconds-input"]').type('{selectall}03')
        cy.get('[data-cy="start"]').click()
        cy.get('[data-cy="pause"]').should('be.visible')
        cy.tick(500)
        cy.get('[data-cy="timer"]').contains('02s 50ms')

        switchTabs()
        cy.get('[data-cy="pause"]').should('be.visible')
        cy.get('[data-cy="timer"]').contains('02s 50ms')
        cy.tick(1000)
        cy.get('[data-cy="timer"]').contains('01s 50ms')
      })

      function switchTabs() {
        cy.get('[data-cy="kloc-trigger"]').click()
        cy.get('[data-cy="timer-trigger"]').click()
      }
    })
  })
})
