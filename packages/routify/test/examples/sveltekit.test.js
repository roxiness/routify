import { getPath, runViteDev } from './utils.js'

beforeAll(() => page.setDefaultTimeout(25000))

test('should see sveltekit front page', async () => {
    const { kill, port } = await runViteDev(getPath('sveltekit'))
    await page.goto(`http://localhost:${port}`)
    const result = await page.waitForSelector('"Welcome to SvelteKit + Routify"')
    expect(result).toBeTruthy()
    await kill()
})
