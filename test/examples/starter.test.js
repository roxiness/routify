import { getPath, runViteDev } from './utils.js'

beforeAll(() => page.setDefaultTimeout(process.env.GITHUB_ACTIONS ? 30000 : 5000))

test('should see starter front page', async () => {
    const { kill, port } = await runViteDev(getPath('starter'))
    await page.goto(`http://localhost:${port}`)
    const result = await page.waitForSelector('h1')
    expect(result).toBeTruthy()
    kill()
})
