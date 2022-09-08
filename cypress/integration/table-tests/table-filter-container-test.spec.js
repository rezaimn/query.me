describe('Table - Filter - Container', () => {
  before(() => {
    cy.visit('/d/t');
  });
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should shows filter bar with two buttons for save view and add filter', () => {
    cy.wait(5000);
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').first().should('have.text', 'Save View');
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').last().should('have.text', 'Add Filter');
  });
  it('should shows Database option after click on add filter', () => {
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').last().click();
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').should('have.length', 3);
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').first().should('have.text', 'Database');
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').last().should('have.text', 'Schema');
  });
  it('should shows Database tag and filter options after click on Database filter', () => {
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').last().click();
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button').should('have.length', 6);
  });

  it('should shows Apply button in Table filter options', () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.filters__menu__apply').find('span').last().should('have.text', 'Apply');
  });

  it('should shows an input and auto-focus on it when select one of the Table filter options', () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button').first().click();
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').should('have.length',1);
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').first().should('be.focused');
  });

  it(`should shows a tag with text 'Schema is test' and a remove button`, () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').first().type('test{enter}');
    cy.get('[data-cy=filterTags]').find('.bp3-text-overflow-ellipsis').first().should('have.text',`Schema is 'test'`);
    cy.get('[data-cy=filterTags]').find('.bp3-tag-remove').first().should('exist');
  });

  it('should remove the filter tag after click on remove button in Table filter tags', () => {
    cy.get('[data-cy=filterTags]').find('.bp3-tag-remove').first().click();
    cy.get('[data-cy=filterTags]').should('not.exist');
  });

  it('should shows a popup after click on save view in Table List View page with Create a new view header and a close button', () => {
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').first().click();
    cy.get('.bp3-dialog').find('.bp3-heading').first().should('have.text','Create a new view');
    cy.get('.bp3-dialog').find('.bp3-dialog-close-button').first().should('exist');
  });

  it('Table Save view popup should have body and footer', () => {
    cy.get('.bp3-dialog').find('.bp3-dialog-body').first().should('exist');
    cy.get('.bp3-dialog').find('.bp3-dialog-footer').first().should('exist');
  });

  it('Table Save view popup body should have an input with Name label and should auto-focus on the input', () => {
    cy.get('.bp3-dialog').find('.bp3-dialog-body').first().find('.bp3-form-group').should('have.length',1);
    cy.get('.bp3-dialog-body').find('label').should('have.text','Name ');
    cy.get('.bp3-dialog-body').find('input').should('be.focused');
  });

  it('Table Save view popup footer should have Cancel and Create buttons', () => {
    cy.get('.bp3-dialog-footer').find('button').first().find('span').should('have.text','Cancel');
    cy.get('.bp3-dialog-footer').find('button').last().find('span').should('have.text','Create');
  });

  it('Table Save view popup footer should disappear after click on cancel button ', () => {
    cy.get('.bp3-dialog-footer').find('button').first().click();
    cy.get('.bp3-dialog').should('not.exist');
  });
});
