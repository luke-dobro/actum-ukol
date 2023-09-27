/// <reference types="cypress" />

describe('Categories tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  before(() => {});

  it('Categories menu with all categories is displayed', () => {
    cy.get('#cat').should('contain.text', 'CATEGORIES');

    cy.get('.list-group-item').then((categories) => {
      expect(categories[1]).to.contain('Phones');
      expect(categories[2]).to.contain('Laptops');
      expect(categories[3]).to.contain('Monitors');
    });
  });

  it('A click on each category opens correct products portfolio', () => {
    cy.get('.list-group-item').contains('Phones').click();

    cy.wait(1000);

    cy.get('.hrefch').first().should('contain.text', 'Samsung galaxy s6');

    cy.get('.list-group-item').contains('Laptops').click();

    cy.wait(1000);

    cy.get('.hrefch').first().should('contain.text', 'Sony vaio i5');

    cy.get('.list-group-item').contains('Monitors').click();

    cy.wait(1000);

    cy.get('.hrefch').first().should('contain.text', 'Apple monitor 24');
  });
});
