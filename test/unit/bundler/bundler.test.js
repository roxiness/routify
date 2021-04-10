import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';
import { dirname, resolve, sep } from "path";
import { fileURLToPath } from 'url';

import { filemapper } from '../../../middleware/filemapper/lib/index.js';
import { readFileSync, writeFileSync } from 'fs';
import { setComponent } from '../../../middleware/filemapper/lib/middlewares/setComponent.js';
import { Routify } from '../../../lib/Routify.js';
import { createBundles } from '../../../middleware/bundler/lib/index.js';
import metaFromFile from '../../../middleware/metaFromFile/lib/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url))


const options = {
    filemapper: {
        moduleFiles: ['_module.svelte', '_reset.svelte'],
        resetFiles: ['_reset.svelte'],
        routesDir: { default: `${__dirname}/example` }
    }
}

const instance = new Routify(options)
const root = instance.createNode()
test('bundler writes files', async () => {
    await filemapper({ instance })
    await metaFromFile({ instance })
    await createBundles(root, `${__dirname}/bundles`)

    assert.snapshot(readFileSync(__dirname + '/bundles/default_admin-bundle.js', 'utf-8'),
        "export {default as default_admin} from '../example/admin/_reset.svelte'" +
        "\nexport {default as default_admin_index_svelte} from '../example/admin/index.svelte'" +
        "\nexport {default as default_admin_page_svelte} from '../example/admin/page.svelte'"
    )

})

test('bundled files have correct component', () => {
    const adminImports = instance.nodeIndex
        .find(node => node.name === 'admin')
        .descendants.map(node => node.component)

    assert.equal(adminImports, [
        'import("default_admin-bundle.js").then(r => r.default_admin)',
        'import("default_admin-bundle.js").then(r => r.default_admin_index_svelte)',
        'import("default_admin-bundle.js").then(r => r.default_admin_page_svelte)'
    ])
})

test.run()