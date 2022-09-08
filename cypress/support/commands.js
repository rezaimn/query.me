// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands';
// import waitForExpect from 'wait-for-expect';

Cypress.Commands.add('clickButton', (buttonLabel) => {
  cy.findByLabelText(buttonLabel).click({ force: true })
});
Cypress.Commands.add('assertGreenToast', () => {
  // Snackbar must be 'successful'
  cy.get('.bp3-toast').should('have.class', 'bp3-intent-success');
})

Cypress.Commands.add('closeToast', () => {
  // Snackbar must be closed for editable text areas
  /* cy.waitUntil(() => {
    return cy.get('element').should('not.exist');
  }); */
  cy.get('.bp3-toast').find('.bp3-button').click();
})

//Commmands for notebook overview page

Cypress.Commands.add('visitNotebookOverview', () => {
  /* Visit page and assert whether it was successfully loaded */

  // - Open Notebook view and wait for load to finish
  // - Assert whether list items exist, are visible, and are no skeletons
  // 'should' will retry until timeout
  cy.visit('http://localhost:3000/n');
  cy.get('[data-cy=rowOpenMenu]', { timeout: 10000 }).should('exist');
  cy.get('[data-cy=rowOpenMenu]', { timeout: 1000 }).should('be.visible');
  cy.get('[data-cy=rowOpenMenu]', { timeout: 1000 }).should('not.have.class', 'bp3-skeleton');
});

Cypress.Commands.add('createNewNotebook', (idInName = false) => {
  /** Create new notebook & enter notebook editor */

  //Create new notebook (automatically redirects to editor)
  cy.clickButton('New Notebook');
  cy.wait(1000);
  //Assert that redirection was successful and notebook got created
  cy.location('pathname').should('match', /\/n\/[0-9a-z\-]*/i);
  cy.wait(1000);
  // Assert Toast displays 'success' and close
  cy.assertGreenToast();
  cy.closeToast();

  if(idInName){
    //Get notebook UID from URL
    cy.location('pathname').invoke('split', '/').its(2).as('notebookUID');
    //Log notebook UID and change notebook name to it
    cy.get('@notebookUID').then( notebookUID => {
      cy.log(`Notebook UID: ${notebookUID}`);
      cy.changeNotebookName(notebookUID);
    });

    // assert Toast displays 'success' and close
    cy.assertGreenToast();
    cy.closeToast();
  }
});

Cypress.Commands.add('deleteCreatedNotebook', (idInName = false) => {

  // if notebook name == notebookUID
  if(idInName){
    //Get notebook UID from URL
    cy.location('pathname').invoke('split', '/').its(2).as('notebookUID');

    cy.get('@notebookUID').then( notebookUID => {
      cy.visitNotebookOverview();
      // Assert that Notebook exists and has no duplicates
      cy.get('[data-cy=listColumn]').contains(notebookUID).should(($lis) => {
          expect($lis).to.have.length(1)
      })
      // get notebook and remove it
      cy.get('[data-cy=listColumn]').contains(notebookUID).parent().find('[data-cy=rowOpenMenu]').click();
      cy.clickButton('Delete');
      // confirm delete using primary button in pop-over
      cy.get('.bp3-dialog').find('.bp3-intent-primary').click();
      cy.wait(1000)
      cy.get('.list-row').contains(notebookUID).should('not.exist');
    });
  }
  else{
    // Get latest entry and delete it
    let newNotebook = cy.get('[data-cy=rowOpenMenu]').first()
    newNotebook.click();
    cy.wait(1000);
    cy.clickButton('Delete');
    //cy.wait(3000);
    cy.get('.bp3-dialog').find('.bp3-intent-primary').click();
    cy.wait(1000);
  }
});


// Commands for list

// Commands for pages

Cypress.Commands.add('createPage', () =>
  cy.get('[data-cy=pagesToolbar]').get('[data-cy=addPageAction]').click()
);


Cypress.Commands.add('selectLastPageInMenu', () =>
  // For BP3, we have to use css selectors
  cy.get('[data-cy=pages]')
    .find('.bp3-tree-node-content-0')
    .last()
    .find('.bp3-tree-node-label')
    .first()
);

Cypress.Commands.add('changeFirstPageName', (newPageName) => {


  //Select first page in document tab
  let selectedPageElement = cy.get(".notebook-details__pages")
    .find('.bp3-tree-node-content-0')
    .first();

  //Click edit-page button for first page
  selectedPageElement.realHover()
    .find(".edit-button")
    .click();

  //Get input form
  let nameInputForm = cy.get('.page__form__name');

  //Assert whether input form successfully opened
  nameInputForm.should('exist');

  //Enter new pagename in input field and confirm (by typing enter)
  nameInputForm.get('.bp3-input').click().type(`{selectall}${newPageName}{enter}`);
  cy.wait(1000);


});

// Commands for editor

Cypress.Commands.add('changeNotebookName', (newName) => {

  // write new name into title
  cy.get('[data-cy=notebookTitle]')
    .click()
    .wait(500)
    .clear()
    .wait(500)
    .type(`${newName}{enter}`, {delay: 100});
  cy.wait(500);

  // assert that text is added
  cy.get('[data-cy=notebookTitle]').get('.bp3-editable-text-content').contains(newName);
  cy.wait(1000);
});



Cypress.Commands.add('displayToolbarForLastBlock', () => {
  cy.get('[data-cy=selectable]')
    .last()
    .find('[data-cy=selectableGutterLeft]')
    .invoke('attr', 'style', 'opacity: 1; top: 2px; left: 80px; margin-top: 10px;');
});

Cypress.Commands.add('displayCreateContextualMenu', () => {
  cy.get('[data-cy=selectable]')
    .last()
    .find('[data-cy=selectableGutterLeft]')
    .find('[data-cy=createButton]')
    .click();
});

Cypress.Commands.add('displayDragSelectorContextualMenu', () => {
  cy.get('[data-cy=selectable]')
    .last()
    .find('[data-cy=selectableGutterLeft]')
    .find('[data-cy=dragSelector]')
    .click();
});

Cypress.Commands.add('selectItemInContextualMenu', (itemLabel) => {
  cy.get('.bp3-popover-content').findByLabelText(itemLabel).click()
});

Cypress.Commands.add('selectLastBlockInEditor', () =>
  cy.get('[data-slate-node="element"]')
    .last()
);

Cypress.Commands.add('selectFirstBlockInEditor', () =>
  cy.get('[data-slate-node="element"]')
    .first()
);

Cypress.Commands.add('selectLastSqlBlockInEditor', () =>
  // For Ace, we have to use css selectors
  cy.get('.sql-code-editor')
    .last()
    .find('.ace_text-input')
);

Cypress.Commands.add('selectBlocksInEditor', () =>
  cy.get('[data-slate-editor="true"]')
    .find('[data-slate-node="element"]')
    .first()
    .find('[data-slate-node="element"]')
)

Cypress.Commands.add('checkBlockName', (element, name) => {
  cy.get(element)
    .find('[data-cy=blockName]')
    .contains(name);
});

Cypress.Commands.add('getEditor', () =>
  cy.get('[data-slate-editor="true"]')
);

Cypress.Commands.add('getLastBlockText', () =>
  // See this issue: https://stackoverflow.com/questions/52491253/how-to-get-div-text-value-in-cypress-test-using-jquery
  cy.get('[data-slate-editor="true"]')
    .find('[data-slate-node="element"]')
    .first()
    .find('[data-slate-node="element"]')
    .last()
    .find('[data-slate-node="text"]')
    .find('[data-slate-leaf="true"]')
    .find('[data-slate-string="true"]')
);

Cypress.Commands.add('checkLastBlockText', (text) => {
  // See this issue: https://stackoverflow.com/questions/52491253/how-to-get-div-text-value-in-cypress-test-using-jquery
  cy.getLastBlockText().invoke('text').then((currentText) => {
    expect(currentText.trim()).equal(text)
  });
});

Cypress.Commands.add('getLastSqlBlockText', () =>
  // See this issue: https://stackoverflow.com/questions/52491253/how-to-get-div-text-value-in-cypress-test-using-jquery
  // For Ace, we have to use css selectors
  cy.get('.sql-code-editor')
    .last()
    .find('.ace_text-input')
);

Cypress.Commands.add('checkLastSqlBlockText', (text) => {
  // See this issue: https://stackoverflow.com/questions/52491253/how-to-get-div-text-value-in-cypress-test-using-jquery
  cy.getLastSqlBlockText().invoke('text').then((currentText) => {
    expect(currentText.trim()).equal(text)
  });
});

Cypress.Commands.add('getSlateEditor', (selector) => {
  return cy.get(selector)
    .click();
});

Cypress.Commands.add('typeInSlate', { prevSubject: true }, (subject, text) => {
  return cy.wrap(subject)
    .then(subject => {
      if (text === '{enter}') {
        subject[0].dispatchEvent(new KeyboardEvent('keydown', {
          code: 'Enter',
          key: 'Enter',
          charCode: 13,
          keyCode: 13,
          view: window,
          bubbles: true
        }));
      } else if (text === '{backspace}') {
        subject[0].dispatchEvent(new InputEvent('beforeinput', { inputType: 'deleteContentBackward' }));
      } else if (text === '{delete}') {
        subject[0].dispatchEvent(new InputEvent('beforeinput', { inputType: 'deleteHardLineForward' }));
      } else {
        subject[0].dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: text }));
      }
      console.log('subject');
      return subject;
    })
});

Cypress.Commands.add('clearInSlate', { prevSubject: true }, (subject) => {
  return cy.wrap(subject)
    .then(subject => {
      subject[0].dispatchEvent(new InputEvent('beforeinput', { inputType: 'deleteHardLineBackward' }))
      return subject;
    })
});
