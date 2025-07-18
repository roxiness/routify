/** @type { Router } */
let router

beforeAll(async () => {
    await import('../.routify/routify-init.js')
    router = globalThis.__routify.routers[0]
    await router.rendered()
})

test('can see /', async () => {
    await router.url.push('/')
    expect(document.body.innerHTML).toContain('Hello World')
})
