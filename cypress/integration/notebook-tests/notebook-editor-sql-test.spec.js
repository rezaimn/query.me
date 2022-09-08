describe('Notebook - Edit SQL', () => {
  beforeEach(() => {
    let notebookUid = null;

    cy.server();

    // Go to nootebooks page
    cy.visit('http://localhost:3000/n');

    cy.route('GET', 'https://staging.query.me/api/v1/notebook/?q=(page:0,page_size:15)').as('listNotebooks')

    // cy.wait(1000);

    // Go to a notebook page
    cy.wait('@listNotebooks').then(xhr => {
      notebookUid = xhr.response.body.result[0].uid;
      cy.visit(`http://localhost:3000/n/${notebookUid}`);
      cy.route('GET', `https://staging.query.me/api/v1/notebook/${notebookUid}`).as('loadNotebook');
      // Wait for the new page to be loaded
      cy.wait('@loadNotebook');
    });

    cy.wait(1000);

    // Create a new page in the notebook
    cy.createPage().click();

    cy.wait(1000);

    // Select the new page
    cy.selectLastPageInMenu().click();

    // Display the toolbar for the block
    cy.displayToolbarForLastBlock();
    // Open menu on the create button
    cy.displayCreateContextualMenu();
    // Click on the menu item 'SQL'
    cy.selectItemInContextualMenu('SQL');

    // Check editor elements in the page
    // We should have one 'h1' and one 'sql'
    cy.selectBlocksInEditor().then(elements => {
      expect(elements.length).to.equal(2);
      expect(elements[0].className).to.contain('slate-h1');
      expect(elements[1].className).to.contain('sql');
      cy.checkBlockName(elements[1], 'query_1');
    });

    // cy.wait('@createBlock');

  });

  afterEach(() => {

  });

  it('should fill text in sql block', () => {
    // Fill the request sql
    cy.selectLastSqlBlockInEditor().type('select id from log', { force: true });
  });

  /* it('should edit name of sql block', () => {
    cy.wait(5000);

    // Click in the editable text (block name)
    cy.get('[data-slate-node="element"]')
      .last()
      .find('.bp3-editable-text')
      .click();

    cy.wait(500);

    // Type some text in the editable text
    cy.get('[data-slate-node="element"]')
      .last()
      .find('.bp3-editable-text-input')
      .type('new block name');

    // Type enter in the editable text to validate the change
    cy.get('[data-slate-node="element"]')
      .last()
      .find('.bp3-editable-text-input')
      .type('\n');
  });

  it('should select a dabatase for sql block', () => {
    cy.wait(5000);

    // Click on the database icon for the block
    cy.get('[data-slate-node="element"]')
      .last()
      .find('.bp3-icon-database')
      .click();

    // Click on the last menu item (a database)
    cy.get('.bp3-popover-content')
      .find('.bp3-menu-item')
      .first()
      .click();
  }); */
});
