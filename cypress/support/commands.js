import faker from "@faker-js/faker";
import routes from "../e2e/routes";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const url = "https://api.realworld.io/api"

Cypress.Commands.add('createUser', () => {
    const username = faker.name.firstName().toLowerCase() + Math.floor(Math.random() * 30).toString();
    const email = `${username}@test.com`;
    const password = faker.internet.password();
    const user = {"username": username, "email": email, "password": password}
    return cy
        .request({
        method: "POST",
        url: `${url}${routes.signup}`,
        body: {
            user: user
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return user
    })
})

Cypress.Commands.add('login', (email, password) => {
    return cy.request({
        method: "POST",
        url: `${url}${routes.signIn}`,
        body: {
            user: { email, password }
        }
         }).then((response) => {
             window.localStorage.setItem('jwtToken', response.body.user.token)
             expect(response.status).to.eq(200)
    })
})