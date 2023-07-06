///<reference types="cypress" />

const BACKEND_BASE_URL = 'https://api.realworld.io/api';
const DEFAULT_BASE_URL = Cypress.config('baseUrl');

const payload = {
    user: { username: '', email: '', password: '' }
};

before(() => {
    cy.log('set base url to backend');
    Cypress.config('baseUrl', BACKEND_BASE_URL);
});

after(() => {
    cy.log('reset base url');
    Cypress.config('baseUrl', DEFAULT_BASE_URL);
});

describe('User registration via API', () => {

    it('should not do register user with empty data', () => {

        cy.request({ method: 'POST', url: '/users', body: payload, failOnStatusCode: false })
            .then(({ status, body }) => {
                expect(status).to.eq(422);
                expect(body).to.have.key('errors');
                const { errors } = body;
                expect(errors).to.have.key('email');
                const { email } = errors;
                expect(email).to.have.lengthOf(1);
                const message = email.join('');
                expect(message).to.have.eq('can\'t be blank');
            });

    });
});