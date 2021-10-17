/**
 *
 * @param {RNodeBuildtime} target eg. de
 * @param {RNodeBuildtime} source eg. en
 */
export const assignNode = (target, source) => {
    source.children.forEach(sNode => {
        let tNode = target.children.find(tNode => tNode.name === sNode.name)
        if (!tNode) {
            // copy node, if it's missing
            tNode = target.createChild(null, null)
            Object.assign(tNode, sNode)
        } else {
            // otherwise, just inherit meta
            Object.assign(tNode.meta, sNode.meta, tNode.meta)
        }

        assignNode(tNode, sNode)
    })
    return target
}
