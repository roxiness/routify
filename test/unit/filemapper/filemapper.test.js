import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { createNodesFromFiles } from '../../../lib/buildtime/plugins/filemapper/lib/utils/createNodesFromFiles.js'
import { moveModuleToParentNode } from '../../../lib/buildtime/plugins/filemapper/lib/utils/moveModuleToParentNode.js'
import { filenameToOptions } from '../../../lib/buildtime/plugins/filemapper/lib/utils/filenameToOptions.js'
import { filemapper } from '../../../lib/buildtime/plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const options = {
    routesDir: { default: `${__dirname}/example/routes` },
    filemapper: {
        moduleFiles: ['_module.svelte', '_reset.svelte'],
        resetFiles: ['_reset.svelte'],
    },
}

const instance = new RoutifyBuildtime(options)

let rootNode = instance.createNode()
rootNode.rootName = 'default'

test('files are mapped', async () => {
    await createNodesFromFiles(rootNode, options.routesDir.default)
    expect(instance.nodeIndex.length).toBe(12)
    expect(rootNode).toMatchSnapshot('1.filemap-only')
})

test('modules are merged with parent node', async () => {
    moveModuleToParentNode(rootNode)
    expect(instance.nodeIndex.length).toBe(10)
    expect(rootNode).toMatchSnapshot('2.filemap-with-modules')
})

test('options get added', async () => {
    filenameToOptions(rootNode)
    expect(rootNode).toMatchSnapshot('3.filemap-with-resets')
})

test('filemapper', async () => {
    const instance = new RoutifyBuildtime(options)
    await filemapper({ instance })
    expect(Object.values(instance.rootNodes)[0]).toMatchSnapshot(
        '4.filemap-with-components',
    )
})
