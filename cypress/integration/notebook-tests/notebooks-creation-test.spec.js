describe('Notebooks - Creation', () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('should create notebook', () => {
    let createdNotebookUid = null;

    cy.server();

    // Go to nootebooks page
    cy.visit('http://localhost:3000/n');

    cy.route('POST', 'https://staging.query.me/api/v1/notebook/').as('createNotebook')

    // cy.get('.navigation-item__link').first().click();

    cy.wait(5000);

    cy.clickButton('New Notebook').click();

    cy.wait('@createNotebook').then(xhr => {
      expect(xhr.status, 'successful GET').to.equal(201);
      createdNotebookUid = xhr.response.body.result.uid;
    });

    cy.wait(5000);

    // Check the url pattern after details page loaded
    // cy.location('pathname').should('match', new RegExp(`/\/n\/${createdNotebookUid}\/[0-9a-z\-]*`, 'i'));
    cy.location('pathname').then(pathname => {
      expect(pathname).to.match(new RegExp(`/n/${createdNotebookUid}/[0-9a-z\-]*`, 'i'));
    });
  });
});
