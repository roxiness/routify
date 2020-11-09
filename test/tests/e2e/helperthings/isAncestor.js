const test = require('../../../playwright-test')

test('isAncestor', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/isAncestor');
    t.assert(await page.$('"/helpers/isAncestor/index.svelte"'))

    const errors = await page.$$('.errors *')
    for (const err of errors) {
        t.log(await err.textContent())
    }
    t.assert(!errors.length)
})
