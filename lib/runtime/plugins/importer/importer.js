import '#root/typedef.js'

/**
 * @param {object} snapshotRoot
 * @param {RNodeRuntime} parentNode
 * @returns {RNode}
 */
export const importTree = (snapshotRoot, parentNode) => {
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
        importTree(instance.options.routes, instance.superNode)
    }
}
