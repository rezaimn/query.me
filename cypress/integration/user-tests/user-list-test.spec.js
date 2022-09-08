describe('User - List', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      '/api/v1/user/?q=(page:0,page_size:15)',
      'fixture:user/user-list'
    );
    cy.visit('/a/u');

  });
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should shows 4 columns and the first column is Name', () => {
    cy.get('[data-cy=listHeaders]').find('.list-header__item').should('have.length', 5);
    cy.get('[data-cy=listHeaders]').find('.list-header__item').first().should('have.text', 'Name');
  });
  it('should have two rows', () => {
    cy.get('#users-infinite-scroll').find('.list-row').should('have.length', 2);
  });
});
