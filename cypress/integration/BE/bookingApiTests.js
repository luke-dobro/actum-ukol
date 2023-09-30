/// <reference types="cypress" />

import { firstname, lastname } from '../../globalVariables';
import { baseUrlApi } from '../../../cypress.json';

let token; // Variable to store the authentication token
let bookingId; // Variable to store the booking ID

before(() => {
  // Create an authentication token
  cy.request({
    method: 'POST',
    url: `${baseUrlApi}/auth`,
    body: {
      username: 'admin',
      password: 'password123',
    },
  }).then((response) => {
    // Ensure the request is successful
    expect(response.status).to.equal(200);
    token = response.body.token;

    // Verify that the token is not empty
    expect(token).to.not.be.empty;
  });
});

describe('RESTful Booker API Tests', () => {
  // Test the GET /ping endpoint
  it('should return a successful ping response', () => {
    cy.request(`${baseUrlApi}/ping`).should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.eq('Created');
    });
  });

  // Test the POST /booking endpoint to create a new booking
  it('should create a new booking', () => {
    const bookingData = {
      firstname: firstname,
      lastname: lastname,
      totalprice: 200,
      depositpaid: true,
      bookingdates: {
        checkin: '2023-10-10',
        checkout: '2023-10-14',
      },
      additionalneeds: 'Breakfast',
    };

    cy.request('POST', `${baseUrlApi}/booking`, bookingData).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('bookingid');
      bookingId = response.body.bookingid;
    });
  });

  // Test the GET /booking/{bookingId} endpoint
  it('should retrieve a booking by ID', () => {
    cy.request(`${baseUrlApi}/booking/${bookingId}`).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('firstname', firstname);
      expect(response.body).to.have.property('lastname', lastname);
    });
  });

  // Test the PUT /booking/{bookingId} endpoint to update an existing booking
  it('Updates a booking', () => {
    const updFirstName = `updated /${firstname}`;
    const updLastName = `updated /${lastname}`;
    const updprice = 333;

    cy.request({
      method: 'PUT',
      url: `${baseUrlApi}/booking/${bookingId}`,
      headers: {
        Cookie: `token=${token}`, // Include the authentication token in the headers
      },
      body: {
        // Provide the booking details
        firstname: updFirstName,
        lastname: updLastName,
        totalprice: updprice,
        depositpaid: true,
        bookingdates: {
          checkin: '2023-10-04',
          checkout: '2023-10-09',
        },
        additionalneeds: 'All inclusive',
      },
    }).then((response) => {
      // Ensure the booking update is successful
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('firstname', updFirstName);
      expect(response.body).to.have.property('lastname', updLastName);
      expect(response.body).to.have.property('totalprice', updprice);
    });
  });

  // Partially update the booking using the existing ID
  it('should partially update a booking', () => {
    cy.request({
      method: 'PATCH',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        Cookie: `token=${token}`,
      },
      body: {
        // Provide the fields to be updated
        firstname: 'Partially updated firstname',
        lastname: 'Partially updated lastname',
      },
    }).then((response) => {
      // Ensure the partial update is successful
      expect(response.status).to.equal(200);
    });
  });

  // Test the DELETE /booking/{bookingId} endpoint to delete a booking
  it('should delete an existing booking', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrlApi}/booking/${bookingId}`,
      headers: {
        Cookie: `token=${token}`,
      },
      body: {},
    }).then((response) => {
      expect(response.status).to.equal(201);
    });
  });
});
