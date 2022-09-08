describe('Notebook - List', () => {
  let notebookUid = null;
  let notebooksLength = null;

  before(() => {
    cy.server();
    cy.route(
      'GET',
      '/api/v1/notebook/?q=(page:0,page_size:15)',
      'fixture:notebook/notebook-list'
    ).as('fixture:notebook/notebook-list');
    cy.visit('/n');

    // Wait for data loaded
    cy.wait('@fixture:notebook/notebook-list').then(xhr => {
      expect(xhr.status, 'successful GET').to.equal(200);
      expect(xhr.response.body.result.length, 'successful GET').to.be.greaterThan(0);
      notebookUid = xhr.response.body.result[0].uid;
      notebooksLength = xhr.response.body.result.length;
    });
  });

  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should list notebooks', () => {
    // Check table columns
    cy.get('[data-cy=listHeaderItem]').eq(0).should('contain.text', 'Name');
    cy.get('[data-cy=listHeaderItem]').eq(1).should('contain.text', 'Modified by');
    cy.get('[data-cy=listHeaderItem]').eq(2).should('contain.text', 'Last modified');
    cy.get('[data-cy=listHeaderItem]').eq(3).should('contain.text', 'Tags');
    cy.get('[data-cy=listHeaderItem]').eq(4).should('contain.text', '');

    // Check number of rows
    // cy.get('[data-cy=listRow]').its('length').should('equal', notebooksLength);
    cy.get('[data-cy=listRow]').then(elements => {
      expect(elements.length).to.equal(notebooksLength);
    });

    // Open menu for the first row by clicking in the last column
    cy.get('[data-cy=listRow]')
      .first()
      .find('[data-cy=listColumn]')
      .last()
      .click();
  });

  it('should shows 4 columns and the first column is Name and two rows should be existed', () => {
    cy.get('[data-cy=listHeaders]').find('.list-header__item').should('have.length', 5);
    cy.get('[data-cy=listHeaders]').find('.list-header__item').first().should('have.text', 'Name');
    cy.get('#notebooks-infinite-scroll').find('.list-row').then(elements => {
      expect(elements.length).to.equal(notebooksLength);
    });
  });
});
