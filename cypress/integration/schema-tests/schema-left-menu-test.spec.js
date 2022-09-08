describe('Schema - Left - Menu', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      '/api/v1/saved_view/?q=(filters:!((col:view_type,opr:eq,value:Schema)))',
      'fixture:schema/schema-saved-views'
    );
    cy.visit('/d/s');

  });
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should shows Databases, Schemas and Tables menu Items in the left menu', () => {
    cy.get('[data-cy=leftMenuMainLists]').find('.bp3-text-overflow-ellipsis').should('have.length', 3);
    cy.get('[data-cy=leftMenuMainLists]').find('.bp3-text-overflow-ellipsis').first().should('have.text', 'Databases');
    cy.get('[data-cy=leftMenuMainLists]').find('.bp3-text-overflow-ellipsis').eq(1).should('have.text', 'Schemas');
    cy.get('[data-cy=leftMenuMainLists]').find('.bp3-text-overflow-ellipsis').last().should('have.text', 'Tables');
  });
  it('should shows test_view in left menu saved views', () => {
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').should('have.length', 2);
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').first().should('have.text', 'All Schemas');
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').last().should('have.text', 'test_view');
  });

  it('should redirect to /d/s/v/1 after click on test_view', () => {
    cy.get('[data-cy=leftMenuSavedViews]').find('.left-menu-item__container').last().click();
    cy.server();
    cy.route(
      'GET',
      '/api/v1/saved_view/1',
      'fixture:schema/schema-test-saved-view',
    ).then(res=>{
      cy.url().should('contain','/d/s/v/1');
    });
  });

});
