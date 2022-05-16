/* eslint-disable linebreak-style */

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password }).then(response => {
    localStorage.setItem('loggedBlogUser', JSON.stringify(response.body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('loggToWebPage', () => {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
  const user = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
  }
  cy.request('POST', 'http://localhost:3003/api/users/', user)
  cy.visit('http://localhost:3000')
})

Cypress.Commands.add('createBlog', ({ title, author,url }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author,url },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})