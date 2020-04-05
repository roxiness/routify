const { makeLegalIdentifier } = require('rollup-pluginutils')

const {
  pipeAsync,
  walkAsync,
} = require('../../utils/fp')


const addPath = walkAsync(function addPath(file) {
  let path = file.filepath
  if (file.ext) {
    path = path.slice(0, -(file.ext.length + 1))
  }
  path = path.replace(/\[([^\]]+)\]/g, ':$1')
  file.path = path
})

const addId = walkAsync(function addId(file) {
  if (file.isFile) {
    file.id = makeLegalIdentifier(file.path)
  }
})


const removeUnderscoredDirs = walkAsync(file =>
  file.dir ? !file.name.match(/^_/) : true
)

const removeNonSvelteFiles = walkAsync(file => {
  const isUnderscored = file.name.match(/^_/)
  const isPage = !file.badExt && !isUnderscored
  const isNormalDir = file.dir && !isUnderscored
  return isPage || isNormalDir || file.isLayout || file.isFallback
})


// TODO became useless apparently... let's keep it just a little longer
/**
 * sortTree
 * @param {Object} tree
 */
function sortTree(tree) {
  tree.dir = tree.dir.map(file => {
    if (file.dir) sortTree(file)
    return file
  })
  tree.dir.sort(file => (file.isLayout ? -1 : 1))
  return tree
}

const defineFiles = walkAsync(file => {
  const frontFiles = ['_layout', '_reset']
  if (file.badExt) return
  file.isLayout = frontFiles.includes(file.name)
  file.isReset = ['_reset'].includes(file.name)
  file.isIndex = ['index'].includes(file.name)
  file.isFallback = ['_fallback'].includes(file.name)
  file.hasParam = file.name.match(/^\[.+\]$/) ? true : false
})


module.exports = { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, sortTree, defineFiles }
