import { cached, split } from '../../utils.js'
import { readFileSync, rmdirSync } from 'fs'
import { dirname, relative, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(dirname(import.meta.url))

beforeAll(() => rmdirSync(resolve(__dirname, 'temp'), { recursive: true }))

test('can split', async () => {
    const path = resolve(__dirname, 'temp', 'split.js')
    split('im split', path)
    const result = await import('./' + relative(__dirname, path)).then(
        r => r.default,
    )
    expect(result).toBe('im split')
})

test("cache doesn't update without refresh", async () => {
    const path = resolve(__dirname, 'temp', 'cache.js')
    const result = await cached(() => 'im cache', path)
    const result2 = await cached(() => 'im updated cache', path)

    expect(result).toBe('im cache')
    expect(result2).toBe('im cache')
})

test('can split cached data', async () => {
    const splitPath = resolve(__dirname, 'temp', 'split-combined.js')
    const cachePath = resolve(__dirname, 'temp', 'cache-combined.js')
    const cacheVal1 = await cached(() => 'im split', cachePath)
    const cacheVal2 = await cached(() => 'im split updated', cachePath)

    await split(cacheVal2, splitPath)

    const result = await import('./' + relative(__dirname, splitPath)).then(
        r => r.default,
    )

    expect(result).toBe('im split')
})

test('can refresh cached data', async () => {
    const path = resolve(__dirname, 'temp', 'cache2.js')
    await cached(() => 'im cache', path)
    await cached(() => 'im refreshed cache', path, true)
    await cached(() => 'im updated cache', path)
    expect(readFileSync(path, 'utf-8')).toBe(
        'export default "im refreshed cache"',
    )
})
