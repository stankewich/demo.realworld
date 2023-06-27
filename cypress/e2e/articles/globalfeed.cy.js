import { getRandomNumber } from '/cypress/support/utils';
import meUser from '/cypress/fixtures/me-user.json';
import { login } from '/cypress/support/shared.js';

function waitForArticlesList() {

    cy.get('article-list').contains('.article-preview', 'Loading')
        .should('not.be.visible');
    cy.get('@articlesList').find('article-preview')
        .should('have.length', 10)
    cy.log('**Article list is checked**');
};

function waitForTaggedArticlesList() {
    cy.get('@articlesList').contains('.article-preview', 'Loading')
        .should('not.be.visible');
        cy.log('**Article list is checked**');
}

function selectRandomArticle() {

    waitForArticlesList();

    const rand = getRandomNumber(0, 9);

    cy.get('@articlesList')
        .find('article-preview')
        .should('have.length', 10)
        .eq(rand)
        .as('randomArticle');
    cy.log('**Article choosed:** ' + rand);

    cy.get('@randomArticle')
        .find('h1')
        .invoke('text')
        .as('randomArticleTitle');

};

function selectRandomPage() {

    const randomPage = getRandomNumber(1, 9);

    cy.get('list-pagination')
        .find('.page-link')
        .should('have.length.greaterThan', 10)
        .eq(randomPage)
        .as('randomPage')
    cy.get('@randomPage').click();
    const expectingPage = randomPage + 1;
    cy.get('list-pagination').find('.page-item.active')
        .invoke('text')
        .invoke('trim')
        .then(pageNumber => parseInt(pageNumber))
        .should('eq', expectingPage);
    cy.get('@randomArticleTitle').then(title => {
        cy.get('article-list')
            .should('not.contains.text', title);
    });
};

function selectRandomTag() {

    const randomTag = getRandomNumber(1, 5);

    cy.get('.sidebar .tag-list').find('.tag-default')
        .should('have.length.greaterThan', 5)
        .eq(randomTag)
        .as('randomTag');
    cy.get('@randomTag').click();

}

describe('Articles check', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.location('hash').should('eq', '#/');
        cy.get('article-list').as('articlesList');
    });

    it('it should do check article list', () => {
        cy.get('article-list').should('be.visible').as('myArticles');
        cy.get('@myArticles').find('article-preview')
            .should('have.length', 10)

            .each(article => {
                cy.wrap(article).within(() => {
                    cy.get('.date').should('be.visible');
                    cy.get('.author').should('be.visible');
                    cy.get('img[src*=images]').should('be.visible');
                    cy.get('h1').should('be.visible');
                    cy.get('[ng-bind*=description]').should('be.visible');
                    cy.get('.tag-list li').should('have.length.greaterThan', 0);
                    cy.get('button[ng-click*=submit] .ng-binding')
                        .invoke('text')
                        .should('match', /[0-9]/);
                });

            });
    });

    it.only('it should do open detail article page', () => {

        const rnd = getRandomNumber(0, 9);

        cy.get('article-list').should('be.visible').as('myArticles');
        cy.get('@myArticles')
            .find('article-preview')
            .should('have.length', 10)
            .eq(rnd)
            .as('randomArticle');

        cy.get('@randomArticle')
            .find('h1')
            .invoke('text')
            .as('randomArticleTitle');

        cy.get('@randomArticleTitle').then(title => {
            cy.get('@randomArticle').click();
            cy.url().should('include', '/#/article');
            cy.get('.article-page h1')
                .invoke('text')
                .should('eq', title);
        });
    });



    it('should do navigate in list by paging', () => {

        selectRandomArticle();

        selectRandomPage();

        cy.get('list-pagination').find('.page-link').eq(0).click();
        cy.get('list-pagination').find('.page-item.active')
            .invoke('text')
            .invoke('trim')
            .should('eq', `1`);
        cy.get('@randomArticleTitle').then(title => {
            cy.get('article-list')
                .should('contains.text', title);
        });

    });

    it('should filter articles by tag', () => {

        waitForArticlesList();

        cy.get('.sidebar .tag-list .tag-default')
            .as('popularTags')
            .should('have.length.greaterThan', 5);

        const randomTag = getRandomNumber(0, 5);

        cy.get('@popularTags')
            .eq(randomTag)
            .click()
            .invoke('text')
            .invoke('trim')
            .as('randomTagName');

        waitForTaggedArticlesList();

        cy.get('@randomTagName').then(tagName => {

            cy.get('.feed-toggle [ng-show] a')
                .should('contains.text', tagName)
                .should('have.class', 'active');
                
            cy.get('@articlesList')
                .find('article-preview')
                .should('have.length.greaterThan', 0)
                .each(article => {
                    cy.wrap(article)
                        .contains('.tag-default', tagName)
                        .should('have.length', 1);
                });
        });
    });
});