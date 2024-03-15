describe('Kloc', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('seconds', () => {
    cy.clock()
    cy.get('[data-cy="kloc"').contains('12 : 00 : 00 AM')

    cy.tick(1000)
    cy.get('[data-cy="kloc"').contains('12 : 00 : 01 AM')

    cy.tick(1000 * 10)
    cy.get('[data-cy="kloc"').contains('12 : 00 : 11 AM')
  })

  it('minutes', () => {
    cy.clock(11000)
    cy.get('[data-cy="kloc"').contains('12 : 00 : 11 AM')

    cy.tick(1000 * 60)
    cy.get('[data-cy="kloc"').contains('12 : 01 : 11 AM')

    cy.tick(1000 * 60 * 10)
    cy.get('[data-cy="kloc"').contains('12 : 11 : 11 AM')
  })

  it('hours', () => {
    cy.clock(671000)
    cy.get('[data-cy="kloc"').contains('12 : 11 : 11 AM')

    cy.tick(1000 * 60 * 60)
    cy.get('[data-cy="kloc"').contains('01 : 11 : 11 AM')

    cy.tick(1000 * 60 * 60 * 10)
    cy.get('[data-cy="kloc"').contains('11 : 11 : 11 AM')
  })

  it('AM PM', () => {
    cy.clock(-1000)
    cy.get('[data-cy="kloc"').should('exist').contains('11 : 59 : 59 PM')

    cy.tick(1000)
    cy.get('[data-cy="kloc"').contains('12 : 00 : 00 AM')

    cy.tick(1000 * 60 * 60 * 12 - 1)
    cy.get('[data-cy="kloc"').should('exist').contains('11 : 59 : 59 AM')

    cy.tick(1)
    cy.get('[data-cy="kloc"').contains('12 : 00 : 00 PM')
  })
})
