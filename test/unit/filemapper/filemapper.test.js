import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';
import { filemapper } from '../../../middleware/filemapper/lib/filemapper.js'
import { dirname, resolve, sep } from "path";
import { fileURLToPath } from 'url';
import { Node } from '../../../lib/node.js';
import { moveModuleToParentNode } from '../../../middleware/module/lib/module.js';



const root = new Node()
const examplePath = `${dirname(fileURLToPath(import.meta.url))}/example`

test('files are mapped', async () => {
    await filemapper(examplePath, root)
    const expectedFilemap = await import('./expect/filemap.js').then(r => r.default)
    const map = JSON.parse(JSON.stringify(root.map))
    assert.equal(map, expectedFilemap)
})



test('modules are moved to parent node', async () => {
    moveModuleToParentNode(root)
    const expectedFilemap = await import('./expect/filemap-module.js').then(r => r.default)
    const map = JSON.parse(JSON.stringify(root.map))
    assert.equal(map, expectedFilemap)
})

test.run()