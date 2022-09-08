describe('Notebook - Left - Menu', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      '/api/v1/saved_view/?q=(filters:!((col:view_type,opr:eq,value:Notebook)))',
      'fixture:notebook/notebook-saved-views'
    );
    cy.visit('/n');

  });
  beforeEach(() => {

  });

  afterEach(() => {

  });


  it('should shows test_view in left menu saved views', () => {
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').should('have.length', 2);
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').first().should('have.text', 'All Notebooks');
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').last().should('have.text', 'test_view');
  });

  it('should shows New Notebook button + add icon', () => {
    cy.get('[data-cy=addNewNotebookLeftMenu]').find('span').should('have.length', 2);
    cy.get('[data-cy=addNewNotebookLeftMenu]').find('span').first().should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('add');
      });
    cy.get('[data-cy=addNewNotebookLeftMenu]').find('span').last().should('have.text','New Notebook');
  });

  it('should redirect to /n/v/1 after click on test_view', () => {
    cy.get('[data-cy=leftMenuSavedViews]').find('.left-menu-item__container').last().click();
    cy.server();
    cy.route(
      'GET',
      '/api/v1/saved_view/1',
      'fixture:notebook/notebook-test-saved-view',
    ).then(res=>{
      cy.url().should('contain','/n/v/1');
    });
  });
  it('should not shows Databases, Schemas and Tables menu Items in the left menu', () => {
    cy.get('[data-cy=leftMenuMainLists]').should('not.exist');
  });
});
