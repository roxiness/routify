import { createDirname } from '../../../lib/buildtime/utils.js'
import { getExamplesPath, runViteDev } from '../../utils.js'
const __dirname = createDirname(import.meta)

beforeAll(() => page.setDefaultTimeout(25000))

test('should see starter front page', async () => {
    const { kill, port } = await runViteDev(`${__dirname}/app`)
    await page.goto(`http://localhost:${port}`)
    const result = await page.waitForSelector('h1')
    expect(result).toBeTruthy()
    await kill()
})
