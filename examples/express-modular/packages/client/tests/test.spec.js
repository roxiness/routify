/** @type { Router } */
let router

beforeAll(async () => {
    await import('../.routify/routify-init.js')
    router = globalThis.__routify.routers[0]
    await router.ready()
    // wait for components to render
    await new Promise((resolve) => setTimeout(resolve))
})

test('can see /', async () => {
    await router.url.push('/')

    expect(document.body.innerHTML).toContain('Welcome to Your New Routify 3 Project!')
})
