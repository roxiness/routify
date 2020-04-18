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


const removeUnderscoredDirs = createNodeMiddleware(({ file, parent }) => {
  const isUnderscoredDir = file.isDir && file.name.match(/^_/)
  if (isUnderscoredDir){
    const index = parent.children.indexOf(file)
    parent.children.splice(index, 1)
  }
})


const defineFiles = createNodeMiddleware(({ file }) => {
  if (file.badExt) return
  const frontFiles = ['_layout', '_reset']
  file.isLayout = frontFiles.includes(file.name)
  file.isReset = ['_reset'].includes(file.name)
  file.isIndex = ['index'].includes(file.name)
  file.isFallback = ['_fallback'].includes(file.name)
  file.isPage = file.isFile && !file.isLayout && !file.isFallback
})


const removeNonSvelteFiles = createNodeMiddleware(({ file, parent }) => {
  const isUnderscored = file.name.match(/^_/)
  const isPage = !file.badExt && !isUnderscored
  const isNormalDir = file.children && !isUnderscored
  const keep = isPage || isNormalDir || file.isLayout || file.isFallback
  if(!keep){
    const index = parent.children.indexOf(file)
    parent.children.splice(index, 1)
  }
})



module.exports = { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles }
