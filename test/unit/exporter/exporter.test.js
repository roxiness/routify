import { suite } from 'uvu'
import fse from 'fs-extra'
import * as assert from 'uvu/assert'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { exportNode } from '../../../plugins/exporter/exporter.js'
import { filemapper } from '../../../plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '../../../lib/RoutifyBuildtime.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const test = suite('exporter')
const options = {
    filemapper: {
        routesDir: { default: __dirname + '/example' },
    },
}

const instance = new RoutifyBuildtime(options)

test('can build route tree', async () => {
    await filemapper({ instance })
    assert.is(instance.superNode.children[0].descendants.length, 7)
})

test('can export a route tree', async () => {
    await exportNode(
        instance.superNode.children[0],
        __dirname + '/temp/.routify',
    )
    const content = fse.readFileSync(
        resolve(__dirname, 'temp/.routify', 'routes.default.js'),
        'utf-8',
    )
    assertSnapshot('routes.js', content, 0)
})

test.run()

function assertSnapshot(name, content, update) {
    content = JSON.parse(JSON.stringify(content))
    const filepath = `${__dirname}/fixtures/${name}`
    if (update) fse.outputFileSync(filepath, content)
    const expect = fse.readFileSync(filepath, 'utf-8')
    assert.snapshot(content, expect)
}
