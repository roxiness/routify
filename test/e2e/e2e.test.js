// import { setupRuntime } from './setup-runtime.js'

// let teardown

// beforeAll(async () => {
//     teardown = await setupRuntime()
// })

// afterAll(async () => {
//     teardown()
// })

await test('should see front page', async () => {
    await page.goto('http://localhost:3334')
    const result = await page.waitForSelector('"test suite"', { timeout: 100 })
    expect(result).toBeTruthy()
})

await test('Can click a link', async () => {
    await page.goto('http://localhost:3334')
    await page.waitForSelector('"test suite"', { timeout: 100 })
    await page.click('"blog"')
    const result = await page.waitForSelector('"My Blog"', { timeout: 100 })
    expect(result).toBeTruthy()
})
