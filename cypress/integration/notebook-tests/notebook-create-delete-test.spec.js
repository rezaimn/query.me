describe('Notebooks - General Functionality', () => {

  it('Create * Rename Notebook', () => {

    cy.visitNotebookOverview()
    // Create a new Notebook
    cy.createNewNotebook(true);
    cy.get('@notebookUID').then(notebookUID => {
      cy.log(`Notebook UID: ${notebookUID}`);
    });
  });

  it('create text blocks', () => {

    //Create Header 1 block

    cy.displayCreateContextualMenu()
    cy.clickButton('Header 1')
    // cy.get('.bp3-portal').find('ul>li').contains('Header 1').click();
    cy.wait(500)
    cy.selectLastBlockInEditor().click().type('Header 1')
    cy.wait(5000)

    // Create Header 2 block
    cy.displayCreateContextualMenu()
    cy.clickButton('Header 2')
    cy.wait(500)
    cy.selectLastBlockInEditor().click().wait(500).type('Header 2')
    cy.wait(5000)

    // Create Text block
    cy.displayCreateContextualMenu()
    cy.clickButton('Text')
    cy.wait(500)
    cy.selectLastBlockInEditor().click().wait(500).type('Text block')
    cy.wait(5000)

    // Create Blockquote block
    cy.displayCreateContextualMenu()
    cy.clickButton('Blockquote')
    cy.wait(500)
    cy.selectLastBlockInEditor().click().wait(500).type('Testing is good.{enter}-- Smart man')
    cy.wait(5000)

    // Create Code block
    cy.displayCreateContextualMenu()
    cy.clickButton('Code block')
    cy.wait(500)
    cy.selectLastBlockInEditor().click().wait(500).type('print(\'Hello Test!\')')
    cy.wait(5000)

    // Create Code block
    cy.displayCreateContextualMenu()
    cy.clickButton('HR')
    cy.wait(5000)
  });

  it('create Image block', () => {
    // Create Image block
    cy.displayCreateContextualMenu()
    // cy.clickButton('Image')
    cy.contains('Image').click()
    cy.wait(1000)
    cy.get('.bp3-portal').find('input').click()
      .type('https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif{enter}')
    cy.wait(500)
    cy.get('.bp3-portal').contains('OK').click();
    cy.wait(5000)
  });

  it('create & name Parameter block', () => {
    // Create Parameter
    cy.displayCreateContextualMenu()
    cy.clickButton('Parameter')
    cy.wait(5000)
    // Name Parameter
    cy.get('.parameter__header').find('.bp3-editable-text')
      .click()
      .wait(500)
      .clear()
      .wait(500)
      .type(`Parameter{enter}`, {delay: 100});
    cy.wait(1000)
    cy.wait(2000)
  });

  it('create & name SQL block', () => {
    // Create SQL block
    cy.displayCreateContextualMenu()
    cy.clickButton('SQL')
    cy.get('[data-cy=selectDatabasePopover]', {timeout: 10000}).find('li').should('be.visible')
    cy.wait(5000)
    // cy.clickButton('Demo DB')
    cy.get('[data-cy=selectDatabasePopover]').contains('Demo DB').click()


    // Name SQL block
    cy.get('[data-cy=blockName]')
      .click()
      .wait(500)
      .clear()
      .wait(500)
      .type(`SQL{enter}`, {delay: 100});
    cy.wait(5000)
  });

  it('create & name Chart block', () => {

    // Create Chart block
    cy.displayCreateContextualMenu()
    cy.clickButton('Chart')
    cy.wait(5000)

    // Name Chart block
    cy.get('[data-cy=plotlyTitle]')
      .click()
      .wait(500)
      .clear()
      .wait(500)
      .type(`Chart{enter}`, {delay: 100});
    cy.wait(5000)
  })

  it('assert 11 elements exist', () => {
    cy.get('[data-slate-node="element"]').should('have.length', 11)
  });

  it('deletes all blocks', () => {
    for (const x of Array(10).keys()) {
      cy.displayDragSelectorContextualMenu()
      cy.clickButton('Delete')
    }
    cy.get('[data-slate-node="element"]').should('have.length', 2)
  });


  it('Deletes used notebook', () => {
    cy.visitNotebookOverview()
    cy.deleteCreatedNotebook()
  });
});


