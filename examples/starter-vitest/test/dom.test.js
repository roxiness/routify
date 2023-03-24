/** @type { Router } */
let router

beforeAll(async () => {
    await import('../src/main')
    router = globalThis.__routify.routers[0]
    await router.ready()
})

test('can see frontpage', async () => {
    expect(document.body.innerHTML).toContain('Routify 3 App')
})

test('can see /hello-world', async () => {
    await router.url.push('/hello-world')

    expect(document.body.innerHTML).toContain('Hello world!')
})
