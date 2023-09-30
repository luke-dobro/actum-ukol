/// <reference types="cypress" />

import { username, password } from '../../globalVariables';

describe('Sign in tests', () => {
  let randomString;

  // Generate a random string function
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
    cy.visit('/');

    cy.get('#login2').click();
  });

  before(() => {
    // Random string for login and password
    randomString = generateRandomString(15);
  });

  //Unsuccessful login
  it('Try to sign in with no credentials', () => {
    cy.get('button').contains('Log in').click();

    cy.wait(1000).get('#loginusername').should('be.visible');

    cy.get('#loginpassword').should('be.visible');

    //Check that user is not logged in
    cy.contains('Welcome ' + randomString).should('not.be.visible');
  });

  it('Try to sign in with random login credentials', () => {
    cy.wait(1000).get('#loginusername').type(randomString);

    cy.get('#loginpassword').type(randomString);

    cy.get('button').contains('Log in').click();

    //Check that user is not logged in
    cy.contains('Welcome ' + randomString).should('not.be.visible');
  });

  //Successful login
  it('Try to sign in with valid login credentials', () => {
    cy.wait(1000).get('#loginusername').type(username);

    cy.get('#loginpassword').type(password);

    cy.get('button').contains('Log in').click();

    //Check that user is logged in
    cy.contains('Welcome ' + username).should('be.visible');
  });
});
