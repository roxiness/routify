import { getExamplesPath, runViteDev } from '../utils.js'

beforeAll(() => page.setDefaultTimeout(25000))

test('should see sveltekit front page', async ({ skip }) => {
    return skip('kit starter needs fixing')
    const { kill, port } = await runViteDev(getExamplesPath('sveltekit'))
    await page.goto(`http://localhost:${port}`)
    const result = await page.waitForSelector('"Welcome to SvelteKit + Routify"')
    expect(result).toBeTruthy()
    await kill()
})
