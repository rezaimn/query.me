describe('Table - Left - Menu', () => {
  before(() => {
    cy.server();
    cy.visit('/a/u');

  });
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should shows Account and User Management menu Items', () => {
    cy.get('[data-cy=adminLeftMenu]').find('.left-menu-item__container').should('have.length', 2);
    cy.get('[data-cy=adminLeftMenu]').find('.left-menu-item__container').
    first().find('.bp3-text-overflow-ellipsis').first().should('have.text','Account');
    cy.get('[data-cy=adminLeftMenu]').find('.left-menu-item__container').
    last().find('.bp3-text-overflow-ellipsis').first().should('have.text','User Management');
  });
});
