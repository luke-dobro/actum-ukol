/// <reference types="cypress" />

describe('Sign up tests', () => {
  let randomString;

  // Generate a random string for new user registration
  function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }

    return result;
  }

  beforeEach(() => {
    cy.server();

    cy.route('POST', '/signup').as('registration');

    cy.visit('/');

    cy.get('#signin2').click();

    cy.get('#signInModalLabel').should('be.visible');
  });

  before(() => {
    // Generate random string for login and password
    randomString = generateRandomString(15);
  });

  it('Unsuccessful registration', () => {
    // Try to send an empty form
    cy.get('#sign-username').should('not.have.value');

    cy.get('#sign-password').should('not.have.value');

    cy.get('.btn-primary').contains('Sign up').click();

    cy.get('.btn-primary').contains('Sign up').should('be.visible');

    // Try to fill in invalid data
    cy.get('#sign-username').type('      ');

    cy.get('#sign-password').type('      ');

    cy.get('.btn-primary').contains('Sign up').click();

    // Sign up form is not closed, registration not successful
    cy.get('.btn-primary').contains('Sign up').should('be.visible');
  });

  it('Successful registration', () => {
    cy.wait(2000).get('#sign-username').type(randomString);

    cy.get('#sign-password').type(randomString);

    cy.get('.btn-primary').contains('Sign up').click();

    cy.wait('@registration').its('status').should('eq', 200);

    cy.get('.btn-primary').contains('Sign up').should('not.be.visible');

    // Check that user can sign in with that account
    cy.get('#login2').click();

    cy.wait(1000).get('#loginusername').type(randomString);

    cy.get('#loginpassword').type(randomString);

    cy.get('button').contains('Log in').click();

    // Check that user is signed in
    cy.contains('Welcome ' + randomString).should('be.visible');
  });
});
