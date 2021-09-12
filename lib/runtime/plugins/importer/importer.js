import '#root/typedef.js'

/**
 * @param {RNodeRuntime} parentNode
 * @param {object} snapshotRoot
 * @returns {RNode}
 */
export const populateNodeTreeFromSnapshot = (parentNode, snapshotRoot) => {
    const queue = [[parentNode, snapshotRoot]]

    while (queue.length) {
        const [parentNode, snapshot] = queue.pop()
        const { children, ...nodeSnapshot } = snapshot
        const node = parentNode.createChild(snapshot.name || snapshot.rootName || '')
        Object.assign(node, nodeSnapshot)

        // queue children
        for (const childSnapshot of children) queue.unshift([node, childSnapshot])
    }
    return parentNode
}

/**
 * imports exported nodes
 * @param {RoutifyRuntimePayload} param0
 */
export const importer = ({ instance }) => {
    if (instance.options.routes) {
        populateNodeTreeFromSnapshot(instance.superNode, instance.options.routes)
    }
}
