import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { readFileSync } from 'fs'
import { filemapper } from '../../../lib/buildtime/plugins/filemapper/lib/index.js'
import { createBundles } from '../../../lib/buildtime/plugins/bundler/bundler.js'
import { metaFromFile } from '../../../lib/buildtime/plugins/metaFromFile/metaFromFile.js'
import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const options = {
    routesDir: { default: `${__dirname}/example` },
    filemapper: {
        moduleFiles: ['_module.svelte', '_reset.svelte'],
        resetFiles: ['_reset.svelte'],
    },
}

const instance = new RoutifyBuildtime(options)
test('bundler writes files', async () => {
    await filemapper({ instance })
    await metaFromFile({ instance })
    await createBundles(Object.values(instance.rootNodes)[0], __dirname + '/temp')

    expect(
        readFileSync(__dirname + '/temp/bundles/_default_admin-bundle.js', 'utf-8'),
    ).toBe(
        "export * as _default_admin from '../../example/admin/_reset.svelte'" +
            "\nexport * as _default_admin_index_svelte from '../../example/admin/index.svelte'" +
            "\nexport * as _default_admin_page_svelte from '../../example/admin/page.svelte'",
    )
})

test('bundled files have correct module', () => {
    const adminNode = instance.nodeIndex.find(node => node.name === 'admin')

    const adminImports = [adminNode, ...adminNode.descendants].map(node => node.module)

    expect(adminImports).toEqual([
        '() => import("./bundles/_default_admin-bundle.js").then(r => r._default_admin)::_EVAL',
        '() => import("./bundles/_default_admin-bundle.js").then(r => r._default_admin_index_svelte)::_EVAL',
        '() => import("./bundles/_default_admin-bundle.js").then(r => r._default_admin_page_svelte)::_EVAL',
    ])
})
