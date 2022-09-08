describe('User - Filter - Container', () => {
  before(() => {
    cy.visit('/a/u');
  });
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should shows filter bar with a button for add filter', () => {
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').first().should('have.text', 'Add Filter');
  });
  it('should shows Filter options after click on add filter', () => {
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').last().click();
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').should('have.length', 3);
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').first().should('have.text', 'Email');
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').last().should('have.text', 'Last Name');
  });
  it('should shows Email tag and filter options after click on Email filter', () => {
    cy.get('[data-cy=filterItems]').find('.bp3-text-overflow-ellipsis').first().click();
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button').should('have.length', 6);
  });

  it('should shows Apply button in User filter options', () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.filters__menu__apply').find('span').last().should('have.text', 'Apply');
  });

  it('should shows an input and auto-focus on it when select one of the User filter options', () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button').first().click();
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').should('have.length',1);
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').first().should('be.focused');
  });

  it(`should shows a tag with text 'Email is test' and a remove button`, () => {
    cy.get('[data-cy=selectedFilterOptions]').find('.custom-radio-button__input').first().type('test{enter}');
    cy.get('[data-cy=filterTags]').find('.bp3-text-overflow-ellipsis').first().should('have.text',`Email is 'test'`);
    cy.get('[data-cy=filterTags]').find('.bp3-tag-remove').first().should('exist');
  });

  it('should remove the filter tag after click on remove button in User filter tags', () => {
    cy.get('[data-cy=filterTags]').find('.bp3-tag-remove').first().click();
    cy.get('[data-cy=filterTags]').should('not.exist');
  });

  it('should not shows Save View Button', () => {
    cy.get('[data-cy=filterListTagsToolbar]').find('.bp3-button-text').first().should('not.have.text','Save View');
  });


});
