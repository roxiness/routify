import { split } from '../../utils.js'
import { rmdirSync } from 'fs'
import { dirname, relative, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(dirname(import.meta.url))

beforeAll(() => rmdirSync(resolve(__dirname, 'temp'), { recursive: true }))

test('can split', async () => {
    const path = resolve(__dirname, 'temp', 'split.js')
    split('im split', path)
    const result = await import('./' + relative(__dirname, path)).then(r => r.default)
    expect(result).toBe('im split')
})
