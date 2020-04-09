
const { makeLegalIdentifier } = require('rollup-pluginutils')
const { createNodeMiddleware } = require('../utils/middleware')

const applyMetaToFiles = createNodeMiddleware(async nodePayload => {
  const { file, state } = nodePayload
  const { metaParser } = state.treePayload

  if (file.isFile) {
    file.meta = await metaParser.get(file.absolutePath)
    if (file.isLayout) file.getParent().meta = file.meta
  }
})

/**
 * 
 * @param {TreePayload} treePayload
 */
function applyMetaToTree(treePayload) {
  const { tree, defaultMeta } = treePayload

  /**
  * @param {RouteNode} file
  * @param {Meta} inherited
  * @returns {RouteNode}
  */
  return function _applyMetaToTree(file, inherited) {
    file.meta = mergeMeta(file, { ...inherited })

    if (file.children) {
      file.children = file.children.map(_file => _applyMetaToTree(_file, { ...file.meta }))
    }
    return file
  }(tree, defaultMeta)
}

/**
 * 
 * @param {TreePayload} payload 
 */
function defineDefaultMeta(payload) {
  payload.defaultMeta = {
    bundle: false,
    recursive: true,
    'precache-order': false,
    'precache-proximity': true,
    preload: false,
  }
}

/**
 * mergeMeta
 * @param {RouteNode} routeNode
 * @param {Meta} dirMeta
 * @returns {Meta}
 */
function mergeMeta({ meta = {}, filepath, isLayout, children }, { ...dirMeta }) {

  const inheritedOptions = [
    'preload',
    'precache-order',
    'precache-proximity',
    'recursive',
    '$$bundleId',
  ]

  inheritedOptions.forEach(prop => {
    meta[prop] = meta[prop] || dirMeta[prop]
  })

  // ignore layout bundles, as they're passed to the parent folder
  if (!isLayout)
    if (meta.bundle === false) {
      delete meta.$$bundleId
      if (children) delete dirMeta.$$bundleId
    } else if (meta.bundle === true) {
      {
        if (!children) throw Error('bundling can not be enabled in individual files')
        dirMeta.$$bundleId = makeLegalIdentifier(filepath) + '.js'
      }
      meta.$$bundleId = dirMeta.$$bundleId
    }

  return meta
}

module.exports = { applyMetaToFiles, applyMetaToTree, defineDefaultMeta }