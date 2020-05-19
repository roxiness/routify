/// <reference types="cypress" />

const reset = new Promise((resolve, reject) => {
    console.log('in reset')
    const regPromise = navigator.serviceWorker.getRegistrations()
        .then(registrations => Promise.all(registrations.map(reg => {
            console.log('reg', reg)

            return reg.unregister()
        })))
    const cachePromise = window.caches.keys()
        .then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                console.log('cn', cacheName)
                return window.caches.delete(cacheName)
            })
        ))

    Promise.all([regPromise, cachePromise]).then(() => {
        const regPromise = navigator.serviceWorker.getRegistrations()
        const cachePromise = window.caches.keys()
        Promise.all([regPromise, cachePromise]).then(([reg, cache]) => {            
            setTimeout(() => {
                console.log(reg)
                window.location.replace(window.location.origin)
                resolve({ reg, cache })
                
            }, 1000);
        })
    })
})


context('Actions', () => {
    Cypress.config({
        baseUrl: "http://localhost:5000"
    });

    before(() => {
        cy.visit('/')
        cy.wait(100)
        // cy.wrap
        // cy.wait(100).then(() => reset())
        cy.wrap(reset).then(res => {
            expect(res.reg).to.have.length(0, 'there should be no registries')
            expect(res.cache).to.have.length(0, 'there should be no cache')
        })
        cy.wait(500)

    })

    it('has no service worker or cache', () => {
        // cy.resetSW()

        
        // cy.wait(3000)
        // cy.wait(1500)
        // cy.wrap({ cacheNames: () => window.caches.keys() })
        //     .invoke('cacheNames').should('have.length', 0)
        // cy.wrap({ registrations: () => navigator.serviceWorker.getRegistrations() })
        //     .invoke('registrations').should('have.length', 0)
    })

    it('replaces old worker', async () => {
        // window.location.replace(window.location.origin)
        // cy.visit('/').then(()=>{
        // })
        // cy.wait(100)
        // return new Promise(resolve => setTimeout(() => {
        //     resolve('done')
        // }, 100))
        // cy.wrap({ f: () => window.location.replace(window.location.origin) }).invoke('f')
        // window.location.replace(window.location.origin) //replace old service worker
        // window.location.replace(window.location.origin) //replace old service worker
    })

    it('it has a service worker', () => {
        // cy.wait(1000)
        // cy.wrap({ cacheNames: () => window.caches.keys() }).invoke('cacheNames')
        //     .should('include', 'workbox-precache-v2-http://localhost:5000/')
        //     .should('include', 'fallback')
        // cy.wrap({ registrations: () => navigator.serviceWorker.getRegistrations() })
        //     .invoke('registrations').should('have.length', 1)
    })



    it('it works offline', () => {
        emulateNetwork({ offline: true })
        cy.reload().then(() => {
            // return emulateNetwork({ offline: true })
        })
        cy.visit('/')
        cy.wait(1000)
        cy.reload()
        cy.visit('/')
        cy.get('#routify-app').should('exist')
        cy.visit('/fetch/prefetch/delay0')
        cy.get('.result').should('exist').then(() => {
        cy.visit('/fetch/prefetch/local')
        cy.get('.result').should('exist').then(() => {
            // window.location.replace(window.location.origin)
        })
        emulateNetwork({ offline: false })
    })




})



function emulateNetwork(params) {
    const defaults = {
        offline: false,
        'latency': 0,
        'downloadThroughput': 0,
        'uploadThroughput': 0,
        'connectionType': 'none',
    }
    return Cypress.automation('remote:debugger:protocol', {
        command: 'Network.emulateNetworkConditions',
        params: {
            ...defaults, ...params
        },
    })
}



function replaceWorker() {
    window.location.replace(window.location.origin)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('foobar')
        }, 100);
    })
}


