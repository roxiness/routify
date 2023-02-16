describe('[Home] template spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:1337/');

        cy.get('h1').should('have.text', 'Routify 3');
    });
});
