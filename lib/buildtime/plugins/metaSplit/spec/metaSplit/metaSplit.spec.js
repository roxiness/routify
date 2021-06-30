import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { RoutifyBuildtime } from '#lib/buildtime/RoutifyBuildtime.js'
import { metaSplit } from '../../metaSplit.js'
import { readFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const options = {
    routifyDir: `${__dirname}/temp`,
}
beforeEach(() => {
    fse.emptyDirSync(options.routifyDir)
})

test('split meta', async () => {
    const instance = new RoutifyBuildtime(options)
    /** @type {RNodeBuildtime} */
    const node = instance.superNode.createChild('foobar')
    node.file = { path: 'foopath' }
    node.meta.foo = { value: 'bar', split: true }
    await metaSplit({ instance })
    const file = readFileSync(__dirname + '/temp/cached/foopath-foo-split.js', 'utf8')
    expect(file).toBe('export default "bar"')
})
// todo meta can be json stringified with classless
// todo plugins should be used as `instance.use(plugin)`
