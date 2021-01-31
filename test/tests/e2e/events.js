const test = require('../../playwright-test')


test('afterPageLoad fires after new page', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/events/from');
    t.assert(await page.$('"afterPageLoad count: 1"'))

    await page.click('[data-node-path="/helpers/events/to.svelte"]')
    await new Promise(resolve => setTimeout(resolve, 500))
    t.assert(await page.$('"afterPageLoad count: 2"'))
});


test('afterPageLoad fires when params change', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/events/param1')
    await page.click('"param2"')
    t.assert(await page.$('"afterPageLoad count: 2"'))
})


test('isChangingPage', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/events/delayed-page')
    t.assert(await page.$('"isChangingPage: true"'))
    await new Promise(resolve => setTimeout(resolve, 500))
    t.assert(await page.$('"isChangingPage: false"'))
    await page.click('"param2"')
    t.assert(await page.$('"isChangingPage: false"'))
    await page.click('"delayed page"')
    t.assert(await page.$('"isChangingPage: true"'))
    await new Promise(resolve => setTimeout(resolve, 600))
    t.assert(await page.$('"isChangingPage: false"'))
})