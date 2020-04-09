const { makeLegalIdentifier } = require('rollup-pluginutils')
const { createNodeMiddleware } = require('../utils/middleware')


const addPath = createNodeMiddleware(({ file }) => {
  let path = file.filepath
  if (file.ext) {
    path = path.slice(0, -(file.ext.length + 1))
  }
  path = path.replace(/\[([^\]]+)\]/g, ':$1')
  file.path = path
})


const addId = createNodeMiddleware(({ file }) => {  
  if (file.isFile) file.id = makeLegalIdentifier(file.path)
})


const removeUnderscoredDirs = createNodeMiddleware(({ file }) => {
  return file.children ? !file.name.match(/^_/) : true
})


const defineFiles = createNodeMiddleware(({ file }) => {
  if (file.badExt) return
  const frontFiles = ['_layout', '_reset']
  file.isLayout = frontFiles.includes(file.name)
  file.isReset = ['_reset'].includes(file.name)
  file.isIndex = ['index'].includes(file.name)
  file.isFallback = ['_fallback'].includes(file.name)
  file.isPage = !file.isLayout && !file.isFallback
  file.hasParam = file.name.match(/^\[.+\]$/) ? true : false
})


const removeNonSvelteFiles = createNodeMiddleware(({ file }) => {
  const isUnderscored = file.name.match(/^_/)
  const isPage = !file.badExt && !isUnderscored
  const isNormalDir = file.children && !isUnderscored
  return isPage || isNormalDir || file.isLayout || file.isFallback
})

function normalizeOptions({ options }) {
  const { extensions } = options
  options.extensions = Array.isArray(extensions) ? extensions : extensions.split(',')
}

module.exports = { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles, normalizeOptions }
