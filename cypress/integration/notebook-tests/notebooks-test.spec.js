describe('Notebooks - List', () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should list notebooks', () => {
    let notebookUid = null;
    let notebooksLength = null;

    cy.server();

    // Go to nootebooks page
    cy.visit('http://localhost:3000/n');

    cy.route('GET', 'https://staging.query.me/api/v1/notebook/?q=(page:0,page_size:15)').as('listNotebooks')


    // Wait for data loaded
    cy.wait('@listNotebooks').then(xhr => {
      expect(xhr.status, 'successful GET').to.equal(200);
      expect(xhr.response.body.result.length, 'successful GET').to.be.greaterThan(0);
      notebookUid = xhr.response.body.result[0].uid;
      notebooksLength = xhr.response.body.result.length;
    });

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
      .last().find('[data-cy= rowOpenMenu]')
      .click();

    cy.wait(5000);

    // Click on the menu item ('Open')
    cy.selectItemInContextualMenu('Open');

    cy.wait(5000);

    // Check the url exactly after details page loaded
    cy.location('pathname').then(pathname => {
      expect(pathname).to.match(new RegExp(`/n/${notebookUid}/[0-9a-z\-]*`, 'i'));
    });
  });
});
