const test = require('../../playwright-test')


test('redirects works on direct visit', async (t, page) => {
    await page.goto('http://dev.local:5000/metaredirect/redirect')
    t.is(page.url(), 'http://dev.local:5000/metaredirect/target')
    t.assert(await page.$('"/metaredirect/target.svelte"'))
});

test('recursive redirects works on direct visit', async (t, page) => {
    await page.goto('http://dev.local:5000/metaredirect/recursive-redirect')
    t.is(page.url(), 'http://dev.local:5000/metaredirect/target')
    t.assert(await page.$('"/metaredirect/target.svelte"'))
});

test('redirects works on navigation', async (t, page) => {
    await page.goto('http://dev.local:5000/metaredirect')
    await page.click('a[href="/metaredirect/redirect"]')
    t.is(page.url(), 'http://dev.local:5000/metaredirect/target')
    t.assert(await page.$('"/metaredirect/target.svelte"'))
});

test('recursive redirects works on navigation', async (t, page) => {
    await page.goto('http://dev.local:5000/metaredirect')
    await page.click('a[href="/metaredirect/recursive-redirect"]')
    t.is(page.url(), 'http://dev.local:5000/metaredirect/target')
    t.assert(await page.$('"/metaredirect/target.svelte"'))
});

test('rewrites works on direct visit', async (t, page) => {
    await page.goto('http://dev.local:5000/metaredirect/rewrite')
    t.is(page.url(), 'http://dev.local:5000/metaredirect/rewrite')
    t.assert(await page.$('"/metaredirect/target.svelte"'))
});

test('recursive rewrites works on direct visit', async (t, page) => {
    await page.goto('http://dev.local:5000/metaredirect/recursive-rewrite')
    t.is(page.url(), 'http://dev.local:5000/metaredirect/recursive-rewrite')
    t.assert(await page.$('"/metaredirect/target.svelte"'))
});

test('rewrites works on navigation', async (t, page) => {
    await page.goto('http://dev.local:5000/metaredirect')
    await page.click('a[href="/metaredirect/rewrite"]')
    t.is(page.url(), 'http://dev.local:5000/metaredirect/rewrite')
    t.assert(await page.$('"/metaredirect/target.svelte"'))
});

test('recursive rewrites works on navigation', async (t, page) => {
    await page.goto('http://dev.local:5000/metaredirect')
    await page.click('a[href="/metaredirect/recursive-rewrite"]')
    t.is(page.url(), 'http://dev.local:5000/metaredirect/recursive-rewrite')
    t.assert(await page.$('"/metaredirect/target.svelte"'))
});

