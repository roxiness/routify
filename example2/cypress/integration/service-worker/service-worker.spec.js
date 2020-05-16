/// <reference types="cypress" />

context('Actions', () => {
    Cypress.config({
        baseUrl: "http://localhost:5000"
    });

    before(async function () {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (reg of registrations) {
            await reg.unregister()
        }
        return window.caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    return window.caches.delete(cacheName);
                })
            );
        })
    })

    it('is a blank slate', () => {
        emulateNetwork(Cypress, { offline: true })
        cy.visit('/')
        navigator.serviceWorker.getRegistrations().then(registrations => {
            expect(registrations.length).to.equal(0)
            expect(registrations.length).to.not.equal(1)
            expect(registrations.length).to.equal(1)
        })
        emulateNetwork(Cypress, { offline: false })
        cy.get('#justInstalled').should('exist')
    })
    
    it('it installs a service worker', () => {
        cy.visit('/')
            navigator.serviceWorker.getRegistrations().then(registrations => {
                expect(registrations.length).to.equal(1)
            })
        cy.get('#justInstalled').should('exist')
    })
    it('it works offline', ()=>{
        emulateNetwork(Cypress, { offline: true })
        cy.visit('/')
        cy.get('#routify-app').should('exist')
    })
})


function emulateNetwork(Cypress, params) {
    const defaults = {
        offline: true,
        'latency': 0,
        'downloadThroughput': 0,
        'uploadThroughput': 0,
        'connectionType': 'none',
    }
    Cypress.automation('remote:debugger:protocol', {
        command: 'Network.emulateNetworkConditions',
        params: {
            ...defaults, ...params
        },
    })
}