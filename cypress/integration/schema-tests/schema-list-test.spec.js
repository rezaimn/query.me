describe('Schema - List', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      '/api/v1/es/schema/?q=(page:0,page_size:15)',
      'fixture:schema/schema-list'
    );
    cy.visit('/d/s');

  });
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it(`should shows Schemas list with 3 columns as Name, Database and '' `, () => {
    cy.get('[data-cy=listHeaders]').find('.list-header__item').should('have.length', 3);
    cy.get('[data-cy=listHeaders]').find('.list-header__item').first().should('have.text', 'Name');
    cy.get('[data-cy=listHeaders]').find('.list-header__item').eq(1).should('have.text', 'Database');
    cy.get('[data-cy=listHeaders]').find('.list-header__item').eq(2).should('have.text', '');
  });
  it('should shows Schemas list with two rows', () => {
    cy.get('#schemas-infinite-scroll').find('.list-row').should('have.length', 2);
  });

  it('should open Schema details info after clicking on the first row and shows the selected Schema info', () => {
    cy.get('#schemas-infinite-scroll').find('.list-row').first().click();
    cy.server();
    // cy.route(
    //   'GET',
    //   '/api/v1/es/table/?q=(filters:!((col:database_uid,opr:eq,value:%27db%27),(col:schema,opr:eq,value:Schema)),page:0,page_size:15)',
    //   'fixture:schema/selected-schema-table-list',
    // );
    cy.route(
      'GET',
      '/api/v1/es/schema/db.Schema',
      'fixture:schema/selected-schema-details-info',
    );
    cy.wait(3000);
    cy.get('[data-cy=schemaDetailsInfo]').find('.labelled-text').should('have.length', 3);
    cy.get('[data-cy=schemaDetailsInfo]').find('.labelled-text').first()
      .find('.labelled-text__label').should('have.text', 'Type');
    cy.get('[data-cy=schemaDetailsInfo]').find('.labelled-text').first()
      .find('.labelled-text__content').should('have.text', 'postgresql');

    cy.get('[data-cy=schemaDetailsInfo]').find('.labelled-text').eq(1)
      .find('.labelled-text__label').should('have.text', 'Database');
    cy.get('[data-cy=schemaDetailsInfo]').find('.labelled-text').eq(1)
      .find('.labelled-text__content').should('have.text', 'DB');

    cy.get('[data-cy=schemaDetailsInfo]').find('.labelled-text').last()
      .find('.labelled-text__label').should('have.text', 'Last used');
    cy.get('[data-cy=schemaDetailsInfo]').find('.labelled-text').last()
      .find('.labelled-text__content').should('have.text', 'No use');
  });

  it(`should shows 'schema' in details sidebar title `, () => {
    cy.get('.details__header__title').find('.bp3-breadcrumb').last().should('have.text', 'heat-gridSchema');
  });

  it(`should shows 'schema icon' in details sidebar title `, () => {
    cy.get('.details__header__title').find('.bp3-breadcrumb').last().find('span').should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('heat-grid');
      });
  });

  // it(`should shows 'Tables2' in schema's table header `, () => {
  //   cy.get('[data-cy=schemaTablesList]').find('.underlined-tab-header').should('have.text', 'Tables2');
  // });
  //
  // it(`should have 2 columns for Tables list as Name and Last modified`, () => {
  //   cy.get('[data-cy=schemaTablesList]').find('.list-header__item').first().should('have.text', 'Name');
  //   cy.get('[data-cy=schemaTablesList]').find('.list-header__item').last().should('have.text', 'Last modified');
  // });
  //
  // it('should have 2 rows of Tables', () => {
  //   cy.get('#schema-tables-infinite-scroll').find('.list-row').should('have.length', 2);
  // });

  it('should shows ... button as action button ', () => {
    cy.get('.details__header__toolbar__action').find('button').find('span').should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('more');
      });
  });

  it('should shows a menu with one item ( Open ) when user clicks on action button', () => {
    cy.get('.details__header__toolbar__action').find('button').click();
    cy.get('[data-cy=schemaActionMenu]').find('.bp3-icon').first().should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('cog');
      });
    cy.get('[data-cy=schemaActionMenu]')
      .find('.bp3-text-overflow-ellipsis').first().should('have.text','Open');
  });

  it('should shows close button for schema details sidebar', () => {
    cy.get('.details__header__toolbar__close').find('span').should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('cross');
      });
  });

  it('should close schema details sidebar after click on close button', () => {
    cy.get('.details__header__toolbar__close').click();
    cy.get('[data-cy=schemaDetailsInfo]').should('not.exist');
  });

  it('should shows an action menu when user clicks on a Schema row action button', () => {
    cy.get('#schemas-infinite-scroll').find('.list-row').find('.query-list__rows__trigger').first().click();
    cy.get('[data-cy=schemaActionMenu]').should('exist');
  });
});
