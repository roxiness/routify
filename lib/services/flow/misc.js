const { makeLegalIdentifier } = require('rollup-pluginutils')
const { walkAsync } = require('../../utils/fp')


const addPath = payload => walkAsyncTree(payload, file =>  {
  let path = file.filepath
  if (file.ext) {
    path = path.slice(0, -(file.ext.length + 1))
  }
  path = path.replace(/\[([^\]]+)\]/g, ':$1')
  file.path = path
})


const addId = payload => walkAsyncTree(payload, file=> {
  if (file.isFile) file.id = makeLegalIdentifier(file.path)
})


const removeUnderscoredDirs = payload => walkAsyncTree(payload, file => {
  return file.dir ? !file.name.match(/^_/) : true
})


const defineFiles = payload => walkAsyncTree(payload, file => {
  if (file.badExt) return
  const frontFiles = ['_layout', '_reset']
  file.isLayout = frontFiles.includes(file.name)
  file.isReset = ['_reset'].includes(file.name)
  file.isIndex = ['index'].includes(file.name)
  file.isFallback = ['_fallback'].includes(file.name)
  file.hasParam = file.name.match(/^\[.+\]$/) ? true : false
})


async function walkAsyncTree(payload, fn) {
  payload.tree = await walkAsync(fn)(payload.tree)
}


const removeNonSvelteFiles = payload => walkAsyncTree(payload, file => {
  const isUnderscored = file.name.match(/^_/)
  const isPage = !file.badExt && !isUnderscored
  const isNormalDir = file.dir && !isUnderscored
  return isPage || isNormalDir || file.isLayout || file.isFallback
})


module.exports = { addPath, addId, removeUnderscoredDirs, removeNonSvelteFiles, defineFiles }
