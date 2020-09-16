
const { makeLegalIdentifier } = require('rollup-pluginutils')
const { createNodeMiddleware } = require('../utils/middleware')

const defaultMeta = {
  'bundle': false,
  'recursive': true,
  'preload': false,
  'prerender': true,
}
const inheritedOptions = [
  '$$bundleId',
  'recursive',
  'preload',
  'prerender',
]

/**
 * parses .svelte files for metadata and adds it to its respective node 
 **/
const applyMetaToFiles = createNodeMiddleware(async nodePayload => {
  const { file, state } = nodePayload
  const { metaParser } = state.treePayload

  file.ownMeta = file.ownMeta || {}
  if (file.isFile) {
    const node = file.isLayout ? file.getParent() : file
    node.meta = await metaParser.get(file.absolutePath)
    node.ownMeta = JSON.parse(JSON.stringify(node.meta))
  }
})

/**
 * propagate inheritable metadata to descendent nodes. $$bundleId etc.
 * @param {TreePayload} treePayload
 */
function applyMetaToTree(treePayload) {
  const { tree } = treePayload

  /**
  * @param {RouteNode} file
  * @param {Meta} inherited
  * @returns {RouteNode}
  */
  return function _applyMetaToTree(node, inherited) {
    node.meta = mergeMeta(node, { ...inherited })

    if (node.children) {
      node.children = node.children.map(_file => _applyMetaToTree(_file, { ...node.meta }))
    }
    return node
  }(tree, defaultMeta)
}


/**
 * mergeMeta
 * @param {RouteNode} routeNode
 * @param {Meta} parentMeta
 * @returns {Meta}
 */
function mergeMeta(node, { ...parentMeta }) {
  const { meta = {}, filepath, children } = node

  inheritedOptions.forEach(prop => {
    const defined = typeof meta[prop] !== 'undefined'
    meta[prop] = defined ? meta[prop] : parentMeta[prop]
  })

  if (meta.bundle === false) {
    delete meta.$$bundleId
    if (children) delete parentMeta.$$bundleId
  } else if (meta.bundle === true) {
    if (!children) throw Error('bundling can not be enabled in individual files')
    parentMeta.$$bundleId = makeLegalIdentifier(filepath) + '.js'
    meta.$$bundleId = parentMeta.$$bundleId
  }

  return meta
}

module.exports = { applyMetaToFiles, applyMetaToTree }