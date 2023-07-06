import { login } from '/cypress/support/shared';
import { getRandomNumber } from '/cypress/support/utils';
import { faker } from '@faker-js/faker';
import meUser from '/cypress/fixtures/me-user.json';

function getRandomArticle() {

    const rnd = getRandomNumber(0, 9);

    cy.get('.feed-toggle ul li:nth-child(2)').as('globalFeed').click()
    // TO DO: improve selector
    cy.get('article-list')
        .contains('Loading')
        .should('not.be.visible');
    cy.get('article-list').should('be.visible').as('articlesList');
    cy.get('@articlesList')
        .find('article-preview')
        .should('have.length', 10)
        .eq(rnd)
        .click()
        .as('randomArticle');

}

function addComment() {

    const articleComment = faker.lorem.paragraph();

    cy.get('.comment-form').type(articleComment);
    cy.get('button[type=submit]').click()
    cy.get('.article-page')
        .contains('comment', articleComment)
        .should('be.visible')
        .as('randomComment');

    return articleComment;

}

describe('Comments', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.get('.navbar').should('be.visible').as('appHeader');
        login();
        cy.location('hash').should('eq', '#/');
    });

    it('publish comment', () => {

        getRandomArticle();
        addComment();

        cy.get('@randomComment')
            .find('.card-footer')
            .each(card => {
                cy.wrap(card).within(() => {
                    cy.get('img[src*=images]').should('be.visible');
                    cy.get('[ng-bind*=username]').should('be.visible');
                    cy.get('.date-posted').should('be.visible');
                });
            });
    });

    it('should delete comment', () => {

        getRandomArticle();
        const comment = addComment();

        cy.get('@randomComment')
            .find('[ng-click*=delete]')
            .click();

        cy.get('.article-page').contains(comment)
            .should('have.length', 0);
    })
});

