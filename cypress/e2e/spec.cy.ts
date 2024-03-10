describe('My First Test', () => {
  it('Gets, types and asserts', () => {
    cy.visit('/')

    cy.contains('Start').click()
    cy.contains('Stop').click()
    cy.contains('Resume').click()
    cy.contains('Stop').click()
  })
})
