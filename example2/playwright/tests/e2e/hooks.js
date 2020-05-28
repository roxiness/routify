const test = require('../../playwright-test')


test('beforeUrlChange blocks asynchronously', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/beforeUrlChange/page1');
    await page.click('"page2"')

    await new Promise(resolve => setTimeout(resolve, 800))
    t.is(page.url(), 'http://localhost:5000/helpers/beforeUrlChange/page1')
    await new Promise(resolve => setTimeout(resolve, 400))
    t.is(page.url(), 'http://localhost:5000/helpers/beforeUrlChange/page2')
});