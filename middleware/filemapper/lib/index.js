import { Routify } from "../../../lib/Routify.js"
import { createNodesFromFiles } from "./middlewares/createNodesFromFiles.js"
import { filenameToOptions } from "./middlewares/filenameToOptions.js"
import { moveModuleToParentNode } from "./middlewares/fileToModule.js"
import { setComponent } from "./middlewares/setComponent.js"

/**
 * Runs the suite of filemapper middlewares on the
 * Routify instance
 * @param {{instance: Routify}}
 */
export default async ({ instance }) => {
    const { options } = instance

    const promises = Object.entries(options.filemapper.routesDir)
        .map(async ([key, value]) => {
            const rootNode = instance.createNode()
            rootNode.rootName = key
            await createNodesFromFiles(rootNode, value)
            moveModuleToParentNode(rootNode)
            filenameToOptions(rootNode)
            setComponent(rootNode)
            // todo this line should be able to precede middleware
            instance.rootNode.appendChild(rootNode)
        })

    await Promise.all(promises)
}
