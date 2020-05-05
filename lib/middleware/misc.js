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

const filterTree = payload => {
  const filters = payload.options.childFilters
  if (filters) {
    _filterTree(payload.tree, filters)
  }
}

function _filterTree(node, filters) {
  if (node.children) {
    const filter = filters[node.filepath]
    if (filter) {
      node.children = node.children.filter(filter)
    }
    node.children.forEach(child => _filterTree(child, filters))
  }
}

const sortTree = payload => {
  const sorters = payload.options.childSorters
  if (sorters) {
    _sortChildren(payload.tree, sorters)
  }
}

function _sortChildren(node, sorters) {
  if (node.children) {
    const sorter = sorters[node.filepath];
    if (sorter) {
      node.children.sort(sorter)
    }
    node.children.forEach(child => _sortChildren(child, sorters))
  }
}

module.exports = { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, filterTree, sortTree, defineFiles }
