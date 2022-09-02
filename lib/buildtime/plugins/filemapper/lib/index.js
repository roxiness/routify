import { createNodesFromFiles } from './utils/createNodesFromFiles.js'
import { createRoot404 } from './utils/createRoot404.js'
import { filenameToOptions } from './utils/filenameToOptions.js'
import { normalizeRoutesDir } from './utils/misc.js'
import { moveModuleToParentNode } from './utils/moveModuleToParentNode.js'

/**
 * Runs the suite of filemapper middlewares on the
 * Routify instance
 * @param {{instance: RoutifyBuildtime}} param0
 */
export const filemapper = async ({ instance }) => {
    const { options } = instance
    options.routesDir = normalizeRoutesDir(options.routesDir)

    const promises = Object.entries(options.routesDir).map(async ([key, path]) => {
        const rootNode = instance.createNode()
        /** @ts-ignore rootName */
        rootNode.rootName = key
        await createNodesFromFiles(rootNode, path)
        filenameToOptions(rootNode)
        moveModuleToParentNode(rootNode)
        createRoot404(rootNode, options.routifyDir)
        // todo this line should be able to precede middleware
        instance.rootNodes[key] = rootNode
    })

    await Promise.all(promises)
}
