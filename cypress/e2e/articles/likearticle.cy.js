import { getRandomNumber } from '/cypress/support/utils';
import meUser from '/cypress/fixtures/me-user.json';
import { login } from '/cypress/support/shared.js';

function openGlobalFeed() {

    // my articles should be active
    cy.get('.feed-toggle ul > li:nth-child(2) a')
        .click();

};

function articlesCheck() {

    cy.get('article-list').should('be.visible').as('myArticles');
    cy.get('@myArticles').find('article-preview')
        .should('have.length', 10)

};

function waitForArticlesList() {

    cy.get('@articlesList').contains('.article-preview', 'Loading')
        .should('not.be.visible');

};

function selectRandomArticle() {

    waitForArticlesList();

    const rand = getRandomNumber(0, 9);
    cy.get('@articlesList')
        .find('article-preview')
        .should('have.length', 10)
        .eq(rand)
        .as('randomArticle');

};

describe('Like article', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.get('.navbar').should('be.visible').as('appHeader');
        cy.get('article-list').as('articlesList');
        login();
    });

    it('should do like article', () => {

        openGlobalFeed();

        articlesCheck();

        selectRandomArticle();

        cy.get('@randomArticle').find('favorite-btn button').as('likeButton')

        cy.get('@likeButton')
            .invoke('text')
            .invoke('trim')
            .then(likes => parseInt(likes))
            .as('likesBefore');

        cy.get('@likeButton')
            .invoke('hasClass', 'btn-primary')
            .then(likedBefore => {
                cy.get('@likeButton')
                    .click()
                    .should('not.have.class', 'disabled');

                cy.get('@likesBefore').then(likesBefore => {
                    const expectingLikes = likesBefore + (likedBefore ? (-1) : 1);
                    cy.get('@likeButton')
                        .invoke('text')
                        .invoke('trim')
                        .then(likes => parseInt(likes))
                        .should('eq', expectingLikes);
                });
            });

    });
}

)