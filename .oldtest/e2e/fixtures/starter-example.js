import { Selector } from 'testcafe';
const S = Selector

const base = `http://localhost:5000`

fixture`Home`.page(base);

test('Server starts', async t => {
    await t.expect(Selector('*').exists).ok('server timed out', {timeout: 5})
})

test('Page loads', async t => {
    await t.expect(Selector(`#routify-app h1`).exists).ok()
});
test('Navigation', async t => {
    await t.click(Selector('a[href="/example"]'))
        .expect(Selector('img[alt="logo"]').exists).ok()
});

const example = Selector('#routify-app>.example')

fixture`Examples`.page(`${base}/example`);
test('Navigation', async t => {
    await t.expect(example.exists).ok()
        .click(Selector('a[href="/example/reset"]'))
        .expect(example.exists).notOk()
        .click(Selector('a[href="/example"]'))
        .expect(example.exists).ok()
});
test('Layouts', async t => {
    await t.click(Selector('a[href="/example/layouts"]'))
        .expect(S('.layout-container').exists).ok()
        .expect(S('.layout-container .layout-container').exists).notOk()
        .click(Selector('a[href="/example/layouts/child"]'))
        .expect(S('.layout-container .layout-container').exists).ok()
        .expect(S('.layout-container .layout-container .layout-container').exists).notOk()
        .click(Selector('a[href="/example/layouts/child/grandchild"]'))
        .expect(S('.layout-container .layout-container .layout-container').exists).ok()
        .click(Selector('a[href="/example/layouts"]'))
        .expect(S('.layout-container .layout-container').exists).notOk()
});
test('Widget', async t => {
    await t.click(Selector('a[href="/example/widget"]'))
        .expect(S('h1').innerText).contains('CrudWidget')
        .click(Selector('a[href="/example/widget/2"]'))
        .click(Selector('a[href="/example/widget/2/update"]'))
        .expect(S('a[href="/example/widget/2"]').innerText).contains('Back')
});
test('Aliasing', async t => {
    await t.click(Selector('a[href="/example/aliasing"]'))
        .click(Selector('a[href="/example/aliasing/v1.1"]'))
        .click(Selector('a[href="/example/aliasing/v1.1/feature2"]'))
        .expect(S('b').innerText).contains('v1.1 feature')
        .expect(S('b').innerText).notContains('v1 feature')
        .click(Selector('a[href="/example/aliasing/v1.1/feature3"]'))
        .expect(S('b').innerText).contains('v1 feature')
        .expect(S('b').innerText).notContains('v1.1 feature')
});
test('Aliasing', async t => {
    await t.click(S('a[href="/example/404"]'))
        .expect(S('.e404').innerText).contains('Page not found')
})
test('API', async t => {
    await t.click(S('a[href="/example/api"]'))
    await t.click(S('a[href="/example/api/32"]'))
        .expect(S('h1').innerText).contains('Fargo')
})
test('App', async t => {
    await t.click(S('a[href="/example/app"]'))
        .expect(example.exists).notOk()
    await t.click(S('button'))
        .expect(S('h1').textContent).contains('Welcome logged in user')
})

fixture`Transitions`.page`${base}/example/transitions/tabs`
test('Transitions', async t => {
    const animatedDiv = S('.transition[style*="animation"]')
    await t
        .expect(animatedDiv.exists).notOk()
        .click(Selector('a[href="/example/transitions/tabs/feed"]'))
        .expect(animatedDiv.exists).ok()
        .expect(animatedDiv.exists).notOk()
        .click(Selector('a[href="/example/transitions/tabs/feed/1"]'))
        .expect(animatedDiv.exists).ok()
        .expect(animatedDiv.exists).notOk()
})

fixture`Modals`.page`${base}/example/modal`;
test('Modals', async t => {
    await t.click(Selector('a[href="/example/modal/basic"]'))
        .click(Selector('a[href="/example/modal/basic/0"]'))
        .expect(Selector('.modal').textContent).contains('0')
        .click(Selector('.container'))
        .expect(Selector('.modal').exists).notOk()
});
test('Animated modals', async t => {
    const animatedModal = Selector('.modal[style*="animation"]')
    await t.click(Selector('a[href="/example/modal/animated"]'))
        .expect(Selector('.modal').exists).notOk()
        .click(Selector('a[href="/example/modal/animated/0"]'))
        .expect(animatedModal.textContent).contains('0')
        .expect(animatedModal.exists).notOk()
        .click(Selector('.container'))
        .expect(animatedModal.textContent).contains('0')
        .expect(animatedModal.exists).notOk()
});

