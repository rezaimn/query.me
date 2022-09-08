describe('Table - List', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      '/api/v1/es/table/?q=(page:0,page_size:15)',
      'fixture:table/table-list'
    );
    cy.visit('/d/t');

  });
  beforeEach(() => {

  });

  afterEach(() => {

  });



  it(`should shows Tables list with 4 columns as 'Name', 'Database', 'Schema' and ''`, () => {
    cy.get('[data-cy=listHeaders]').find('.list-header__item').should('have.length', 4);
    cy.get('[data-cy=listHeaders]').find('.list-header__item').first().should('have.text', 'Name');
    cy.get('[data-cy=listHeaders]').find('.list-header__item').eq(1).should('have.text', 'Database');
    cy.get('[data-cy=listHeaders]').find('.list-header__item').eq(2).should('have.text', 'Schema');
    cy.get('[data-cy=listHeaders]').find('.list-header__item').eq(3).should('have.text', '');
  });

  it('should shows Tables list with two rows', () => {
    cy.get('#tables-infinite-scroll').find('.list-row').should('have.length', 2);
  });

  it('should open Table details info after clicking on the first row and shows the selected Table info', () => {
    cy.get('#tables-infinite-scroll').find('.list-row').first().click();
    cy.server();
    cy.route(
      'GET',
      '/api/v1/es/table/db.Schema.Table',
      'fixture:table/selected-table-details-info',
    );
    cy.route(
      'GET',
      '/api/v1/es/column/?q=(filters:!((col:database_uid,opr:eq,value:%27db%27),(col:schema,opr:eq,value:Schema),(col:table,opr:eq,value:Table)),page:0,page_size:15)',
      'fixture:table/selected-table-column-list',
    );
    cy.wait(3000);
    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').should('have.length', 4);
    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').first()
      .find('.labelled-text__label').should('have.text', 'Type');
    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').first()
      .find('.labelled-text__content').should('have.text', 'table');

    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').eq(1)
      .find('.labelled-text__label').should('have.text', 'Database');
    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').eq(1)
      .find('.labelled-text__content').should('have.text', 'DB');

    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').eq(2)
      .find('.labelled-text__label').should('have.text', 'Schema');
    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').eq(2)
      .find('.labelled-text__content').should('have.text', 'Schema');

    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').last()
      .find('.labelled-text__label').should('have.text', 'Last used');
    cy.get('[data-cy=tableDetailsInfo]').find('.labelled-text').last()
      .find('.labelled-text__content').should('have.text', 'No use');
  });

  it(`should shows 'Table' in details sidebar title `, () => {
    cy.get('.details__header__title').find('.bp3-breadcrumb').last().should('have.text', 'thTable');
  });

  it(`should shows 'table icon' in details sidebar title `, () => {
    cy.get('.details__header__title').find('.bp3-breadcrumb').last().find('span').should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('th');
      });
  });

  it(`should shows 'Columns2' in schema's table header `, () => {
    cy.get('[data-cy=tableColumnsList]').find('.underlined-tab-header').should('have.text', 'Columns2');
  });

  it(`should have 2 columns for Columns list as Name and Last modified`, () => {
    cy.get('[data-cy=tableColumnsList]').find('.list-header__item').first().should('have.text', 'Name');
    cy.get('[data-cy=tableColumnsList]').find('.list-header__item').last().should('have.text', 'Datatype');
  });

  it('should have 2 rows of columns', () => {
    cy.get('#table-columns-infinite-scroll').find('.list-row').should('have.length', 2);
  });

  it('should shows close button for table details sidebar', () => {
    cy.get('.details__header__toolbar__close').find('span').should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('cross');
      });
  });

  it('should close database details sidebar after click on close button', () => {
    cy.get('.details__header__toolbar__close').click();
    cy.get('[data-cy=tableDetailsInfo]').should('not.exist');
  });

  it('should shows an action menu with one item ( Open ) when user clicks on a Table row action button', () => {
    cy.get('#tables-infinite-scroll').find('.list-row').find('.query-list__rows__trigger').first().click();
    cy.get('[data-cy=tableActionMenu]').should('exist');
  });

});
