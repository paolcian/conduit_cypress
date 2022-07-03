import faker from "@faker-js/faker"
import routes from "../routes"
import selectors from "../selectors"

const InputPassword = function () {
  return cy
    .fixture('example.json').as('data').then((user) => {
      cy
        .get(selectors.login.passwordInputField)
        .should("be.enabled")
        .type(user.password)
    })
}

const InputEmail = function () {
  return cy
    .fixture('example.json').as('data').then((user) => {
      cy
        .get(selectors.login.usernameInputField)
        .should("be.enabled")
        .type(user.email)
    })
}

const SubmitLogin = () => {
  return cy
    .get(selectors.login.loginButton)
    .should("be.visible")
    .should("be.enabled")
    .click()
}

describe('Login feature', () => {
  beforeEach(() => {
    cy.visit(routes.login)
    cy.fixture('example.json').as('data')
  })
 
  it('Login with valid credentials', function () {
    cy.createUser().then((user) => {
      cy
        .get(selectors.login.usernameInputField)
        .should("be.enabled")
        .type(user.email)
        .get(selectors.login.passwordInputField)
        .should("be.enabled")
        .type(user.password).then(() => {
          SubmitLogin().then(() => {
            cy
              .get(selectors.login.nameText)
              .should('be.visible')
              .should('contain', user.username)
          })
        })
    })
  })
  
  it('Login with invalid email address', function () {
    const randomEmail = faker.internet.email();
    cy
      .get(selectors.login.usernameInputField)
      .should("be.enabled")
      .type(randomEmail).then(() => {
        InputPassword().then(() => {
          SubmitLogin().then(() =>
            cy
              .get(selectors.login.errorInvalid)
              .should('be.visible')
              .invoke('text')
              .should('contain', this.data.errorInvalidEmail))
        })
      })
  })

  it('Login with invalid password', function () {
    const randomPassword = faker.internet.password();
    InputEmail().then(() => {
      cy
        .get(selectors.login.passwordInputField)
        .should("be.enabled")
        .type(randomPassword).then(() => {
          SubmitLogin().then(() => {
            cy
              .get(selectors.login.errorInvalid)
              .should('be.visible')
              .invoke('text')
              .should('contain', this.data.errorInvalidPassword)
          })
        })
    })
  })

  it('Login with empty email field', function () {
    InputPassword().then(() => {
      SubmitLogin().then(() => {
        cy
          .get(selectors.login.errorInvalid)
          .should('be.visible')
          .invoke('text')
          .should('contain', this.data.errorBlank)
      })
    })
  })

  it('Login with empty password field', function () {
    InputEmail().then(() => {
      SubmitLogin().then(() => {
        cy
          .get(selectors.login.errorInvalid)
          .should('be.visible')
          .invoke('text')
          .should('contain', this.data.errorPasswordBlank)
      })
    })
  })
})
