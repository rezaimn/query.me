
describe('Notebook - Edit', () => {
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
      // cy.wait('@loadNotebook');
    });

    cy.wait(5000);

    // Create a new page in the notebook
    cy.createPage();

    cy.wait(1000);

    // Select the new page
    cy.selectLastPageInMenu().click();
  });

  afterEach(() => {

  });

  /* it('should change notebook name', () => {
  }); */

  const cursorToStart = (el) => {
    const doc = el.ownerDocument
    const sel = doc.getSelection()
    sel.removeAllRanges()
    const range = doc.createRange()
    range.selectNode(el)
    sel.addRange(range)
    sel.collapseToStart()
  }

  const cursorToEnd = (el) => {
    /* const doc = el.ownerDocument
    const sel = doc.getSelection()
    sel.removeAllRanges()
    const range = doc.createRange()
    range.selectNode(el)
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    sel.addRange(range)
    sel.collapseToStart() */
    const range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(el);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    const selection = window.getSelection();//get the selection object (allows you to change selection)
    selection.removeAllRanges();//remove any selections already made
    selection.addRange(range);//make the range you have just crea
  }

  /* const cursorToEnd = (el) => {
    range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();//get the selection object (allows you to change selection)
    selection.removeAllRanges();//remove any selections already made
    selection.addRange(range);//make the range you have just crea
  } */

  it('should edit notebooks', () => {
    // Enable the editor
    cy.wait(5000);
    cy.getEditor().click();
    cy.wait(5000);
    // Enter a new line
    cy.getEditor().typeInSlate('{enter}');
    // Type text
    cy.getEditor().typeInSlate('abc');
    cy.getEditor().typeInSlate('{backspace}');
    cy.getLastBlockText().should('have.text','ab');
  });

  it('should display block toolbar', () => {
    // Display the toolbar for the block
    cy.displayToolbarForLastBlock();
    // Open menu on the create button
    cy.displayCreateContextualMenu();
    // Click on the menu item 'Text'
    cy.selectItemInContextualMenu('Text');
    cy.wait(5000);
    cy.displayDragSelectorContextualMenu();
    // Open turn into menu on the drag selector
    cy.selectItemInContextualMenu('Turn into');
    cy.wait(5000);
    // Click on the menu item 'SQL'
    cy.selectItemInContextualMenu('SQL');
  });

  // should create h1 block using toolbar

  // should create h2 block using toolbar

  it('should create sql block using toolbar', () => {
    // Display the toolbar for the block
    cy.displayToolbarForLastBlock();
    // Open menu on the create button
    cy.displayCreateContextualMenu();
    cy.wait(5000);
    // Click on the menu item 'SQL'
    cy.selectItemInContextualMenu('SQL');
    // Type SQL code
    cy.selectLastSqlBlockInEditor().type('select 1', { force: true })
    // Check editor elements in the page
    // We should have one 'h1' and one 'sql'
    cy.selectBlocksInEditor().then(elements => {
      expect(elements.length).to.equal(2);
      expect(elements[0].className).to.contain('slate-h1');
      expect(elements[1].className).to.contain('sql');
      cy.checkBlockName(elements[1], 'query_1');
    });
    // Check text
    cy.wait(5000);
    cy.getLastSqlBlockText().should('have.value','select 1\n\n');
    // TODO: check save requests
  });

  it('should convert text block to sql using toolbar', () => {
    // Enable the editor
    cy.getEditor().click();
    // Enter a new line
    cy.getEditor().typeInSlate('{enter}');
    // Enter text
    cy.getEditor().typeInSlate('select 1');
    cy.wait(5000);
    // Open menu on the drag selector
    cy.displayDragSelectorContextualMenu();
    cy.wait(5000);
    // Open turn into menu on the drag selector
    cy.selectItemInContextualMenu('Turn into');
    cy.wait(5000);
    // Click on the menu item 'SQL'
    cy.selectItemInContextualMenu('SQL');
    // Check editor elements in the page
    // We should have one 'h1' and one 'sql'
    cy.selectBlocksInEditor().then(elements => {
      expect(elements.length).to.equal(2);
      expect(elements[0].className).to.contain('slate-h1');
      expect(elements[1].className).to.contain('sql');
      // TODO: expect content
    });
    // Check text
    cy.getLastSqlBlockText().should('have.value','select 1\n\n');
  });

  it('should convert sql block to text using toolbar', () => {
    cy.wait(1000);
    // Display the toolbar for the block
    cy.displayToolbarForLastBlock();
    // Open menu on the create button
    cy.displayCreateContextualMenu();
    // Click on the menu item 'SQL'
    cy.selectItemInContextualMenu('SQL');
    cy.wait(5000);
    // Type SQL code
    cy.selectLastSqlBlockInEditor().type('select 1', { force: true });
    cy.wait(5000);
    // Open menu on the drag selector
    cy.displayDragSelectorContextualMenu();
    // Open turn into menu on the drag selector
    cy.get('[data-cy = draggableMenu]').findByLabelText('Turn into').click()
    // Click on the menu item 'SQL'
    cy.selectItemInContextualMenu('Text');
    cy.wait(5000);
    // Check editor elements in the page
    // We should have one 'h1' and one 'sql'
    cy.selectBlocksInEditor().then(elements => {
      expect(elements.length).to.equal(2);
      expect(elements[0].className).to.contain('slate-h1');
      expect(elements[1].className).to.contain('p');
    });
    // Check text
    cy.getLastBlockText().should('have.text','select 1');
  });

});
