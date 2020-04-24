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

const removeNonSvelteFiles = payload => {
  _removeNonSvelteFiles(payload.tree)
}

function _removeNonSvelteFiles(file){
  file.children = file.children.filter(_file => {
    const isUnderscored = _file.name.match(/^_/)
    const isPage = !_file.badExt && !isUnderscored
    const isNormalDir = _file.children && !isUnderscored
    const keep = isPage || isNormalDir || _file.isLayout || _file.isFallback
    if(_file.children) _removeNonSvelteFiles(_file)
    return keep
  })
}


module.exports = { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles }
