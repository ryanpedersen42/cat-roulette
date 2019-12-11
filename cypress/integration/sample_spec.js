describe('My First Test', function() {
  it('finds the content "type"', function() {
    cy.visit('localhost:3000')

    cy.contains('3Box Auth').click()
  })
})