import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { readFileSync } from 'fs'
import { filemapper } from '../../../lib/plugins/filemapper/lib/index.js'
import { createBundles } from '../../../lib/plugins/bundler/bundler.js'
import { metaFromFile } from '../../../lib/plugins/metaFromFile/metaFromFile.js'
import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const test = suite('bundler')

const options = {
    filemapper: {
        moduleFiles: ['_module.svelte', '_reset.svelte'],
        resetFiles: ['_reset.svelte'],
        routesDir: { default: `${__dirname}/example` },
    },
}

const instance = new RoutifyBuildtime(options)
test('bundler writes files', async () => {
    await filemapper({ instance })
    await metaFromFile({ instance })
    await createBundles(instance.superNode.children[0], __dirname + '/temp')

    assert.snapshot(
        readFileSync(
            __dirname + '/temp/bundles/_default_admin-bundle.js',
            'utf-8',
        ),
        "export { default as _default_admin } from '../../example/admin/_reset.svelte'" +
            "\nexport { default as _default_admin_index_svelte } from '../../example/admin/index.svelte'" +
            "\nexport { default as _default_admin_page_svelte } from '../../example/admin/page.svelte'",
    )
})

test('bundled files have correct component', () => {
    const adminNode = instance.nodeIndex.find(node => node.name === 'admin')

    const adminImports = [adminNode, ...adminNode.descendants].map(
        node => node.component,
    )

    assert.equal(adminImports, [
        'import("./bundles/_default_admin-bundle.js").then(r => r._default_admin)',
        'import("./bundles/_default_admin-bundle.js").then(r => r._default_admin_index_svelte)',
        'import("./bundles/_default_admin-bundle.js").then(r => r._default_admin_page_svelte)',
    ])
})

test.run()
