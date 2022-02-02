import { filemapper } from '../../../lib/buildtime/plugins/filemapper/lib/index.js'
import { exportNode } from '../../../lib/buildtime/plugins/exporter/exporter.js'
import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'
import { dirname, resolve } from 'path'
import { test, expect } from 'vitest'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))
const options = {
    routesDir: { default: __dirname + '/example' },
}

const instance = new RoutifyBuildtime(options)

test('can build route tree', async () => {
    await filemapper({ instance })
    expect(Object.values(instance.rootNodes)[0].descendants.length).toEqual(7)
})

test('can export a route tree', async () => {
    await exportNode(Object.values(instance.rootNodes)[0], __dirname + '/temp/.routify')
    const content = fse.readFileSync(
        resolve(__dirname, 'temp/.routify', 'routes.default.js'),
        'utf-8',
    )
    expect(content).toMatchSnapshot()
})
