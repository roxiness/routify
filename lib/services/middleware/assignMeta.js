const { pipeAsync, walkAsync } = require('../../utils/fp')
const { makeLegalIdentifier } = require('rollup-pluginutils')


function applyMetaToFiles({ metaParser: parser }) {
  return walkAsync(async function (file) {
    if (file.dir) return
    const meta = await parser.get(file.absolutePath)
    file.meta = meta
    if (file.isLayout) {
      file.getParent().meta = meta
    }
  })
}

function applyMetaToTree(defaults) {
  return function _applyMetaToTree(file, inherited = defaults) {
    file.meta = mergeMeta(file, { ...inherited })
    if (file.dir) {
      file.dir = file.dir.map(_file => _applyMetaToTree(_file, { ...file.meta }))
    }
    return file
  }
}

/**
 * mergeMeta
 * @param {Object} meta
 * @param {Object} dirMeta
 * @param {Boolean} isLayout
 * @param {String} filepath
 */
function mergeMeta({ meta = {}, filepath, isLayout, dir }, { ...dirMeta }) {
  const inheritedOptions = [
    'preload',
    'precache-order',
    'precache-proximity',
    'recursive',
    '$$bundleId',
  ]

  inheritedOptions.forEach(prop => {
    meta[prop] = meta[prop] || dirMeta[prop]
    // if (isLayout) {
    //   dirMeta[prop] = meta[prop]
    // }
  })

  // ignore layout bundles, as they're passed to the parent folder
  if (!isLayout)
    if (meta.bundle === false) {
      delete meta.$$bundleId
      if (dir) delete dirMeta.$$bundleId
    } else if (meta.bundle === true) {
      {
        if (!dir) throw Error('bundling can not be enabled in individual files')
        dirMeta.$$bundleId = makeLegalIdentifier(filepath) + '.js'
      }
      meta.$$bundleId = dirMeta.$$bundleId
    }

  return meta
}

module.exports = { applyMetaToFiles, applyMetaToTree }