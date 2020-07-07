const test = require('../../playwright-test')

test('basic basepaths work', async (t, page) => {
    await page.goto('http://localhost:5000/bp/?basepath=/bp');
    t.assert(await page.$('"/index.svelte"'))
});

test('dynamic basepaths work', async (t, page) => {
    await page.goto('http://localhost:5000/bp/?basepath=(/bp)?');
    t.assert(await page.$('"/index.svelte"'))
    await page.goto('http://localhost:5000/?basepath=(/bp)?');
    t.assert(await page.$('"/index.svelte"'))
});

//todo test that outgoing/destroyed components don't fire