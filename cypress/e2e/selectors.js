export default {
    login:{
        usernameInputField: "input[type='email']",
        passwordInputField: "input[type='password']",
        loginButton: "button[type='submit']",
        nameText: ":nth-child(4) > a.nav-link",
        errorInvalid: "div.ng-scope > li.ng-binding",
    },
    settings: {
        usernameInputField: "input[ng-model*='username']",
        updateSettingsButton: "button[type='submit']",
        newNameText: "h4.ng-binding",
        newPasswordInputField: "input[type='password']",
        EmailInputField: "input[type='email']",
        bioInputField: "textarea.form-control",
        urlInputField: ":nth-child(1) > input.form-control",
        logoutButton: "button[ng-click*='logout']",
        settingsTab: "[show-authed='true'] > :nth-child(3) > .nav-link",
        settingsName: ":nth-child(4) > .nav-link",
        image: ".user-img",
    }
}