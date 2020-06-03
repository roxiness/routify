const test = require('../../playwright-test')


test('beforeUrlChange blocks asynchronously', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/beforeUrlChange/page1');
    await page.click('"page2"')

    await new Promise(resolve => setTimeout(resolve, 800))
    t.is(page.url(), 'http://localhost:5000/helpers/beforeUrlChange/page1')
    await new Promise(resolve => setTimeout(resolve, 400))
    t.is(page.url(), 'http://localhost:5000/helpers/beforeUrlChange/page2')
});

test('changing parameter triggers beforeUrlChange, afterPageLoad and isChangingPage', async (t, page) => {
    await page.goto('http://dev.local:5000/helpers/beforeUrlChange/foo');
    await page.click('"bar"')
    t.assert(await page.$('"beforeUrlChange ran"'))
    t.assert(await page.$('"afterPageLoad ran"'))
    t.assert(await page.$('"isChanging false,true,false"'))
});
