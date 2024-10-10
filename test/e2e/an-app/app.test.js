import { createDirname } from '../../../lib/buildtime/utils.js'
import { runViteDev } from '../../utils.js'

import { expect } from '@playwright/test'

const __dirname = createDirname(import.meta)

beforeAll(() => page.setDefaultTimeout(25000))

const { kill, port } = await runViteDev(`${__dirname}/app`)

afterAll(async () => {
    await kill()
})

test('should see starter front page', async () => {
    await page.goto(`http://localhost:${port}`)
    await expect(page.getByText('Hello world')).toBeVisible()
})

test('should see default module', async () => {
    await page.goto(`http://localhost:${port}/composition`)
    await expect(page.getByText('Default module')).toBeVisible()
})

test('should see reset module', async () => {
    await page.goto(`http://localhost:${port}/composition/reset`)
    await expect(page.getByText('Default module')).not.toBeVisible()
})

test('should see prepended module', async () => {
    await page.goto(`http://localhost:${port}/composition/prepend`)
    await expect(page.getByText('Default module')).toBeVisible()
    await expect(page.getByText('Custom module')).toBeVisible()
})

test('should see replaced module', async () => {
    await page.goto(`http://localhost:${port}/composition/replace`)
    await page.getByText('Hello world - composition')
    await expect(page.getByText('Default module')).not.toBeVisible()
    await expect(page.getByText('Custom module')).toBeVisible()
})
