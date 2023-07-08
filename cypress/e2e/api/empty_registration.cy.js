///<reference types="cypress" />
import { createRandomUser } from '/cypress/support/createuser.js';

const BACKEND_BASE_URL = 'https://api.realworld.io/api';
const DEFAULT_BASE_URL = Cypress.config('baseUrl');

before(() => {
    cy.log('set base url to backend');
    Cypress.config('baseUrl', BACKEND_BASE_URL);
});

after(() => {
    cy.log('reset base url');
    Cypress.config('baseUrl', DEFAULT_BASE_URL);
});

describe('User registration via API', () => {

    it('should not do register user with empty email', () => {

        let user = createRandomUser();
        cy.log(user);
        user.email = '';

        cy.request({ method: 'POST', url: '/users', body: { user }, failOnStatusCode: false })
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

        // user.email = 'asdasdsas@mail.rom'
        // cy.log(user);

    });

    it('should not do register user with empty username', () => {

        let user = createRandomUser();
        user.username = '';
        cy.log(user);

        cy.request({ method: 'POST', url: '/users', body: { user }, failOnStatusCode: false })
            .then(({ status, body }) => {
                expect(status).to.eq(422);
                expect(body).to.have.key('errors');
                const { errors } = body;
                expect(errors).to.have.key('username');
                const { username } = errors;
                expect(username).to.have.lengthOf(1);
                const message = username.join('');
                expect(message).to.have.eq('can\'t be blank');
            });

    });

    it('should not do register user with empty password', () => {

        let user = createRandomUser();
        user.password = '';
        cy.log(user);

        cy.request({ method: 'POST', url: '/users', body: { user }, failOnStatusCode: false })
            .then(({ status, body }) => {
                expect(status).to.eq(422);
                expect(body).to.have.key('errors');
                const { errors } = body;
                expect(errors).to.have.key('password');
                const { password } = errors;
                expect(password).to.have.lengthOf(1);
                const message = password.join('');
                expect(message).to.have.eq('can\'t be blank');
            });

    });
});