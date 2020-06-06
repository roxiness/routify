const { chromium, firefox, webkit } = require('playwright');
const browserPromise = webkit.launch({ headless: false });

(async () => {

    const browser = await browserPromise;
    const context = await browser.newContext()
    const page = await context.newPage();
    // const session = await context.newCDPSession(page);

    await page.goto('http://localhost:5000/fetch/prefetch')
    await page.waitForSelector('"Just installed"')
    // await page.click('"/fetch/prefetch/delay0"')
    await context.setOffline(true)
    // await page.goto('https://google.com')

    // const offlinePage = await context.newPage()
    // await offlinePage.goto('http://localhost:5000/fetch/prefetch/delay0')



    // await page.evaluate('navigator.serviceWorker.ready')

    // session._connection._sessions.forEach(async _session => {
    //     if (_session._targetType === 'service_worker') {

    //         try {
    //             console.log(_session)
    //             await session._updateProtocolRequestInterception()
    //             await _session.send('Network.enable')
    //             await _session.send('Network.enable')
    //             await _session.send('Network.emulateNetworkConditions', {
    //                 offline: true,
    //                 latency: 0,
    //                 downloadThroughput: 0,
    //                 uploadThroughput: 0,
    //             });
    //         } catch (err) { console.log(err) }
    //     }
    // })

    // try {
    //     await session.send('Target.sendMessageToTarget', {
    //         sessionId: session._sessionId,
    //         message: `{"foo": "bar"}`
    //     });

    // } catch (err) { console.log(err) }


    context.serviceWorkers().forEach(sw => {
        // console.log(sw)
        // console.log(Object.keys(sw))
        // console.log(sw.url())
        // sw.evaluate(()=>{console.log('hello')})
        // console.log(sw.send())
        // sw.
    })

    // await new Promise(resolve => setTimeout(resolve, 500))
    // await page.click('"goto/fetch/prefetch/delay0"')
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // const element = await page.$(`.result`)
    // const txt = await element.innerText()
    // await t.deepEqual(txt, '')
})()

// (async ()=>{

//     const browser = await browserPromise;
//     const context = await browser.newContext()
//     const page = await context.newPage();s

//     await page.goto('http://localhost:5000', {waitUntil: "networkidle"});

// })()
