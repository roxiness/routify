const test = require('../../playwright-test')

// test('basic basepaths', async (t, page) => {
//     await page.goto('http://localhost:5000/bp/?basepath=/bp');
//     t.assert(await page.$('"/index.svelte"'))
// });

// test('dynamic basepaths', async (t, page) => {
//     await page.goto('http://localhost:5000/bp/?basepath=(/bp)?');
//     t.assert(await page.$('"/index.svelte"'))
//     await page.goto('http://localhost:5000/?basepath=(/bp)?');
//     t.assert(await page.$('"/index.svelte"'))
// });

//todo test that outgoing/destroyed components don't fire

test('urlTransform', async (t, page) => {
    await page.goto('http://localhost:5000/bp/helpers/url?urlTransform=bp');
    t.assert(await page.$('"/helpers/url.svelte"'))
})

test('hash', async (t, page) => {
    await page.goto('http://localhost:5000?useHash=1#/helpers/url');
    t.assert(await page.$('"/helpers/url.svelte"'))
})