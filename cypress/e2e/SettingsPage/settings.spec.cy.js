import faker from "@faker-js/faker"
import routes from "../routes"
import selectors from "../selectors"

const UpdateSettings = () => {
    return cy
        .get(selectors.settings.updateSettingsButton)
        .should("be.visible")
        .should("be.enabled")
        .click();
}

const SelectSettingsTab = () => {
    return cy.get(selectors.settings.settingsTab).click();
}

const Logout = () => {
    return cy
        .get(selectors.settings.logoutButton)
        .should('be.visible')
        .click();
}

describe('Settings feature', () => {
    beforeEach(() => {
        cy.createUser().as("userData").then((user) =>
            cy.login(user.email, user.password).then(() =>
                cy.visit(routes.settings).then(() => { 
                cy.fixture('example.json').as('data')
            })))
    })

    it("Update username", function () {
        const newUsername = faker.name.lastName() + Math.floor(Math.random() * 30).toString();
        cy
            .get(selectors.settings.usernameInputField)
            .should('be.visible')
            .clear()
            .type(newUsername).then(() => {
                UpdateSettings().then(() => {
                    cy
                        .get(selectors.settings.newNameText)
                        .should('contain', newUsername)
                })
            })
    })

    it("Update password", function () {
        const newPassword = faker.internet.password();
        cy
            .get(selectors.settings.newPasswordInputField)
            .should('be.visible')
            .type(newPassword).then(() => {
                UpdateSettings().then(() => {
                    cy.intercept("PUT", `${this.data.apiUrl}${routes.user}`).as("updateUser").wait("@updateUser").then(() => {
                        SelectSettingsTab()
                            .then(() => {
                                Logout().then(() => {
                                    cy.login(this.userData.email, newPassword)
                                })
                            })
                    })
                })
            })
    })
    
    it("Update email address", function () {
        const newEmailAddress = faker.internet.email();
        cy
            .get(selectors.settings.EmailInputField)
            .should('be.visible')
            .clear()
            .type(newEmailAddress).then(() => {
                UpdateSettings().then(() => {
                    cy.intercept("PUT", `${this.data.apiUrl}${routes.user}`).as("updateUser").wait("@updateUser").then((res) =>
                        expect(res.response.body.user.email).to.equal(newEmailAddress)).then(() => {
                            SelectSettingsTab()
                                .then(() => {
                                    Logout().then(() => {
                                        cy.login(newEmailAddress, this.userData.password)
                                    })
                                })
                        })
                })
            })
    })
                
    it("Update bio", function () {
        const updatedBio = faker.random.words(5);
        cy
            .get(selectors.settings.bioInputField)
            .should('be.visible')
            .type(updatedBio).then(() => {
                UpdateSettings().then(() => {
                    cy.intercept("PUT", `${this.data.apiUrl}${routes.user}`).as("updateUser").wait("@updateUser").then((res) => {
                        expect(res.response.body.user.bio).to.equal(updatedBio)
                    })
                })
            })
    })

    it("Update image URL", function () {
        const imageUrl = faker.internet.url();
        cy
            .get(selectors.settings.urlInputField)
            .should('be.visible')
            .type(imageUrl).then(() => {
                UpdateSettings().then(() => { 
                    cy.get(selectors.settings.image).should('have.attr','src', imageUrl)
                })
            })
    })

    it("Update password - negative - existing email", function () {
                cy
                    .get(selectors.settings.EmailInputField)
                    .should('be.visible')
                    .clear()
                    .type(this.data.email).then(() => {
                        UpdateSettings().then(() => {
                            cy.intercept("PUT", `${this.data.apiUrl}${routes.user}`).as("updateUser").wait("@updateUser").then((res) => {
                                expect(res.response.statusCode).to.equal(500)
                                expect(res.response.body).include(this.data.errorUniqueConstraint)
                            })
                        })
                    })
    })

    it("Logout", function () {
        cy
            .get(selectors.settings.logoutButton)
            .should('be.visible')
            .click()
            .then(() => { cy.url().should('eq', 'http://angularjs.realworld.io/#/')})
               
    })
})