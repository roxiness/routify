import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';
import { dirname, resolve, sep } from "path";
import { fileURLToPath } from 'url';
import { Node } from '../../../lib/node.js';
import { filemapper } from '../../../middleware/filemapper/lib/middlewares/filemapper.js';
import { moveModuleToParentNode } from '../../../middleware/filemapper/lib/middlewares/fileToModule.js';
import { filenameToOptions } from '../../../middleware/filemapper/lib/middlewares/filenameToOptions.js';
import { readFileSync, writeFileSync } from 'fs';
import { setComponent } from '../../../middleware/filemapper/lib/middlewares/setComponent.js';

const __dirname = dirname(fileURLToPath(import.meta.url))

const ctx = {
    options: {
        filemapper: {
            moduleFiles: ['_module.svelte', '_reset.svelte'],
            resetFiles: ['_reset.svelte'],
            routesDir: { default: `${__dirname}/example` }
        }
    }
}

const root = new Node()

test('files are mapped', async () => {
    await filemapper(root, ctx.options.filemapper.routesDir.default)
    assertSnapshot('1.filemap-only', root.map, 0)
})

test('modules are merged with parent node', async () => {
    moveModuleToParentNode(root, ctx.options.filemapper.moduleFiles)
    await filemapper(root, ctx.options.filemapper.routesDir.default)
    assertSnapshot('2.filemap-with-modules', root.map, 0)
})

test('options get added', async () => {
    filenameToOptions(root)
    await filemapper(root, ctx.options.filemapper.routesDir.default)
    assertSnapshot('3.filemap-with-resets', root.map, 0)
})

test('components get added', async () => {
    setComponent(root)
    await filemapper(root, ctx.options.filemapper.routesDir.default)
    assertSnapshot('4.filemap-with-components', root.map, 0)
})

test.run()



function assertSnapshot(name, content, update) {
    content = JSON.parse(JSON.stringify(content))
    const filepath = `${__dirname}/fixtures/${name}.json`
    if (update)
        writeFileSync(filepath, JSON.stringify(content, null, 2))
    const expect = JSON.parse(readFileSync(filepath, 'utf-8'))
    assert.equal(content, expect)
}