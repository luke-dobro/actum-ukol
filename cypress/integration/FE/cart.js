/// <reference types="cypress" />

import { name, country, city, creditCard, month, year } from '../../globalVariables';

describe('Cart tests', () => {
  let productName;
  let productPrice;
  let productPrice2;

  beforeEach(() => {
    cy.visit('/');

    cy.get('.list-group-item').contains('Phones').click();

    cy.wait(1000);

    cy.get('.hrefch').first().click();

    cy.get('.name')
      .invoke('text') // Get the text of the element
      .then((text) => {
        productName = text; // Save the text in a variable
      });

    cy.get('.price-container')
      .invoke('text') // Get the text of the element
      .then((text) => {
        productPrice = text.match(/\d+/)[0]; // Save number only in a variable
      });

    // Add product to cart
    cy.get('a.btn.btn-success.btn-lg').click();
  });

  it('Added product from detail page should get displayed in cart', () => {
    // Go to the cart
    cy.get('#cartur').click();

    // Check correct product name with valid price is in cart
    // Select the table row and read the values
    cy.get('#tbodyid tr.success').within(() => {
      // Read the text of the second <td> element (Product name)
      cy.get('td')
        .eq(1)
        .invoke('text')
        .then((actualTitle) => {
          // Compare the actual title with the expected title
          expect(actualTitle.trim()).to.equal(productName);
        });
    });

    // Read the text of the third <td> element (Price)
    cy.get('td')
      .eq(2)
      .invoke('text')
      .then((actualPrice) => {
        // Compare the actual price with the expected price
        expect(actualPrice.trim()).to.equal(productPrice);
      });

    // Cart total corresponds to the product price
    cy.get('#totalp')
      .invoke('text')
      .then((text) => {
        // Use the 'text' variable containing the element's text content
        expect(text).to.equal(productPrice);
      });
  });

  it('Add more products to cart and check total price', () => {
    cy.visit('/');

    cy.get('.list-group-item').contains('Monitors').click();

    cy.wait(1000);

    cy.get('.hrefch').first().click();

    cy.get('.price-container')
      .invoke('text')
      .then((text) => {
        productPrice2 = text.match(/\d+/)[0]; // Save number in a variable
      });

    // Add product to cart
    cy.get('a.btn.btn-success.btn-lg').click();

    // Go to the cart
    cy.get('#cartur').click();

    cy.wait(1000);

    // Check correct prices in cart
    // Read the text of the third <td> element (Price) and save it to variable
    cy.get('td')
      .eq(2)
      .invoke('text')
      .then((actualPrice) => {
        productPrice = actualPrice.trim();
      });

    // Read the text of the second price
    cy.get('td')
      .eq(6)
      .invoke('text')
      .then((actualPrice) => {
        productPrice2 = actualPrice.trim();
      });

    // Cart total corresponds to the product price
    cy.get('#totalp')
      .invoke('text')
      .then((text) => {
        expect(Number(text)).to.equal(Number(productPrice) + Number(productPrice2));
      });
  });

  it('Complete purchase of one product', () => {
    // Go to the cart
    cy.get('#cartur').click();

    cy.get('.btn.btn-success').click();

    cy.get('#name').type(name);

    cy.get('#country').type(country);

    cy.get('#city').type(city);

    cy.get('#card').type(creditCard);

    cy.get('#month').type(month);

    cy.get('#year').type(year);

    cy.get('.btn.btn-primary').contains('Purchase').click();

    cy.get('.sweet-alert').should('be.visible');

    cy.get('.confirm.btn.btn-lg.btn-primary').click();
  });

  it('Products deletion and total recalculation check', () => {
    cy.visit('/');

    cy.get('.list-group-item').contains('Monitors').click();

    cy.wait(1000);

    cy.get('.hrefch').first().click();

    cy.get('.price-container')
      .invoke('text')
      .then((text) => {
        productPrice2 = text.match(/\d+/)[0]; // Save number only in a variable
      });

    // Add product to cart
    cy.get('a.btn.btn-success.btn-lg').click();

    // Go to the cart
    cy.get('#cartur').click();

    cy.wait(1000);

    // Read the text of the third <td> element (Price)
    cy.get('td')
      .eq(2)
      .invoke('text')
      .then((actualPrice) => {
        productPrice = actualPrice.trim();
      });

    // Read the text of the second price
    cy.get('td')
      .eq(6)
      .invoke('text')
      .then((actualPrice) => {
        productPrice2 = actualPrice.trim();
      });

    cy.contains('a', 'Delete').click();

    cy.wait(3000);

    // Cart total recalculates to the remained product price
    cy.get('#totalp')
      .invoke('text')
      .then((text) => {
        expect(Number(text)).to.equal(Number(productPrice2));
      });

    cy.get('a').contains('Delete').click();

    cy.wait(3000);

    // Table with products is not visible anymore
    cy.get('.success').should('not.be.visible');

    // Total sum is not displayed anymore
    cy.get('#totalp').should('not.be.visible');
  });
});
