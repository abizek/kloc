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
      cy.get('[data-cy="timer"]').should('be.visible').contains('50')
    })

    it('pause', () => {
      cy.get('[data-cy="seconds-input"]').type('{selectall}01')
      cy.get('[data-cy="start"]').click()
      cy.tick(500)
      cy.get('[data-cy="pause"]').contains('Pause').click()
      cy.get('[data-cy="pause"]').should('not.exist')
      cy.get('[data-cy="timer"]').contains('50')
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
      cy.get('[data-cy="timer"]').contains('25')
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
      cy.get('[data-cy="timer"]').contains('50')
      cy.tick(250)
      cy.get('[data-cy="timer"]').contains('25')
    })

    it('seconds', () => {
      cy.get('[data-cy="seconds-input"]').type('{selectall}05')
      cy.get('[data-cy="start"]').click()
      cy.tick(2500)
      cy.get('[data-cy="timer"]').contains('02 : 50')
      cy.tick(2000)
      cy.get('[data-cy="timer"]').contains('50')
    })

    it('minutes', () => {
      cy.get('[data-cy="minutes-input"]').type('{selectall}05')
      cy.get('[data-cy="seconds-input"]').type('{selectall}01')
      cy.get('[data-cy="start"]').click()
      cy.tick(1000)
      cy.get('[data-cy="timer"]').contains('05 : 00 : 00')
      cy.tick(1000 * 60 * 2.5)
      cy.get('[data-cy="timer"]').contains('02 : 30 : 00')
      cy.tick(1000 * 60 * 2)
      cy.get('[data-cy="timer"]').contains('30 : 00')
    })

    it('hours', () => {
      cy.get('[data-cy="hours-input"]').type('{selectall}02')
      cy.get('[data-cy="start"]').click()
      cy.tick(1000 * 60 * 60)
      cy.get('[data-cy="timer"]').contains('01 : 00 : 00 : 00')
      cy.tick(1000 * 5)
      cy.get('[data-cy="timer"]').contains('59 : 55 : 00')
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
        cy.get('[data-cy="timer"]').contains('50')
        cy.get('[data-cy="pause"]').click()
        cy.get('[data-cy="resume"]').should('be.visible')

        switchTabs()
        cy.get('[data-cy="resume"]').should('be.visible')
        cy.get('[data-cy="timer"]').contains('50')
      })

      it('stopped', () => {
        cy.get('[data-cy="seconds-input"]').type('{selectall}01')
        cy.get('[data-cy="start"]').click()
        cy.tick(500)
        cy.get('[data-cy="timer"]').contains('50')
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
        cy.get('[data-cy="timer"]').contains('02 : 50')

        switchTabs()
        cy.get('[data-cy="pause"]').should('be.visible')
        cy.get('[data-cy="timer"]').contains('02 : 50')
        cy.tick(1000)
        cy.get('[data-cy="timer"]').contains('01 : 50')
      })

      function switchTabs() {
        cy.get('[data-cy="kloc-trigger"]').click()
        cy.get('[data-cy="timer-trigger"]').click()
      }
    })
  })
})
