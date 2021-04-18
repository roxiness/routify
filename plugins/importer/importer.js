/**
 * @param {RNode} parentNode
 * @param {object} snapshotRoot
 * @returns {RNode}
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
 * @param {RoutifyRuntimePayload} param0
 */
export const importer = ({ instance }) => {
    const node = instance.superNode.createChild('')
    populateNodeTreeFromSnapshot(node, instance.options.routes)
}
