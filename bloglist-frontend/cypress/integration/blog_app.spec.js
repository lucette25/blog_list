describe('Blog app', function() {

  beforeEach(function() {
    cy.loggToWebPage()
  })

  it('Login form is shown', function() {
    cy.contains('Log into application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })


  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain','wrong password or username')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged-in')

    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })

    })

    it('A blog can be created', function() {
      cy.contains('New Blog').click()
      cy.get('#title').type('React patterns')
      cy.get('#author').type('Michael Chan')
      cy.get('#url').type('https://reactpatterns.com')
      cy.get('#create-button').click()

      cy.contains('React patterns by Michael Chan')
    })

    describe('and a blog exists', function () {
      beforeEach(function() {
        cy.createBlog({
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url : 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
        })
        cy.createBlog({
          title: 'React patterns',
          author: 'Michael Chan',
          url : 'https://reactpatterns.com'
        })

        cy.createBlog({
          title: 'First class tests',
          author: 'Roberto',
          url : 'https://reactpatterns.com'
        })

      })
      it('users can like a blog', function () {
        cy.contains('React patterns').parent().contains('View').click()

        cy.contains('React patterns').parent().contains('like').click()
        cy.contains('React patterns').parent().find('button')
          .should('contain', 'Hide')

        cy.contains('React patterns').parent()
          .should('contain','Likes:1')

      })

      it('users can delete a blog', function () {

        cy.contains('First class tests').parent().contains('View').click()
        cy.contains('First class tests').parent().contains('Delete').click()
        cy.get('html').should('not.contain', 'First class tests by Roberto')

      })
      it('blogs are ordered according to likes', function () {

        //Two likes to the second blog
        cy.contains('React patterns').parent().contains('View').click()
        cy.contains('React patterns').parent().contains('like').click()
        cy.contains('React patterns').parent().contains('like').click()




        //One like to the first
        cy.contains('Go To Statement Considered Harmful').parent().contains('View').click()
        cy.contains('Go To Statement Considered Harmful').parent().contains('like').click()


        cy.get('.title_author').eq(0).should('contain', 'React patterns')
        cy.get('.title_author').eq(1).should('contain', 'Go To Statement Considered Harmful')




      })


    })
  })

})