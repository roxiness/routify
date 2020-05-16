import { Selector } from 'testcafe';

const online = {
    offline: false,
    latency: 0,
    downloadThroughput: 100000,
    uploadThroughput: 100000
};
const offline = { ...online, offline: true };
const slow = { ...online, latency: 1000 };

const base = `http://localhost:5000`

fixture`Home`.page(base);

test('Server starts', async t => {

    await t.expect(Selector('*').exists).ok('server timed out', { timeout: 5 })
        // .click(Selector('#details-button'))
        // .click(Selector('#proceed-link'))
})

fixture`Service worker`.page(`${base}/fetch/prefetch`);
test('pages are precached', async t => {
    // await t.wait(1000)
    // await emulate(t, offline)
    // await t.navigateTo('/fetch')
    // await t.navigateTo('/fetch/batch/page4')
    // // todo expect something
    // await emulate(t, online)

})
test('data not available before prefetch', async t => {


})
test('prefetch', async t => {
    await t
        .click(Selector('#prefetch button.delay0'))
        .wait(500)
    // await emulate(t, offline)

    await t
        .click(Selector('a[href="/fetch/prefetch/delay0"]'))
        .expect(Selector('.result').innerText).contains('hello')

    await emulate(t, online)
});

async function emulate(t, config) {
    const browserConnection = t.testRun.browserConnection;
    const browser = browserConnection.provider.plugin.openedBrowsers[browserConnection.id];
    const cdp = browser.client;
    await cdp.Network.emulateNetworkConditions(config)
}
