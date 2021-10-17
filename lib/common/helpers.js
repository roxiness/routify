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
 * @param {RNodeBuildtime} target eg. de
 * @param {...RNodeBuildtime} sources eg. en
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
