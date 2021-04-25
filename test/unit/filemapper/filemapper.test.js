import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { createNodesFromFiles } from '../../../plugins/filemapper/lib/utils/createNodesFromFiles.js'
import { moveModuleToParentNode } from '../../../plugins/filemapper/lib/utils/moveModuleToParentNode.js'
import { filenameToOptions } from '../../../plugins/filemapper/lib/utils/filenameToOptions.js'
import { readFileSync, writeFileSync } from 'fs'
import { filemapper } from '../../../plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '../../../lib/RoutifyBuildtime.js'

const test = suite('filemapper')
const __dirname = dirname(fileURLToPath(import.meta.url))

const options = {
    filemapper: {
        moduleFiles: ['_module.svelte', '_reset.svelte'],
        resetFiles: ['_reset.svelte'],
        routesDir: { default: `${__dirname}/example` },
    },
}

const instance = new RoutifyBuildtime(options)

let rootNode = instance.createNode()
rootNode.rootName = 'default'

test('files are mapped', async () => {
    await createNodesFromFiles(rootNode, options.filemapper.routesDir.default)
    assert.equal(instance.nodeIndex.length, 13)
    assertSnapshot('1.filemap-only', rootNode, 0)
})

test('modules are merged with parent node', async () => {
    moveModuleToParentNode(rootNode)
    assert.equal(instance.nodeIndex.length, 11)
    assertSnapshot('2.filemap-with-modules', rootNode, 0)
})

test('options get added', async () => {
    filenameToOptions(rootNode)
    assertSnapshot('3.filemap-with-resets', rootNode, 0)
})

test('filemapper', async () => {
    const instance = new RoutifyBuildtime(options)
    await filemapper({ instance })
    assertSnapshot(
        '4.filemap-with-components',
        instance.superNode.children[0],
        0,
    )
})

test.run()

function assertSnapshot(name, content, update) {
    content = JSON.parse(JSON.stringify(content))
    const filepath = `${__dirname}/fixtures/${name}.json`
    if (update) writeFileSync(filepath, JSON.stringify(content, null, 2))
    const expect = JSON.parse(readFileSync(filepath, 'utf-8'))
    assert.equal(content, expect)
}
