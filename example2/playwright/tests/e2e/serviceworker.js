const test = require('../../playwright-test')


test('Site should be online', async (t, page) => {
    await page.goto('http://localhost:5000');
    t.is(await page.title(), 'Svelte app');
});

test('Unvisited site is unavailable offline', async (t, page, context) => {
    await context.setOffline(true)
    let err
    try { await page.goto('http://localhost:5000'); }
    catch (_err) { err = _err }
    await t.regex(err.message, /ERR_INTERNET_DISCONNECTED|NS_ERROR_FAILURE/)
});

test('It works offline', async (t, page, context) => {
    await page.goto('http://localhost:5000')
    await page.waitForSelector('"Just installed"')
    await context.setOffline(true)
    await page.goto('http://localhost:5000/fetch')
    const element = await page.$('"/fetch/index.svelte"')
    await t.truthy(element)
})

test('Prefetched pages have data', async (t, page, context) => {
    await page.goto('http://localhost:5000/fetch/prefetch')
    await page.waitForSelector('"Just installed"')
    await page.click('.delay1')
    await new Promise(resolve => setTimeout(resolve, 2500))

    await page.click('"goto/fetch/prefetch/delay1"')
    const element = await page.$('.result')
    const txt = await element.innerText()
    await t.deepEqual(txt, '{"hello":"world"}')
})

// test('Offline means offline', async (t, page, context) => {
//     await page.goto('http://localhost:5000/fetch/prefetch')
//     await page.waitForSelector('"Just installed"')
//     await context.setOffline(true)
//     await page.click('"goto/fetch/prefetch/delay0"')
//     await new Promise(resolve => setTimeout(resolve, 1000))
//     const element = await page.$(`.result`)
//     const txt = await element.innerText()
//     await t.deepEqual(txt, '')
// })


test('prefetch is gone after cache timeout', async (t, page, context) => {
    await page.goto('http://localhost:5000/fetch/prefetch')
    const elem = await page.$('input.cachetime')
    await elem.fill('1')
    await page.click('.delay1')
    await new Promise(resolve => setTimeout(resolve, 4000))
    // t.is(1, (await elem.asElement()).evaluate(f => f))

    await page.click('"goto/fetch/prefetch/delay1"')
    const element = await page.$('.result')
    const txt = await element.innerText()
    await t.notDeepEqual(txt, '{"hello":"world"}')
})
