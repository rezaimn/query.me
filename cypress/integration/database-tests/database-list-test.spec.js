describe('Database - List', () => {
  before(() => {
    cy.server();
    cy.route(
      'GET',
      '/api/v1/database/?q=(page:0,page_size:15)',
      'fixture:database/database-list',
    );
    cy.visit('/d');

  });
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it(`should shows Databases list with 4 columns as 'Name', 'Created by', 'Last modified' and ''`, () => {
    cy.get('[data-cy=listHeaders]').find('.list-header__item').should('have.length', 4);
    cy.get('[data-cy=listHeaders]').find('.list-header__item').first().should('have.text', 'Name');
    cy.get('[data-cy=listHeaders]').find('.list-header__item').eq(1).should('have.text', 'Created by');
    cy.get('[data-cy=listHeaders]').find('.list-header__item').eq(2).should('have.text', 'Last modified');
    cy.get('[data-cy=listHeaders]').find('.list-header__item').eq(3).should('have.text', '');
  });

  it('should shows Databases list with two rows', () => {
    cy.get('#databases-infinite-scroll').find('[data-cy=listRow]').should('have.length', 2);
  });

  it('should open database details info after clicking on the first row and shows the selected database info', () => {
    cy.get('#databases-infinite-scroll').find('[data-cy=listRow]').first().click();
    cy.server();
    cy.route(
      'GET',
      '/api/v1/database/db',
      'fixture:database/selected-database-details-info',
    );
    cy.route(
      'GET',
      '/api/v1/es/schema/?q=(filters:!((col:database_uid,opr:eq,value:%27db%27)),page:0,page_size:15)',
      'fixture:database/selected-database-schema-list',
    );
    cy.wait(3000);
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').should('have.length', 7);
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').first()
      .find('.labelled-text__label').should('have.text', 'Type');
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').first()
      .find('.labelled-text__content').should('have.text', 'postgresql');

    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(1)
      .find('.labelled-text__label').should('have.text', 'Host');
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(1)
      .find('.labelled-text__content').should('have.text', 'clean-superset-postgres.c8k3qkkeruvc.eu-central-1.rds.amazonaws.com');

    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(2)
      .find('.labelled-text__label').should('have.text', 'Port');
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(2)
      .find('.labelled-text__content').should('have.text', '5432');

    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(3)
      .find('.labelled-text__label').should('have.text', 'Username');
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(3)
      .find('.labelled-text__content').should('have.text', 'superset');

    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(4)
      .find('.labelled-text__label').should('have.text', 'Created');
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(4)
      .find('.labelled-text__content').should('have.text', '5 months ago');

    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(5)
      .find('.labelled-text__label').should('have.text', 'Updated');
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').eq(5)
      .find('.labelled-text__content').should('have.text', '5 months ago');

    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').last()
      .find('.labelled-text__label').should('have.text', 'Last used');
    cy.get('[data-cy=databaseDetailsInfo]').find('.labelled-text').last()
      .find('.labelled-text__content').should('have.text', 'No use');
  });

  it(`should shows 'DB' in details sidebar title `, () => {
    cy.get('.details__header__title__label').should('have.text', 'DB');
  });

  it(`should shows 'database icon' in details sidebar title `, () => {
    cy.get('.details__header__title__icon').find('span').should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('database');
      });
  });

  it(`should shows 'Schemas2' in schema's table header `, () => {
    cy.get('[data-cy=databaseSchemasList]').find('.underlined-tab-header').should('have.text', 'Schemas2');
  });

  it(`should have 2 columns for schemas table as Name and Last modified`, () => {
    cy.get('[data-cy=databaseSchemasList]').find('.list-header__item').first().should('have.text', 'Name');
    cy.get('[data-cy=databaseSchemasList]').find('.list-header__item').last().should('have.text', 'Last modified');
  });

  it('should have 2 rows of schemas', () => {
    cy.get('#database-schemas-infinite-scroll').find('[data-cy=listRow]').should('have.length', 2);
  });

  it('should shows ... button as action button ', () => {
    cy.get('.details__header__toolbar__action').find('button').find('span').should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('more');
      });
  });

  it('should shows a menu with three items ( Open, Edit and Delete ) when user clicks on action button', () => {
    cy.get('.details__header__toolbar__action').find('button').click();
    cy.get('[data-cy=databaseActionMenu]').find('.bp3-icon').first().should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('cog');
      });
    cy.get('[data-cy=databaseActionMenu]')
      .find('.bp3-text-overflow-ellipsis').first().should('have.text','Open');

    cy.get('[data-cy=databaseActionMenu]').find('.bp3-icon').eq(1).should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('edit');
      });
    cy.get('[data-cy=databaseActionMenu]')
      .find('.bp3-text-overflow-ellipsis').eq(1).should('have.text','Edit');

    cy.get('[data-cy=databaseActionMenu]').find('.bp3-icon').last().should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('trash');
      });
    cy.get('[data-cy=databaseActionMenu]')
      .find('.bp3-text-overflow-ellipsis').last().should('have.text','Delete');
  });

  it('should shows close button for database details sidebar', () => {
    cy.get('.details__header__toolbar__close').find('span').should('have.attr', 'icon')
      .then(icon => {
        expect(icon).to.be.equal('cross');
      });
  });

  it('should close database details sidebar after click on close button', () => {
    cy.get('.details__header__toolbar__close').click();
    cy.get('[data-cy=databaseDetailsInfo]').should('not.exist');
  });

  it('should shows an action menu when user clicks on a Database row action button', () => {
    cy.get('#databases-infinite-scroll').find('[data-cy=listRow]').find('.query-list__rows__trigger').first().click();
    cy.get('[data-cy=databaseActionMenu]').should('exist');
  });

});
