describe("Notebook - Manage Notebook Pages", () => {

    const idInName = true;

    before(() => {
        cy.visitNotebookOverview();
        cy.createNewNotebook(idInName);
    });
    
    it('should add new page to notebook', () => {
        cy.createPage();
        cy.wait(1000);

        //TODO Assert whether page was successfully created
    });
   
    it('should edit name of first page in notebook', () => {

        cy.changeFirstPageName('Test Name');

        //TODO Assert whether name was successfully changed
    });

    it('should delete the last page', () => {
        //TODO
    });

    after(()  => {
        cy.deleteCreatedNotebook(idInName);
    });
});