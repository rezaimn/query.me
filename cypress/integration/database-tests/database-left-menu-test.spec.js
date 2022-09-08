describe('Database - Left - Menu', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      '/api/v1/saved_view/?q=(filters:!((col:view_type,opr:eq,value:Database)))',
      'fixture:database/database-saved-views',
    );
    cy.visit('/d');

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

  it(`should shows 'test_view' and 'All Databases' menu items in left menu`, () => {
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').should('have.length', 2);
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').first().should('have.text', 'All Databases');
    cy.get('[data-cy=leftMenuSavedViews]').find('.bp3-text-overflow-ellipsis').last().should('have.text', 'test_view');
  });


  // it(`should shows 'Delete and Edit' Icons after hovering on 'test_view' menu item`, () => {
  //   cy.get('[data-cy=leftMenuSavedViews]').find('.left-menu-item__container').last().trigger('mouseover');
  //   cy.get('[data-cy=savedViewsToolbar]').find('span').should('have.length',2);
  //   cy.get('[data-cy=savedViewsToolbar]').find('span').first().should('have.attr', 'icon')
  //     .then(icon => {
  //       expect(icon).to.be.equal('trash');
  //     });
  // });


  it('should shows New Database button + add icon', () => {
    cy.get('[data-cy=addNewDBLeftMenu]').find('span').should('have.length', 2);
    cy.get('[data-cy=addNewDBLeftMenu]').find('span').first().should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('add');
      });
    cy.get('[data-cy=addNewDBLeftMenu]').find('span').last().should('have.text','New Database');
  });

  it('should shows close menu button', () => {
    cy.get('[data-cy=menuCloseBtn]').find('span').should('have.length', 1);
    cy.get('[data-cy=menuCloseBtn]').find('span').first().should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('menu-closed');
      });
  });

  it('should hide left menu and shows the open menu button after click on close menu button', () => {
    cy.get('[data-cy=menuCloseBtn]').click();
    cy.get('[data-cy=menuOpenBtn]').find('span').first().should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('menu-open');
      });
    cy.get('aside.page__left-menu').should('have.class','closed');
  });

  it('should shows left menu after click on open menu button', () => {
    cy.get('[data-cy=menuOpenBtn]').click();
    cy.get('aside.page__left-menu').should('not.have.class','closed');
  });

  it('should redirect to /d/d/v/1 after click on test_view', () => {
    cy.get('[data-cy=leftMenuSavedViews]').find('.left-menu-item__container').last().click();
    cy.server();
    cy.route(
      'GET',
      '/api/v1/saved_view/1',
      'fixture:database/database-test-saved-view',
    ).then(res=>{
      cy.url().should('contain','/d/d/v/1');
    });
  });

  it('should redirect to /d/d/connect after click on New Database', () => {
    cy.visit('/d/d');
    cy.wait(3000);
    cy.get('[data-cy=addNewDBLeftMenu]').click();
    cy.url().should('contain','/d/d/connect');
  });


});
