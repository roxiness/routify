import { Node } from '../../common/Node.js' //eslint-disable-line
import { RoutifyRuntime } from '../../runtime/RoutifyRuntime.js'

/**
 * @param {Node} parentNode
 * @param {object} snapshotRoot
 * @returns {Node}
 */
export const populateNodeTreeFromSnapshot = (parentNode, snapshotRoot) => {
    const queue = [[parentNode, snapshotRoot]]

    let queueItem
    while ((queueItem = queue.pop())) {
        const [node, snapshot] = queueItem
        const { children, ...nodeSnapshot } = snapshot
        Object.assign(node, nodeSnapshot)

        // queue children
        for (const childSnapshot of children){
            const childNode = node.createChild(childSnapshot.name)
            queue.unshift([childNode, childSnapshot])
        }
    }
    return parentNode
}

/**
 * imports exported nodes
 * @param {{instance: RoutifyRuntime}} param0
 */
export const importer = ({ instance }) => {
    const node = instance.superNode.createChild('')
    populateNodeTreeFromSnapshot(node, instance.options.routes)
}
