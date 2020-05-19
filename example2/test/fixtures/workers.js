import { Selector, ClientFunction } from 'testcafe';

const online = {
    offline: false,
    latency: 0,
    downloadThroughput: 100000,
    uploadThroughput: 100000
};
const offline = { ...online, offline: true };
const slow = { ...online, latency: 1000 };

const base = `http://localhost:5000`


const getRegistrations = ClientFunction(() => window.navigator.serviceWorker.getRegistrations())
const getCaches = ClientFunction(() => window.caches.keys())

const reset = ClientFunction(() => {
    const promise1 = window.navigator.serviceWorker.getRegistrations()
        .then(registrations => Promise.all(registrations.map(reg => {
            console.log('reg', reg)

            return reg.unregister()
        })))
    const promise2 = window.caches.keys()
        .then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                console.log('cn', cacheName)
                return window.caches.delete(cacheName)
            })
        ))
    return Promise.all([promise1, promise2])
})

fixture`Home`.page(base);

// test('no service worker or cache', async t => {
//     await reset()
//     const regs = await getRegistrations()
//     const caches = await getCaches()
//     // await t.expect(caches.length).eql(0)
//     await t.expect(regs.length).eql(0)
//     // window.location.replace(window.location.href)
// })

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
    await emulate(t, offline)

    await t
        .click(Selector('a[href="/fetch/prefetch/delay0"]'))
        // .expect(Selector('.result').innerText).contains('hello')

    await emulate(t, online)
});

async function emulate(t, config) {
    const browserConnection = t.testRun.browserConnection;
    const browser = browserConnection.provider.plugin.openedBrowsers[browserConnection.id];
    const cdp = browser.client;
    await cdp.Network.emulateNetworkConditions(config)
}




    // window.location.replace(window.location.origin)
