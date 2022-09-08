describe('Notebook - Filter - Container', () => {
  before(() => {
    cy.visit('/n');
  });
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should shows filter bar with two buttons for save view and add filter', () => {
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').first().should('have.text', 'Save View');
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').last().should('have.text', 'Add Filter');
  });
  it('should shows Name option after click on add filter', () => {
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').last().click();
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').first().should('have.text', 'Name');
  });
  it('should shows Name tag and filter options after click on Name filter', () => {
    // cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').last().click();
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').first().click();
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button').should('have.length', 6);
  });

  it('should shows Apply button in Notebook filter options', () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.filters__menu__apply').find('span').last().should('have.text', 'Apply');
  });

  it('should shows an input and auto-focus on it when select one of the Notebook filter options', () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button').first().click();
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').should('have.length',1);
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').first().should('be.focused');
  });

  it(`should shows a tag with text 'Name is test' and a remove button`, () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').first().type('test{enter}');
    cy.get('[data-cy=filterTags]').find('.bp3-text-overflow-ellipsis').first().should('have.text',`Name is 'test'`);
    cy.get('[data-cy=filterTags]').find('.bp3-tag-remove').first().should('exist');
  });

  it('should remove the filter tag after click on remove button in Notebook filter tags', () => {
    cy.get('[data-cy=filterTags]').find('.bp3-tag-remove').first().click();
    cy.get('[data-cy=filterTags]').should('not.exist');
  });

  it('should shows a popup after click on save view in Notebook List View page with Create a new view header and a close button', () => {
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').first().click();
    cy.get('.bp3-dialog').find('.bp3-heading').first().should('have.text','Create a new view');
    cy.get('.bp3-dialog').find('.bp3-dialog-close-button').first().should('exist');
  });

  it('Notebook Save view popup should have body and footer', () => {
    cy.get('.bp3-dialog').find('.bp3-dialog-body').first().should('exist');
    cy.get('.bp3-dialog').find('.bp3-dialog-footer').first().should('exist');
  });

  it('Notebook Save view popup body should have an input with Name label and should auto-focus on the input', () => {
    cy.get('.bp3-dialog').find('.bp3-dialog-body').first().find('.bp3-form-group').should('have.length',1);
    cy.get('.bp3-dialog-body').find('label').should('have.text','Name ');
    cy.get('.bp3-dialog-body').find('input').should('be.focused');
  });

  it('Notebook Save view popup footer should have Cancel and Create buttons', () => {
    cy.get('.bp3-dialog-footer').find('button').first().find('span').should('have.text','Cancel');
    cy.get('.bp3-dialog-footer').find('button').last().find('span').should('have.text','Create');
  });

  it('Notebook Save view popup footer should disappear after click on cancel button ', () => {
    cy.get('.bp3-dialog-footer').find('button').first().click();
    cy.get('.bp3-dialog').should('not.exist');
  });
});
