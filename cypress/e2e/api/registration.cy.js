///<reference types="cypress" />
import { randomUser } from '/cypress/support/createuser.js';

const BACKEND_BASE_URL = 'https://api.realworld.io/api';
const DEFAULT_BASE_URL = Cypress.config('baseUrl');

const user = randomUser;
const payload = { user };

before(() => {
    cy.log('set base url to backend');
    Cypress.config('baseUrl', BACKEND_BASE_URL);
});

after(() => {
    cy.log('reset base url');
    Cypress.config('baseUrl', DEFAULT_BASE_URL);
});

describe('User registration via API', () => {

    it('should do register user', () => {

        cy.request('POST', '/users', payload)
            .then(({ status, body }) => {
                debugger;
                expect(status).to.eq(200);
                expect(body).to.have.key('user');
                const { user } = body;
                expect(user).to.have.all.keys('username', 'email', 'bio', 'image', 'token');
                expect(user.username).to.not.be.empty;
                expect(user.email).to.not.be.empty;
                expect(user.image).to.not.be.empty;
                expect(user.token).to.not.be.empty;
            });
    });
});
