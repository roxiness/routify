/**
 * like assign, but without overwrite. First prop wins.
 * @param {object} target
 * @param  {...any} sources
 */
const gentleAssign = (target, ...sources) => {
    sources.forEach(source =>
        Object.keys(source).forEach(key => (target[key] = target[key] ?? source[key])),
    )
    return target
}

/**
 * deep assign node trees, will only overwrite undefined values
 * also merges meta
 * @param {RNodeBuildtime|RNodeRuntime} target eg. de
 * @param {...RNodeBuildtime|RNodeRuntime} sources eg. en
 */
export const assignNode = (target, ...sources) => {
    // assign nodes
    gentleAssign(target, ...sources)

    // assign meta
    gentleAssign(target.meta, ...sources.map(s => s.meta))

    sources.forEach(source => {
        source.children.forEach(sNode => {
            let tNode = target.children.find(tNode => tNode.name === sNode.name)
            if (!tNode) tNode = target.createChild(null, null)
            assignNode(tNode, sNode)
        })
    })
    return target
}

/**
 *
 * @param {RNodeRuntime} node
 * @param {function(RNodeRuntime['parent']):any} callback
 * @returns {RNodeRuntime['parent']|undefined}
 */
export const findNearestParent = (node, callback) => {
    let parent = /** @type {RNodeRuntime} */ node.parent
    while (parent) {
        if (callback(parent)) return parent
        parent = parent.parent
    }
}

/**
 * gets the ancestry distance between two nodes. Eg.:
 * the distance between the nodes /foo and /foo/bar/baz is 2
 * @param {RNodeRuntime} parentNode
 * @param {RNodeRuntime} childNode
 * @returns {number|undefined}
 */
export const getDistance = (parentNode, childNode) => {
    let child = null
    let distance = 0

    while ((child = childNode.parent)) {
        distance++
        if (parentNode === childNode) return distance
    }
}
