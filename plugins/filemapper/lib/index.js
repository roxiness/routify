import { Routify } from '../../../common/Routify.js' //eslint-disable-line
import { createNodesFromFiles } from './utils/createNodesFromFiles.js'
import { filenameToOptions } from './utils/filenameToOptions.js'
import { moveModuleToParentNode } from './utils/moveModuleToParentNode.js'

/**
 * Runs the suite of filemapper middlewares on the
 * Routify instance
 * @param {{instance: Routify}} param0
 */
export const filemapper = async ({ instance }) => {
    const { options } = instance

    const promises = Object.entries(options.filemapper.routesDir).map(
        async ([key, path]) => {
            const rootNode = instance.createNode()
            rootNode.rootName = key
            await createNodesFromFiles(rootNode, path)
            moveModuleToParentNode(rootNode)
            filenameToOptions(rootNode)
            // todo this line should be able to precede middleware
            instance.superNode.appendChild(rootNode)
        },
    )

    await Promise.all(promises)
}
